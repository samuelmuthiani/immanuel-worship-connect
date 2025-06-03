
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { PasswordStrength } from '@/components/ui/PasswordStrength';
import { LogIn, ShieldCheck, User, AlertCircle } from 'lucide-react';
import iwcLogo from '/iwc-logo.png';
import './Login.css';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'member' | 'admin'>('member');
  const navigate = useNavigate();
  const { signIn, user, isAdmin } = useAuth();

  useEffect(() => {
    if (user) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || (isAdmin ? '/admin' : '/member');
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath, { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const validateForm = (isAdminLogin: boolean = false) => {
    const newErrors: FormErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isAdminLogin) {
      const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];
      if (!adminEmails.includes(email.trim())) {
        console.log('Admin login attempted with non-admin email');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent, isAdminLogin: boolean = false) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm(isAdminLogin)) return;
    
    setLoading(true);
    
    try {
      const result = await signIn(email.trim(), password);
      
      if (!result.success) {
        setErrors({ general: result.error || 'Authentication failed' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-iwc-blue/90 via-iwc-orange/60 to-iwc-gold/80 dark:from-gray-900 dark:via-gray-900 dark:to-iwc-blue/80">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 w-[600px] h-[600px] bg-iwc-orange/20 rounded-full blur-3xl opacity-60 animate-pulse-glow" style={{transform:'translate(-50%, -50%)'}} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-iwc-blue/30 rounded-full blur-2xl opacity-40 animate-pulse-glow" />
      </div>
      
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="glossy-logo rounded-full p-3 bg-white/70 dark:bg-gray-900/70 shadow-xl animate-float">
            <img src={iwcLogo} alt="Immanuel Worship Centre Logo" className="h-16 w-16 drop-shadow-lg" />
          </div>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50 glossy-card animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-iwc-blue dark:text-iwc-orange mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'member' | 'admin')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1">
              <TabsTrigger value="member" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600">
                <User className="h-4 w-4" />
                Member
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600">
                <ShieldCheck className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-shake">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                    {errors.general}
                  </p>
                </div>
              </div>
            )}

            <TabsContent value="member">
              <form onSubmit={(e) => handleLogin(e, false)} className="space-y-6">
                <FloatingInput
                  id="member-email"
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError('email');
                  }}
                  error={errors.email}
                  disabled={loading}
                  autoComplete="email"
                  autoFocus
                />

                <div className="space-y-3">
                  <FloatingInput
                    id="member-password"
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearFieldError('password');
                    }}
                    error={errors.password}
                    showPasswordToggle
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  {password && <PasswordStrength password={password} />}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-iwc-blue to-iwc-orange hover:from-iwc-orange hover:to-iwc-blue text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={(e) => handleLogin(e, true)} className="space-y-6">
                <FloatingInput
                  id="admin-email"
                  type="email"
                  label="Admin Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError('email');
                  }}
                  error={errors.email}
                  disabled={loading}
                  autoComplete="email"
                />

                <FloatingInput
                  id="admin-password"
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError('password');
                  }}
                  error={errors.password}
                  showPasswordToggle
                  disabled={loading}
                  autoComplete="current-password"
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-iwc-orange hover:from-iwc-orange hover:to-red-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Admin Access
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
              <Link 
                to="/register" 
                className="text-iwc-blue dark:text-iwc-orange hover:underline font-medium transition-colors"
              >
                Create an account
              </Link>
              <Link 
                to="/reset-password" 
                className="text-gray-600 dark:text-gray-400 hover:text-iwc-orange transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
