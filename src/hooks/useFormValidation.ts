
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

  const validateField = useCallback(async (name: string, value: unknown) => {
    try {
      // Just clear the error for this field on change
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
  }, []);

  const handleSubmit = useCallback(async (data: unknown) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const validation = await DataValidation.validateAndSanitize(data, schema);

      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        const errorResult = validation as { success: false; errors: string[] };
        errorResult.errors.forEach((error: string) => {
          const colonIndex = error.indexOf(': ');
          if (colonIndex > -1) {
            const field = error.substring(0, colonIndex);
            const message = error.substring(colonIndex + 2);
            fieldErrors[field] = message;
          } else {
            fieldErrors['general'] = error;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      const successResult = validation as { success: true; data: T };
      await onSubmit(successResult.data);
    } catch (error: unknown) {
      console.error('Form submission error:', error);
      setErrors({ general: (error instanceof Error ? error.message : String(error)) || 'An unexpected error occurred' });
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
