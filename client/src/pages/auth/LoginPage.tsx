import { useState } from 'react';

import axios from 'axios';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import toast from 'react-hot-toast';

import {
  LogIn,
} from 'lucide-react';

import { login } from '../../services/auth.service';

import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      const result =
        await login({
          email,
          password,
        });

      auth.login(
        result.token,
        result.user
      );

      toast.success(
        'Logged in'
      );

      navigate('/');
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err)
          ? err.response?.data
              ?.message ||
            'Login failed'
          : 'Something went wrong';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
      <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-black uppercase tracking-normal text-emerald-700 ring-1 ring-emerald-100">
        Account
      </span>

      <h1 className="mt-4 text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
        Login
      </h1>

      {error && (
        <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </p>
      )}

      <form
        className="mt-6 grid gap-4"
        onSubmit={handleSubmit}
      >
        <label className="grid gap-2 text-sm font-black text-slate-700">
          Email
          <input
            className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-slate-700">
          Password
          <input
            className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            required
          />
        </label>

        <button
          type="submit"
          className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading}
        >
          <LogIn size={18} />
          {loading
            ? 'Loading...'
            : 'Login'}
        </button>
      </form>

      <p className="mt-5 text-sm font-medium text-slate-500">
        New customer?{' '}
        <Link
          className="font-black text-emerald-700 hover:text-emerald-800"
          to="/register"
        >
          Create account
        </Link>
      </p>
    </section>
  );
}
