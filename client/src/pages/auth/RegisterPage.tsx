import { useState } from 'react';

import axios from 'axios';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import toast from 'react-hot-toast';

import {
  UserPlus,
} from 'lucide-react';

import { register } from '../../services/auth.service';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] =
    useState('');

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
      await register({
        name,
        email,
        password,
      });

      toast.success(
        'Account created'
      );

      navigate('/login');
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err)
          ? err.response?.data
              ?.message ||
            'Register failed'
          : 'Something went wrong';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
      <span className="inline-flex rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-black uppercase tracking-normal text-teal-700 ring-1 ring-teal-100">
        Account
      </span>

      <h1 className="mt-4 text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
        Register
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
          Name
          <input
            className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-slate-700">
          Email
          <input
            className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
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
            className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            required
            minLength={6}
          />
        </label>

        <button
          type="submit"
          className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading}
        >
          <UserPlus size={18} />
          {loading
            ? 'Loading...'
            : 'Register'}
        </button>
      </form>

      <p className="mt-5 text-sm font-medium text-slate-500">
        Already registered?{' '}
        <Link
          className="font-black text-teal-700 hover:text-teal-800"
          to="/login"
        >
          Login
        </Link>
      </p>
    </section>
  );
}
