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
    <section className="auth-panel">
      <span className="eyebrow">
        Account
      </span>

      <h1>Login</h1>

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      <form
        className="stack-form"
        onSubmit={handleSubmit}
      >
        <label>
          Email
          <input
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

        <label>
          Password
          <input
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
          className="primary-button wide-button"
          disabled={loading}
        >
          <LogIn size={18} />
          {loading
            ? 'Loading...'
            : 'Login'}
        </button>
      </form>

      <p className="auth-note">
        New customer?{' '}
        <Link to="/register">
          Create account
        </Link>
      </p>
    </section>
  );
}
