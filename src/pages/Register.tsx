import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setRegistered(true);
      // Assign default role in user_roles table
      if (data?.user?.id) {
        await supabase.from('user_roles').insert([
          { user_id: data.user.id, role: 'member', assigned_at: new Date().toISOString() }
        ]);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {registered && (
          <div className="text-green-700 mb-4">
            Registration successful! Please check your email and confirm your address before logging in.
          </div>
        )}
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
          {loading ? 'Registering...' : 'Register'}
        </button>
        <div className="mt-4 text-center">
          <a href="/login" className="text-iwc-blue hover:underline">Already have an account? Login</a>
        </div>
        <div className="mt-4 text-sm text-gray-600 text-center">
          <strong>Note:</strong> You must confirm your email before accessing the member area.
        </div>
      </form>
    </div>
  );
};

export default Register;
