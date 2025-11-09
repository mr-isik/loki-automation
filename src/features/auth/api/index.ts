import { apiClient } from "@/lib/api";

import { ForgotPasswordFormData, ResetPasswordFormData } from "../types";
import {
  LoginFormData,
  loginResponseSchema,
  loginSchema,
  refreshTokenResponseSchema,
  SignupFormData,
  verifyOauthResponseSchema,
} from "../utils/validation";

const AUTH_PATH = "/auth";
const USERS_PATH = "/users";

export const AuthAPI = {
  async login(request: LoginFormData) {
    const { data, error, success } = await apiClient.post(
      `${AUTH_PATH}/login`,
      request,
      {
        request: loginSchema,
        response: loginResponseSchema,
      }
    );

    return { data, error, success };
  },

  async signup(request: SignupFormData) {
    const { data, error, success } = await apiClient.post(
      `${AUTH_PATH}/register`,
      {
        name: request.username,
        email: request.email,
        password: request.password,
      },
      {
        response: loginResponseSchema,
      }
    );

    return { data, error, success };
  },

  async forgotPassword(data: ForgotPasswordFormData) {
    const { error, success } = await apiClient.post(
      `${USERS_PATH}/forgot-password`,
      data
    );

    return { error, success };
  },

  async resetPassword(data: ResetPasswordFormData, token: string | null) {
    const { error, success } = await apiClient.post(
      `${USERS_PATH}/reset-password`,
      { data, token }
    );

    return { error, success };
  },

  async logout() {
    const { error, success } = await apiClient.post(`${AUTH_PATH}/logout`);

    return { error, success };
  },

  async refreshToken(refreshToken: string) {
    const { data, error, success } = await apiClient.post(
      `${AUTH_PATH}/refresh`,
      { refresh_token: refreshToken },
      {
        response: refreshTokenResponseSchema,
      }
    );

    return { data, error, success };
  },

  async verifyOauthSession(session: string) {
    const { data, error, success } = await apiClient.post(
      `${AUTH_PATH}/exchange`,
      { session },
      {
        response: verifyOauthResponseSchema,
      }
    );

    return { data, error, success };
  },
};
