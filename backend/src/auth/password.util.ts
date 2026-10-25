import * as bcrypt from 'bcrypt';
import { PASSWORD_MIN } from '@aps/shared';

const BCRYPT_ROUNDS = 12;

const DENYLIST = new Set(
  [
    'password',
    'password1',
    'password123',
    '12345678',
    '123456789',
    'qwerty123',
    'admin123',
    'letmein1',
    'welcome1',
    'changeme',
    'changeme1',
  ].map((s) => s.toLowerCase()),
);

export interface PasswordStrengthResult {
  ok: boolean;
  errors: string[];
}

export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const errors: string[] = [];

  if (!password || password.length < PASSWORD_MIN) {
    errors.push(`La contraseña debe tener al menos ${PASSWORD_MIN} caracteres`);
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Debe incluir al menos una minúscula');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe incluir al menos una mayúscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Debe incluir al menos un número');
  }
  if (DENYLIST.has(password.toLowerCase())) {
    errors.push('Esta contraseña es demasiado común');
  }

  return { ok: errors.length === 0, errors };
}

export function hasRecommendedSymbol(password: string): boolean {
  return /[^A-Za-z0-9]/.test(password);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
