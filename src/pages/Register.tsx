
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { PasswordStrength } from '@/components/ui/PasswordStrength';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import iwcLogo from '/iwc-logo.png';

interface FormErrors { email?: string; password?: string; confirmPassword?: string; general?: string; terms?: string; }

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { signUp, user } = useAuth();

  useEffect(() => { if (user) navigate('/', { replace: true }); }, [user, navigate]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) newErrors.email = 'Invalid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Min 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords don\'t match';
    if (!acceptedTerms || !acceptedPrivacy) newErrors.terms = 'You must accept the Terms and Policy';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const recordPolicyAcceptance = async (userId: string) => {
    try {
      await supabase.from('policy_acceptances').insert([
        { user_id: userId, policy_type: 'terms' },
        { user_id: userId, policy_type: 'privacy' }
      ]);
    } catch (err) {
      console.error('Error recording policy acceptance:', err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await signUp(email.trim(), password);
      if (result.success) {
        if (result.user?.id) {
          await recordPolicyAcceptance(result.user.id);
        }
        setSuccess(true);
      } else {
        setErrors({ general: result.error || 'Registration failed' });
      }
    } catch { setErrors({ general: 'An unexpected error occurred.' }); }
    finally { setLoading(false); }
  };

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center">
          <img src={iwcLogo} alt="IWC" className="h-14 w-14 mx-auto mb-6" />
          <div className="bg-card border border-border rounded-2xl p-8">
            <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: 'DM Serif Display, serif' }}>Check Your Email</h2>
            <p className="text-muted-foreground text-sm mb-6">
              We've sent a confirmation link to <strong className="text-foreground">{email}</strong>. Click the link to activate your account.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full rounded-xl h-12 bg-primary">Back to Login</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <img src={iwcLogo} alt="IWC" className="h-14 w-14 mb-4" />
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'DM Serif Display, serif' }}>Join Our Community</h1>
          <p className="text-muted-foreground text-sm mt-1">Create your account</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          {errors.general && (
            <div className="mb-5 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
              <p className="text-destructive text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <FloatingInput id="register-email" type="email" label="Email Address" value={email} onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }} error={errors.email} disabled={loading} autoComplete="email" autoFocus />
            <div className="space-y-2">
              <FloatingInput id="register-password" type="password" label="Password" value={password} onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }} error={errors.password} showPasswordToggle disabled={loading} autoComplete="new-password" />
              {password && <PasswordStrength password={password} />}
            </div>
            <FloatingInput id="confirm-password" type="password" label="Confirm Password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword'); }} error={errors.confirmPassword} showPasswordToggle disabled={loading} autoComplete="new-password" />

            {/* Terms and Policy Acceptance */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox id="accept-terms-policy" checked={acceptedTerms && acceptedPrivacy} onCheckedChange={(checked) => { setAcceptedTerms(!!checked); setAcceptedPrivacy(!!checked); clearFieldError('terms'); }} className="mt-0.5" />
                <label htmlFor="accept-terms-policy" className="text-sm text-muted-foreground leading-tight">
                  I have read and agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-primary hover:underline font-medium">Terms and Policy</Link>
                </label>
              </div>
              {errors.terms && <p className="text-destructive text-xs">{errors.terms}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 font-semibold">
              {loading ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" /> Creating...</> : <><UserPlus className="h-4 w-4 mr-2" /> Create Account</>}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link to="/login" className="text-primary hover:underline font-medium text-sm">Already have an account? Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
