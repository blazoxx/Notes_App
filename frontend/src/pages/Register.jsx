import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { user, register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error('Name too short');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return toast.error('Enter a valid email');
    if (form.password.length < 6) return toast.error('Password must be 6+ chars');
    setBusy(true);
    try {
      await register(form.name.trim(), form.email, form.password);
      toast.success('Account created');
      nav('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sign up failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-50 dark:bg-neutral-900">
      <form onSubmit={submit} className="w-full max-w-sm bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="w-6 h-6 text-amber-500" />
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Create account</h1>
        </div>
        {['name','email','password'].map((f) => (
          <div key={f} className="mb-4">
            <label className="block text-sm mb-1 capitalize text-neutral-700 dark:text-neutral-200">{f}</label>
            <input
              type={f === 'password' ? 'password' : f === 'email' ? 'email' : 'text'}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-400"
              value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} required />
          </div>
        ))}
        <button disabled={busy} className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium">
          {busy ? 'Creating…' : 'Sign up'}
        </button>
        <p className="text-sm mt-4 text-neutral-600 dark:text-neutral-300 text-center">
          Already have an account? <Link to="/login" className="text-amber-600 hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
