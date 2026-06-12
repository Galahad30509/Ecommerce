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
    <section className="auth-panel">
      <span className="eyebrow">
        Account
      </span>

      <h1>Register</h1>

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
          Name
          <input
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            required
          />
        </label>

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
            minLength={6}
          />
        </label>

        <button
          type="submit"
          className="primary-button wide-button"
          disabled={loading}
        >
          <UserPlus size={18} />
          {loading
            ? 'Loading...'
            : 'Register'}
        </button>
      </form>

      <p className="auth-note">
        Already registered?{' '}
        <Link to="/login">
          Login
        </Link>
      </p>
    </section>
  );
}
