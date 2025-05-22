import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else {
      // Check if admin
      const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];
      if (data.user && adminEmails.includes(data.user.email)) {
        navigate('/admin');
      } else {
        navigate('/member');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Member Login</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="mb-4 w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="mb-6 w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-iwc-blue hover:bg-iwc-orange text-white font-bold py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="mt-4 text-center">
          <a href="/register" className="text-iwc-blue hover:underline">Don't have an account? Register</a>
        </div>
        <div className="mt-4 text-sm text-gray-600 text-center">
          <strong>Note:</strong> Only confirmed email addresses can access the member area.
        </div>
      </form>
    </div>
  );
};

export default Login;
