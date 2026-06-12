import { createContext, useState } from 'react';

import type { User } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  token: string | null;

  login: (
    token: string,
    user: User
  ) => void;

  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const [user, setUser] =
    useState<User | null>(() => {

      try {

        const savedUser =
          localStorage.getItem(
            'user'
          );

        return savedUser
          ? JSON.parse(savedUser)
          : null;

      } catch {

        localStorage.removeItem(
          'user'
        );

        return null;
      }

    });

  const [token, setToken] =
    useState<string | null>(
      localStorage.getItem(
        'token'
      )
    );

  const login = (
    token: string,
    user: User
  ) => {

    localStorage.setItem(
      'token',
      token
    );

    localStorage.setItem(
      'user',
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);
  };

  const logout = () => {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'user'
    );

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};