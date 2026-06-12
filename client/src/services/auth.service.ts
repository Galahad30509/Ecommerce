import api from '../api/axios';

import {
  type AuthResponse,
  type LoginInput,
  type ProfileResponse,
  type RegisterInput,
} from '../types/auth.types';

export const login = async (
  data: LoginInput
): Promise<AuthResponse> => {
  const response =
    await api.post(
      '/auth/login',
      data
    );

  return response.data;
};

export const register =
  async (
    data: RegisterInput
  ) => {
    const response =
      await api.post(
        '/auth/register',
        data
      );

    return response.data;
  };

export const getProfile =
  async (): Promise<ProfileResponse> => {
    const response =
      await api.get(
        '/auth/profile'
      );

    return response.data;
  };
