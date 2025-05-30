
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn, ShieldCheck, User, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Welcome Back</h2>
        
        <Tabs defaultValue="member" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-700">
            <TabsTrigger value="member" className="flex items-center justify-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 text-gray-700 dark:text-gray-300">
              <User size={18} />
              <span>Member</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center justify-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 text-gray-700 dark:text-gray-300">
              <ShieldCheck size={18} />
              <span>Admin</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="member">
            <form onSubmit={(e) => handleLogin(e, false)}>
              {error && (
                <div className="text-red-600 dark:text-red-400 mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="member-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <Input
                  id="member-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="member-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="member-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-iwc-blue hover:bg-iwc-orange text-white flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? 'Logging in...' : (
                  <>
                    <LogIn size={18} />
                    <span>Login as Member</span>
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="admin">
            <form onSubmit={(e) => handleLogin(e, true)}>
              {error && (
                <div className="text-red-600 dark:text-red-400 mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Admin Email
                </label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-iwc-red hover:bg-iwc-orange text-white flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? 'Logging in...' : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Login as Administrator</span>
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 text-center">
          <a href="/register" className="text-iwc-blue dark:text-iwc-orange hover:underline">
            Don't have an account? Register
          </a>
        </div>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          <strong>Note:</strong> Only confirmed email addresses can access the member area.
        </div>
      </div>
    </div>
  );
};

export default Login;
