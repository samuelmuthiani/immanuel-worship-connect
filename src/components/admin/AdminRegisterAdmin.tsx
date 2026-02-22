import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ShieldPlus, UserPlus, AlertCircle } from 'lucide-react';

export const AdminRegisterAdmin: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);

      // Use edge function to create admin (requires service role)
      const { data, error: fnError } = await supabase.functions.invoke('admin-action', {
        body: {
          action: 'register_admin',
          payload: { email: email.trim(), password }
        }
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      toast({
        title: 'Admin Registered',
        description: `New admin account created for ${email}`,
      });
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error('Error registering admin:', err);
      setError(err.message || 'Failed to register admin');
      toast({
        title: 'Error',
        description: err.message || 'Failed to register admin',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <EnhancedCard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldPlus className="h-5 w-5 text-primary" />
          Register New Admin
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          <FloatingInput
            id="admin-reg-email"
            type="email"
            label="New Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <FloatingInput
            id="admin-reg-password"
            type="password"
            label="Temporary Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordToggle
            disabled={loading}
          />
          <Button type="submit" disabled={loading} className="w-full gap-2">
            <UserPlus className="h-4 w-4" />
            {loading ? 'Creating...' : 'Create Admin Account'}
          </Button>
        </form>
      </CardContent>
    </EnhancedCard>
  );
};
