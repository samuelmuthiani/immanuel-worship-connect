import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import iwcLogo from '/iwc-logo.png';
import './Login.css';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [confetti, setConfetti] = useState(false);

  const accessToken = new URLSearchParams(window.location.search).get('access_token');
  const refreshToken = new URLSearchParams(window.location.search).get('refresh_token');

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return '';
    if (pwd.length < 6) return 'weak';
    if (/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(pwd)) return 'strong';
    if (pwd.length >= 8) return 'medium';
    return 'weak';
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        if (sessionError) throw sessionError;
      }
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setConfetti(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-iwc-blue/90 via-iwc-orange/60 to-iwc-gold/80 dark:from-gray-900 dark:via-gray-900 dark:to-iwc-blue/80 animate-bg-glow">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/2 w-[600px] h-[600px] bg-iwc-orange/20 rounded-full blur-3xl opacity-60 animate-pulse-glow" style={{transform:'translate(-50%, -50%)'}} />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-iwc-blue/30 rounded-full blur-2xl opacity-40 animate-pulse-glow" />
        </div>
        <div className="relative z-10 w-full max-w-md">
          <div className="flex flex-col items-center mb-4">
            <div className="glossy-logo rounded-full p-2 bg-white/60 dark:bg-gray-900/60 shadow-xl animate-float">
              <img src={iwcLogo} alt="Immanuel Worship Centre Logo" className="h-14 w-14 drop-shadow-lg" />
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border-2 border-transparent hover:border-iwc-orange/60 transition-all duration-300 animate-fade-in-up glossy-card">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Password Updated!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Your password has been changed. You can now log in with your new password.</p>
              <Button onClick={() => window.location.href = '/login'} className="w-full glossy-btn bg-gradient-to-r from-iwc-blue to-iwc-orange hover:from-iwc-orange hover:to-iwc-blue text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300 animate-bounce-once">Back to Login</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-iwc-blue/90 via-iwc-orange/60 to-iwc-gold/80 dark:from-gray-900 dark:via-gray-900 dark:to-iwc-blue/80 animate-bg-glow">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 w-[600px] h-[600px] bg-iwc-orange/20 rounded-full blur-3xl opacity-60 animate-pulse-glow" style={{transform:'translate(-50%, -50%)'}} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-iwc-blue/30 rounded-full blur-2xl opacity-40 animate-pulse-glow" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-4">
          <div className="glossy-logo rounded-full p-2 bg-white/60 dark:bg-gray-900/60 shadow-xl animate-float">
            <img src={iwcLogo} alt="Immanuel Worship Centre Logo" className="h-14 w-14 drop-shadow-lg" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border-2 border-transparent hover:border-iwc-orange/60 transition-all duration-300 animate-fade-in-up glossy-card">
          <h2 className="text-2xl font-extrabold mb-2 text-center text-iwc-blue dark:text-iwc-orange tracking-tight animate-fade-in">Set New Password</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 animate-fade-in-slow">Enter your new password below.</p>
          <form onSubmit={handleUpdate} className="space-y-6">
            {error && (
              <div className="text-red-600 dark:text-red-400 mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800 animate-shake">{error}</div>
            )}
            <div className="relative mb-4 group">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder=" "
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setPasswordStrength(getPasswordStrength(e.target.value));
                }}
                required
                className="floating-input peer"
              />
              <label htmlFor="new-password" className="floating-label">New Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-iwc-orange transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {password && (
                <div className="password-strength mt-2">
                  <div className={`password-strength-bar password-strength-${passwordStrength}`}></div>
                </div>
              )}
            </div>
            <div className="relative mb-4 group">
              <Input
                id="confirm-new-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder=" "
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="floating-input peer"
              />
              <label htmlFor="confirm-new-password" className="floating-label">Confirm New Password</label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-iwc-orange transition-colors"
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button
              type="submit"
              className="w-full glossy-btn bg-gradient-to-r from-iwc-blue to-iwc-orange hover:from-iwc-orange hover:to-iwc-blue text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300 animate-bounce-once"
              disabled={loading}
            >
              {loading ? 'Updating...' : <><Lock size={18} /><span>Update Password</span></>}
            </Button>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <a href="/login" className="hover:text-iwc-orange transition-colors">Back to Login</a>
            </div>
          </form>
        </div>
      </div>
      {success && confetti && (
        <>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                background: `hsl(${Math.random() * 360}, 80%, 60%)`,
                animationDelay: `${Math.random()}s`,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default UpdatePassword;
