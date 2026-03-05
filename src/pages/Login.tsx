
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { PasswordStrength } from '@/components/ui/PasswordStrength';
import { LogIn, ShieldCheck, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import iwcLogo from '/iwc-logo.png';

interface FormErrors { email?: string; password?: string; general?: string; }

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'member' | 'admin'>('member');
  const [verifiedBanner, setVerifiedBanner] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, isAdmin } = useAuth();
  const { toast } = useToast();

  // Detect email verification redirect
  useEffect(() => {
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(location.search);
    
    // Supabase redirects with hash fragments containing type=signup after verification
    const isVerified = hash.includes('type=signup') || 
                       hash.includes('type=magiclink') ||
                       searchParams.get('verified') === 'true';
    
    if (isVerified) {
      setVerifiedBanner(true);
      toast({
        title: '✅ Email Verified!',
        description: 'Your email has been confirmed. You can now sign in to your account.',
      });
      // Clean up URL
      window.history.replaceState({}, document.title, '/login');
    }
  }, [location, toast]);

  useEffect(() => {
    if (user) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || (isAdmin ? '/admin' : '/member');
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath, { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) newErrors.email = 'Invalid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Min 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent, isAdminLogin: boolean = false) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await signIn(email.trim(), password);
      if (!result.success) setErrors({ general: result.error || 'Authentication failed' });
    } catch { setErrors({ general: 'An unexpected error occurred.' }); }
    finally { setLoading(false); }
  };

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img src={iwcLogo} alt="IWC" className="h-14 w-14 mb-4" />
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'DM Serif Display, serif' }}>Welcome Back</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Email verified banner */}
        {verifiedBanner && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <p className="text-green-800 dark:text-green-200 font-medium text-sm">Email Verified Successfully!</p>
              <p className="text-green-600 dark:text-green-400 text-xs mt-0.5">You can now sign in with your credentials.</p>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl p-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'member' | 'admin')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted rounded-xl p-1">
              <TabsTrigger value="member" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <User className="h-3.5 w-3.5" /> Member
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" /> Admin
              </TabsTrigger>
            </TabsList>

            {errors.general && (
              <div className="mb-5 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                <p className="text-destructive text-sm">{errors.general}</p>
              </div>
            )}

            <TabsContent value="member">
              <form onSubmit={(e) => handleLogin(e, false)} className="space-y-5">
                <FloatingInput id="member-email" type="email" label="Email Address" value={email} onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }} error={errors.email} disabled={loading} autoComplete="email" autoFocus />
                <div className="space-y-2">
                  <FloatingInput id="member-password" type="password" label="Password" value={password} onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }} error={errors.password} showPasswordToggle disabled={loading} autoComplete="current-password" />
                  {password && <PasswordStrength password={password} />}
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 font-semibold">
                  {loading ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" /> Signing In...</> : <><LogIn className="h-4 w-4 mr-2" /> Sign In</>}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={(e) => handleLogin(e, true)} className="space-y-5">
                <FloatingInput id="admin-email" type="email" label="Admin Email" value={email} onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }} error={errors.email} disabled={loading} autoComplete="email" />
                <FloatingInput id="admin-password" type="password" label="Password" value={password} onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }} error={errors.password} showPasswordToggle disabled={loading} autoComplete="current-password" />
                <Button type="submit" disabled={loading} className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl h-12 font-semibold">
                  {loading ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive-foreground mr-2" /> Signing In...</> : <><ShieldCheck className="h-4 w-4 mr-2" /> Admin Access</>}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-border flex justify-between items-center text-sm">
            <Link to="/register" className="text-primary hover:underline font-medium">Create an account</Link>
            <Link to="/reset-password" className="text-muted-foreground hover:text-foreground">Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
