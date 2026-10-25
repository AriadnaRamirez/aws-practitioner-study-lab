/** Auth contracts for AWS Practitioner Study Lab (APS-4). */

export type UserRole = 'STUDENT' | 'ADMIN';

export interface PublicUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  timezone: string;
  podiumHidden: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface AuthResponse {
  user: PublicUser;
  tokens: AuthTokens;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  timezone?: string;
  /** Optional GuestProbe id from marketing trial (APS-13 conversion). */
  guestProbeId?: string;
}

export interface LoginRequest {
  /** Email or username */
  identifier: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  timezone?: string;
  podiumHidden?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 24;
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
export const PASSWORD_MIN = 8;
