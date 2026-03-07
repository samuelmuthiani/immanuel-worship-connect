
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { PasswordStrength } from '@/components/ui/PasswordStrength';
import { Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import iwcLogo from '/iwc-logo.png';
import './Login.css';

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

import { useAuth } from '@/contexts/AuthContext';

const UpdatePassword = () => {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY or SIGNED_IN event from the recovery link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('UpdatePassword auth event:', event, !!session);
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setSessionReady(true);
        setCheckingSession(false);
      }
    });

    // Also check if there's already an active session (e.g. recovery already processed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      }
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await updatePassword(password);
      if (!result.success) throw new Error(result.error);
      setSuccess(true);
    } catch (err: unknown) {
      setErrors({ general: (err instanceof Error ? err.message : String(err)) || 'Failed to update password.' });
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Shared background wrapper
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-iwc-blue/90 via-iwc-orange/60 to-iwc-gold/80 dark:from-gray-900 dark:via-gray-900 dark:to-iwc-blue/80">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 w-[600px] h-[600px] bg-iwc-orange/20 rounded-full blur-3xl opacity-60 animate-pulse-glow" style={{ transform: 'translate(-50%, -50%)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-iwc-blue/30 rounded-full blur-2xl opacity-40 animate-pulse-glow" />
      </div>
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="glossy-logo rounded-full p-3 bg-white/70 dark:bg-gray-900/70 shadow-xl animate-float">
            <img src={iwcLogo} alt="Immanuel Worship Centre Logo" className="h-16 w-16 drop-shadow-lg" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );

  if (checkingSession) {
    return (
      <Wrapper>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50 glossy-card animate-fade-in-up text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-iwc-blue" />
          <p className="text-gray-600 dark:text-gray-400">Verifying your reset link...</p>
        </div>
      </Wrapper>
    );
  }

  if (!sessionReady) {
    return (
      <Wrapper>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50 glossy-card animate-fade-in-up text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Reset Link Expired</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This password reset link has expired or is invalid. Please request a new one.
          </p>
          <Button
            onClick={() => window.location.href = '/reset-password'}
            className="w-full bg-gradient-to-r from-iwc-blue to-iwc-orange hover:from-iwc-orange hover:to-iwc-blue text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300"
          >
            Request New Reset Link
          </Button>
        </div>
      </Wrapper>
    );
  }

  if (success) {
    return (
      <Wrapper>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50 glossy-card animate-fade-in-up text-center">
          <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-6 animate-bounce-once" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Password Updated!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your password has been successfully updated. You can now log in with your new password.
          </p>
          <Button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-gradient-to-r from-iwc-blue to-iwc-orange hover:from-iwc-orange hover:to-iwc-blue text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300"
          >
            Back to Login
          </Button>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50 glossy-card animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-iwc-blue dark:text-iwc-orange mb-2">Set New Password</h1>
          <p className="text-gray-600 dark:text-gray-400">Enter your new password below</p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-shake">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">{errors.general}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-3">
            <FloatingInput
              id="new-password"
              type="password"
              label="New Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }}
              error={errors.password}
              showPasswordToggle
              disabled={loading}
              autoComplete="new-password"
              autoFocus
            />
            {password && <PasswordStrength password={password} />}
          </div>

          <FloatingInput
            id="confirm-new-password"
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword'); }}
            error={errors.confirmPassword}
            showPasswordToggle
            disabled={loading}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-iwc-blue to-iwc-orange hover:from-iwc-orange hover:to-iwc-blue text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Update Password
              </>
            )}
          </Button>

          <div className="text-center">
            <a href="/login" className="text-gray-600 dark:text-gray-400 hover:text-iwc-orange transition-colors text-sm">
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </Wrapper>
  );
};

export default UpdatePassword;
