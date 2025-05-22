
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn, ShieldCheck, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
        
        <Tabs defaultValue="member" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="member" className="flex items-center justify-center gap-2">
              <User size={18} />
              <span>Member</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center justify-center gap-2">
              <ShieldCheck size={18} />
              <span>Admin</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="member">
            <form onSubmit={(e) => handleLogin(e, false)}>
              {error && <div className="text-red-600 mb-4 p-2 bg-red-50 rounded">{error}</div>}
              
              <div className="mb-4">
                <label htmlFor="member-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  id="member-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="member-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Input
                  id="member-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-iwc-blue hover:bg-iwc-orange flex items-center justify-center gap-2"
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
              {error && <div className="text-red-600 mb-4 p-2 bg-red-50 rounded">{error}</div>}
              
              <div className="mb-4">
                <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-iwc-red hover:bg-iwc-orange flex items-center justify-center gap-2"
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
          <a href="/register" className="text-iwc-blue hover:underline">Don't have an account? Register</a>
        </div>
        <div className="mt-4 text-sm text-gray-600 text-center">
          <strong>Note:</strong> Only confirmed email addresses can access the member area.
        </div>
      </div>
    </div>
  );
};

export default Login;
