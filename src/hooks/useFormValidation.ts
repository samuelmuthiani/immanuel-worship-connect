
import { useState, useCallback } from 'react';
import { DataValidation } from '@/utils/dataValidation';
import { z } from 'zod';

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
}

export function useFormValidation<T>({ schema, onSubmit }: UseFormValidationOptions<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(async (name: string, value: any) => {
    try {
      // Validate single field
      const fieldSchema = schema.pick({ [name]: true } as any);
      await fieldSchema.parseAsync({ [name]: value });
      
      // Clear error if validation passes
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors[0];
        setErrors(prev => ({
          ...prev,
          [name]: fieldError.message
        }));
      }
    }
  }, [schema]);

  const handleSubmit = useCallback(async (data: unknown) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const validation = await DataValidation.validateAndSanitize(data, schema);
      
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.errors.forEach(error => {
          const [field, message] = error.split(': ');
          fieldErrors[field] = message;
        });
        setErrors(fieldErrors);
        return;
      }

      await onSubmit(validation.data);
    } catch (error: any) {
      console.error('Form submission error:', error);
      setErrors({ general: error.message || 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  }, [schema, onSubmit]);

  return {
    errors,
    isSubmitting,
    validateField,
    handleSubmit,
    clearErrors: () => setErrors({})
  };
}
