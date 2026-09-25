import Cookies from 'js-cookie';
import { http, HttpResponse } from 'msw';

import { env } from '@/config/env';
import { db } from '../db';
import { snapshotDb } from '../db/bootstrap';
import { persistDb } from '../db/persistence';
import {
  AUTH_COOKIE,
  authenticate,
  hash,
  networkDelay,
  requireAuth,
} from '../utils';

type LoginBody = {
  email: string;
  password: string;
};

type RegisterBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  teamId?: string;
  teamName?: string;
};

export const authHandlers = [
  http.get(`${env.API_URL}/auth/me`, async ({ cookies }) => {
    await networkDelay();

    try {
      const { user } = requireAuth(cookies);
      return HttpResponse.json(user);
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),

  http.post(`${env.API_URL}/auth/login`, async ({ request }) => {
    await networkDelay();

    try {
      const credentials = (await request.json()) as LoginBody;
      const result = authenticate(credentials);

      // todo: remove once tests in Github Actions are fixed
      Cookies.set(AUTH_COOKIE, result.token, { path: '/' });

      return HttpResponse.json(result, {
        headers: {
          // with a real API server, the token cookie should also be Secure and HttpOnly
          'Set-Cookie': `${AUTH_COOKIE}=${result.token}; Path=/;`,
        },
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),

  http.post(`${env.API_URL}/auth/logout`, async () => {
    await networkDelay();

    // todo: remove once tests in Github Actions are fixed
    Cookies.remove(AUTH_COOKIE);

    return HttpResponse.json(
      { message: 'Logged out' },
      {
        headers: {
          'Set-Cookie': `${AUTH_COOKIE}=; Path=/;`,
        },
      },
    );
  }),

  http.post(`${env.API_URL}/auth/register`, async ({ request }) => {
    await networkDelay();

    try {
      const userObject = (await request.json()) as RegisterBody;

      const email = userObject.email.trim().toLowerCase();

      const existingUser = db.user.findFirst({
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (existingUser) {
        return HttpResponse.json(
          { message: 'The user already exists' },
          { status: 409 },
        );
      }

      let teamId: string;
      let role: 'ADMIN' | 'USER';

      if (!userObject.teamId) {
        const team = db.team.create({
          name: userObject.teamName ?? `${userObject.firstName} Team`,
        });

        teamId = team.id;
        role = 'ADMIN';
      } else {
        const existingTeam = db.team.findFirst({
          where: {
            id: {
              equals: userObject.teamId,
            },
          },
        });

        if (!existingTeam) {
          return HttpResponse.json(
            {
              message: 'The team you are trying to join does not exist!',
            },
            { status: 404 },
          );
        }

        teamId = existingTeam.id;
        role = 'USER';
      }

      db.user.create({
        ...userObject,
        email,
        role,
        password: hash(userObject.password),
        teamId,
        createdAt: new Date().toISOString(),
      });

      await persistDb(snapshotDb());

      const result = authenticate({
        email,
        password: userObject.password,
      });

      // TODO: remove once tests in GitHub Actions are fixed
      Cookies.set(AUTH_COOKIE, result.token, {
        path: '/',
      });

      return HttpResponse.json(result, {
        headers: {
          // In a real API server, use HttpOnly + Secure + SameSite.
          'Set-Cookie': `${AUTH_COOKIE}=${result.token}; Path=/;`,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';

      return HttpResponse.json({ message }, { status: 500 });
    }
  }),
];
