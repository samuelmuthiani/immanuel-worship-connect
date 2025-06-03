import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn, ShieldCheck, User, Eye, EyeOff } from 'lucide-react';
import iwcLogo from '/iwc-logo.png';
import './Login.css'; // Add this import for custom styles

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check existing session
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        redirectUserBasedOnRole(data.session.user.id);
      }
    };
    checkSession();
  }, [navigate]);

  const redirectUserBasedOnRole = async (userId: string) => {
    // Special case for known admin emails
    const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];
    const { data: userData } = await supabase.auth.getUser();
    
    if (userData?.user && adminEmails.includes(userData.user.email || '')) {
      navigate('/admin');
      return;
    }
    
    // Check user_roles table
    const { data: roles, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error checking roles:', error);
      navigate('/member'); // Default to member area on error
      return;
    }
    
    // Check if user has admin role
    if (roles && roles.some(role => role.role === 'admin')) {
      navigate('/admin');
    } else {
      navigate('/member');
    }
  };

  const handleLogin = async (e: React.FormEvent, isAdmin: boolean = false) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      // Special case for admin emails
      const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];
      
      if (data.user) {
        if (isAdmin) {
          // Admin login attempt
          if (adminEmails.includes(data.user.email || '')) {
            // Known admin email
            navigate('/admin');
            toast({
              title: "Welcome, Admin",
              description: "You have been logged in as an administrator.",
            });
          } else {
            // Check if the user has an admin role in the database
            const { data: roles, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', data.user.id);
            
            if (roleError) throw roleError;
            
            if (roles && roles.some(role => role.role === 'admin')) {
              navigate('/admin');
              toast({
                title: "Welcome, Admin",
                description: "You have been logged in as an administrator.",
              });
            } else {
              // Not an admin
              toast({
                title: "Access Denied",
                description: "Your account does not have administrator privileges.",
                variant: "destructive",
              });
              // Sign out since they tried to log in as admin but aren't
              await supabase.auth.signOut();
              setLoading(false);
              return;
            }
          }
        } else {
          // Member login - redirect based on role
          redirectUserBasedOnRole(data.user.id);
          toast({
            title: "Login Successful",
            description: "Welcome to Immanuel Worship Centre.",
          });
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to login.");
      toast({
        title: "Login Failed",
        description: err.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return '';
    if (pwd.length < 6) return 'weak';
    if (/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(pwd)) return 'strong';
    if (pwd.length >= 8) return 'medium';
    return 'weak';
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-iwc-blue/90 via-iwc-orange/60 to-iwc-gold/80 dark:from-gray-900 dark:via-gray-900 dark:to-iwc-blue/80 animate-bg-glow">
      {/* Animated background gloss */}
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
          <h2 className="text-2xl font-extrabold mb-2 text-center text-iwc-blue dark:text-iwc-orange tracking-tight animate-fade-in">Sign In</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 animate-fade-in-slow">Welcome back to IWC. Excellence in every detail.</p>
          <Tabs defaultValue="member" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <TabsTrigger value="member" className="tab-btn">
                <User size={18} />
                <span>Member</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="tab-btn">
                <ShieldCheck size={18} />
                <span>Admin</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="member">
              <form onSubmit={(e) => handleLogin(e, false)} className="space-y-6">
                {error && (
                  <div className="text-red-600 dark:text-red-400 mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800 animate-shake">
                    {error}
                  </div>
                )}
                <div className="relative mb-4 group">
                  <Input
                    id="member-email"
                    type="email"
                    placeholder=" "
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="floating-input peer"
                  />
                  <label htmlFor="member-email" className="floating-label">Email</label>
                </div>
                <div className="relative mb-4 group">
                  <Input
                    id="member-password"
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
                  <label htmlFor="member-password" className="floating-label">Password</label>
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
                <Button
                  type="submit"
                  className="w-full glossy-btn bg-gradient-to-r from-iwc-blue to-iwc-orange hover:from-iwc-orange hover:to-iwc-blue text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300 animate-bounce-once"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : <><LogIn size={18} /><span>Login</span></>}
                </Button>
                <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <a href="/register" className="hover:text-iwc-orange transition-colors">Create account</a>
                  <a href="/reset-password" className="hover:text-iwc-orange transition-colors">Forgot password?</a>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="admin">
              <form onSubmit={(e) => handleLogin(e, true)} className="space-y-6">
                {error && (
                  <div className="text-red-600 dark:text-red-400 mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800 animate-shake">
                    {error}
                  </div>
                )}
                <div className="relative mb-4 group">
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder=" "
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="floating-input peer"
                  />
                  <label htmlFor="admin-email" className="floating-label">Admin Email</label>
                </div>
                <div className="relative mb-4 group">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder=" "
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="floating-input peer"
                  />
                  <label htmlFor="admin-password" className="floating-label">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-iwc-orange transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button
                  type="submit"
                  className="w-full glossy-btn bg-gradient-to-r from-iwc-red to-iwc-orange hover:from-iwc-orange hover:to-iwc-red text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300 animate-bounce-once"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : <><ShieldCheck size={18} /><span>Admin Login</span></>}
                </Button>
                <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <a href="/register" className="hover:text-iwc-orange transition-colors">Create account</a>
                  <a href="/reset-password" className="hover:text-iwc-orange transition-colors">Forgot password?</a>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
