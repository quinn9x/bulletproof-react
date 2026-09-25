import Cookies from 'js-cookie';
import { delay } from 'msw';
import { z } from 'zod';

import { db } from './db';

export const AUTH_COOKIE = 'bulletproof_react_app_token';

const tokenSchema = z.object({
  id: z.string().min(1),
  exp: z.number().optional(),
});

export const decodeMockToken = (str: string): unknown => {
  const decode =
    typeof window === 'undefined'
      ? (value: string) => Buffer.from(value, 'base64').toString('utf8')
      : window.atob;

  return JSON.parse(decode(str));
};

export const sanitizeUser = <T extends object>(
  user: T,
): Omit<T, 'password' | 'iat'> => {
  const result = { ...user };

  delete (result as Partial<T> & { password?: unknown }).password;
  delete (result as Partial<T> & { iat?: unknown }).iat;

  return result as Omit<T, 'password' | 'iat'>;
};

export const networkDelay = () => {
  const delayTime = import.meta.env.TEST
    ? 200
    : Math.floor(Math.random() * 700) + 300;

  return delay(delayTime);
};

export function requireAuth(cookies: Record<string, string>) {
  try {
    const encodedToken = cookies[AUTH_COOKIE] ?? Cookies.get(AUTH_COOKIE);

    if (!encodedToken) {
      return {
        error: 'Unauthorized',
        user: null,
      };
    }

    const token = tokenSchema.parse(decodeMockToken(encodedToken));

    if (token.exp && token.exp < Date.now()) {
      return {
        error: 'Unauthorized',
        user: null,
      };
    }

    const user = db.user.findFirst({
      where: {
        id: {
          equals: token.id,
        },
      },
    });

    if (!user) {
      return {
        error: 'Unauthorized',
        user: null,
      };
    }

    return {
      error: null,
      user: sanitizeUser(user),
    };
  } catch {
    return {
      error: 'Unauthorized',
      user: null,
    };
  }
}

export const hash = (str: string) => {
  let hash = 5381;
  let i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  return String(hash >>> 0);
};

export const encode = (obj: unknown): string => {
  const encodeBase64 =
    typeof window === 'undefined'
      ? (str: string) => Buffer.from(str, 'utf8').toString('base64')
      : window.btoa;

  return encodeBase64(JSON.stringify(obj));
};

export function authenticate({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = db.user.findFirst({
    where: {
      email: {
        equals: email,
      },
    },
  });

  if (!user || user.password !== hash(password)) {
    throw new Error('Invalid username or password');
  }

  const sanitizedUser = sanitizeUser(user);

  const token = encode({
    id: sanitizedUser.id,
    exp: Date.now() + 60 * 60 * 1000,
  });

  return {
    user: sanitizedUser,
    token,
  };
}

export function requireAdmin(user: any) {
  if (user.role !== 'ADMIN') {
    throw Error('Unauthorized');
  }
}
