import { HttpResponse, http } from 'msw';
import { z } from 'zod';

import { env } from '@/config/env';
import { db } from '../db';
import { snapshotDb } from '../db/bootstrap';
import { persistDb } from '../db/persistence';
import {
  networkDelay,
  requireAdmin,
  requireAuth,
  sanitizeUser,
} from '../utils';

const PAGE_SIZE = 10;

const discussionSchema = z.object({
  title: z.string().trim().min(1),
  body: z.string().trim().min(1),
});

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Server Error';

const getPage = (value: string | null) => {
  const page = Number(value ?? '1');

  if (!Number.isInteger(page) || page < 1) {
    return null;
  }

  return page;
};

const parseDiscussionBody = async (request: Request) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return {
      error: HttpResponse.json(
        { message: 'Invalid JSON body' },
        { status: 400 },
      ),
    };
  }

  const result = discussionSchema.safeParse(body);

  if (!result.success) {
    return {
      error: HttpResponse.json(
        {
          message: 'Invalid request body',
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      ),
    };
  }

  return {
    data: result.data,
  };
};

export const discussionsHandlers = [
  /**
   * GET /discussions
   */
  http.get(`${env.API_URL}/discussions`, async ({ cookies, request }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);

      if (error || !user) {
        return HttpResponse.json(
          { message: error ?? 'Unauthorized' },
          { status: 401 },
        );
      }

      const url = new URL(request.url);
      const page = getPage(url.searchParams.get('page'));

      if (page === null) {
        return HttpResponse.json(
          { message: 'Page must be a positive integer' },
          { status: 400 },
        );
      }

      const where = {
        teamId: {
          equals: user.teamId,
        },
      };

      const total = db.discussion.count({
        where,
      });

      const totalPages = Math.ceil(total / PAGE_SIZE);

      const discussions = db.discussion.findMany({
        where,
        take: PAGE_SIZE,
        skip: PAGE_SIZE * (page - 1),
      });

      const data = discussions.map(({ authorId, ...discussion }) => {
        const author = db.user.findFirst({
          where: {
            id: {
              equals: authorId,
            },
          },
        });

        return {
          ...discussion,
          author: author ? sanitizeUser(author) : {},
        };
      });

      return HttpResponse.json({
        data,
        meta: {
          page,
          pageSize: PAGE_SIZE,
          total,
          totalPages,
        },
      });
    } catch (error: unknown) {
      return HttpResponse.json(
        { message: getErrorMessage(error) },
        { status: 500 },
      );
    }
  }),

  /**
   * GET /discussions/:discussionId
   */
  http.get(
    `${env.API_URL}/discussions/:discussionId`,
    async ({ params, cookies }) => {
      await networkDelay();

      try {
        const { user, error } = requireAuth(cookies);

        if (error || !user) {
          return HttpResponse.json(
            { message: error ?? 'Unauthorized' },
            { status: 401 },
          );
        }

        const discussionId = String(params.discussionId);

        const discussion = db.discussion.findFirst({
          where: {
            id: {
              equals: discussionId,
            },
            teamId: {
              equals: user.teamId,
            },
          },
        });

        if (!discussion) {
          return HttpResponse.json(
            { message: 'Discussion not found' },
            { status: 404 },
          );
        }

        const author = db.user.findFirst({
          where: {
            id: {
              equals: discussion.authorId,
            },
          },
        });

        return HttpResponse.json({
          ...discussion,
          author: author ? sanitizeUser(author) : {},
        });
      } catch (error: unknown) {
        return HttpResponse.json(
          { message: getErrorMessage(error) },
          { status: 500 },
        );
      }
    },
  ),

  /**
   * POST /discussions
   */
  http.post(`${env.API_URL}/discussions`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);

      if (error || !user) {
        return HttpResponse.json(
          { message: error ?? 'Unauthorized' },
          { status: 401 },
        );
      }

      requireAdmin(user);

      const parsed = await parseDiscussionBody(request);

      if (parsed.error) {
        return parsed.error;
      }

      const result = db.discussion.create({
        teamId: user.teamId,
        authorId: user.id,
        ...parsed.data,
        createdAt: new Date().toISOString(),
      });

      await persistDb(snapshotDb());

      return HttpResponse.json(result, { status: 201 });
    } catch (error: unknown) {
      return HttpResponse.json(
        { message: getErrorMessage(error) },
        { status: 500 },
      );
    }
  }),

  /**
   * PATCH /discussions/:discussionId
   */
  http.patch(
    `${env.API_URL}/discussions/:discussionId`,
    async ({ request, params, cookies }) => {
      await networkDelay();

      try {
        const { user, error } = requireAuth(cookies);

        if (error || !user) {
          return HttpResponse.json(
            { message: error ?? 'Unauthorized' },
            { status: 401 },
          );
        }

        requireAdmin(user);

        const discussionId = String(params.discussionId);

        const discussion = db.discussion.findFirst({
          where: {
            id: {
              equals: discussionId,
            },
            teamId: {
              equals: user.teamId,
            },
          },
        });

        if (!discussion) {
          return HttpResponse.json(
            { message: 'Discussion not found' },
            { status: 404 },
          );
        }

        const parsed = await parseDiscussionBody(request);

        if (parsed.error) {
          return parsed.error;
        }

        const result = db.discussion.update({
          where: {
            id: {
              equals: discussionId,
            },
            teamId: {
              equals: user.teamId,
            },
          },
          data: parsed.data,
        });

        await persistDb(snapshotDb());

        return HttpResponse.json(result);
      } catch (error: unknown) {
        return HttpResponse.json(
          { message: getErrorMessage(error) },
          { status: 500 },
        );
      }
    },
  ),

  /**
   * DELETE /discussions/:discussionId
   */
  http.delete(
    `${env.API_URL}/discussions/:discussionId`,
    async ({ cookies, params }) => {
      await networkDelay();

      try {
        const { user, error } = requireAuth(cookies);

        if (error || !user) {
          return HttpResponse.json(
            { message: error ?? 'Unauthorized' },
            { status: 401 },
          );
        }

        requireAdmin(user);

        const discussionId = String(params.discussionId);

        const discussion = db.discussion.findFirst({
          where: {
            id: {
              equals: discussionId,
            },
            teamId: {
              equals: user.teamId,
            },
          },
        });

        if (!discussion) {
          return HttpResponse.json(
            { message: 'Discussion not found' },
            { status: 404 },
          );
        }

        db.discussion.delete({
          where: {
            id: {
              equals: discussionId,
            },
            teamId: {
              equals: user.teamId,
            },
          },
        });

        await persistDb(snapshotDb());

        return new HttpResponse(null, {
          status: 204,
        });
      } catch (error: unknown) {
        return HttpResponse.json(
          { message: getErrorMessage(error) },
          { status: 500 },
        );
      }
    },
  ),
];
