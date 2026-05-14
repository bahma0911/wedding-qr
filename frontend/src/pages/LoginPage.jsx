import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const data = await login({ email, password });
      setAuth(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login');
    }
  };

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-[#7c4a37]">Organizer Login</h1>
        <p className="mt-2 text-sm text-[#6c4c3d]">Manage your wedding event and view guest uploads.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm text-[#5d4037]">
            Email
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-2 w-full rounded-3xl border border-[#e2cfc5] px-4 py-3" />
          </label>
          <label className="block text-sm text-[#5d4037]">
            Password
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="mt-2 w-full rounded-3xl border border-[#e2cfc5] px-4 py-3" />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="w-full rounded-3xl bg-[#8a5b47] px-5 py-3 text-white">Login</button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
