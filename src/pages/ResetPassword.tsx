import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';
import iwcLogo from '/iwc-logo.png';
import './Login.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + '/update-password',
      });
      if (error) throw error;
      setSent(true);
      setConfetti(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
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
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Check Your Email</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">If an account exists for <strong>{email}</strong>, a password reset link has been sent.</p>
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
          <h2 className="text-2xl font-extrabold mb-2 text-center text-iwc-blue dark:text-iwc-orange tracking-tight animate-fade-in">Reset Password</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 animate-fade-in-slow">Enter your email to receive a password reset link.</p>
          <form onSubmit={handleReset} className="space-y-6">
            {error && (
              <div className="text-red-600 dark:text-red-400 mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800 animate-shake">{error}</div>
            )}
            <div className="relative mb-4 group">
              <Input
                id="reset-email"
                type="email"
                placeholder=" "
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="floating-input peer"
              />
              <label htmlFor="reset-email" className="floating-label">Email</label>
            </div>
            <Button
              type="submit"
              className="w-full glossy-btn bg-gradient-to-r from-iwc-blue to-iwc-orange hover:from-iwc-orange hover:to-iwc-blue text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300 animate-bounce-once"
              disabled={loading}
            >
              {loading ? 'Sending...' : <><Mail size={18} /><span>Send Reset Link</span></>}
            </Button>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <a href="/login" className="hover:text-iwc-orange transition-colors">Back to Login</a>
            </div>
          </form>
          {sent && confetti && (
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
      </div>
    </div>
  );
};

export default ResetPassword;
