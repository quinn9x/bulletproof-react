import { HttpResponse, http } from 'msw';
import { z } from 'zod';

import { env } from '@/config/env';
import { db } from '../db';
import { snapshotDb } from '../db/bootstrap';
import { persistDb } from '../db/persistence';
import { networkDelay, requireAuth, sanitizeUser } from '../utils';

const PAGE_SIZE = 10;

const createCommentSchema = z.object({
  body: z.string().trim().min(1),
  discussionId: z.string().min(1),
});

type CreateCommentBody = z.infer<typeof createCommentSchema>;

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Server Error';

const getPage = (value: string | null) => {
  const page = Number(value ?? '1');

  if (!Number.isInteger(page) || page < 1) {
    return null;
  }

  return page;
};

const parseCommentBody = async (request: Request) => {
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

  const result = createCommentSchema.safeParse(body);

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

export const commentsHandlers = [
  /**
   * GET /comments?discussionId=xxx&page=1
   */
  http.get(`${env.API_URL}/comments`, async ({ request, cookies }) => {
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

      const discussionId = url.searchParams.get('discussionId');

      if (!discussionId) {
        return HttpResponse.json(
          { message: 'discussionId is required' },
          { status: 400 },
        );
      }

      const page = getPage(url.searchParams.get('page'));

      if (page === null) {
        return HttpResponse.json(
          { message: 'Page must be a positive integer' },
          { status: 400 },
        );
      }

      /**
       * Make sure the discussion belongs to the
       * authenticated user's team before exposing
       * its comments.
       */
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

      const where = {
        discussionId: {
          equals: discussionId,
        },
      };

      const total = db.comment.count({
        where,
      });

      const totalPages = Math.ceil(total / PAGE_SIZE);

      const comments = db.comment
        .findMany({
          where,
          take: PAGE_SIZE,
          skip: PAGE_SIZE * (page - 1),
        })
        .map(({ authorId, ...comment }) => {
          const author = db.user.findFirst({
            where: {
              id: {
                equals: authorId,
              },
            },
          });

          return {
            ...comment,
            author: author ? sanitizeUser(author) : {},
          };
        });

      return HttpResponse.json({
        data: comments,
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
   * POST /comments
   */
  http.post(`${env.API_URL}/comments`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);

      if (error || !user) {
        return HttpResponse.json(
          { message: error ?? 'Unauthorized' },
          { status: 401 },
        );
      }

      const parsed = await parseCommentBody(request);

      if (parsed.error) {
        return parsed.error;
      }

      /**
       * A user can only comment on a discussion
       * belonging to their own team.
       */
      const discussion = db.discussion.findFirst({
        where: {
          id: {
            equals: parsed.data.discussionId,
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

      const data: CreateCommentBody = parsed.data;

      const result = db.comment.create({
        authorId: user.id,
        ...data,
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
   * DELETE /comments/:commentId
   */
  http.delete(
    `${env.API_URL}/comments/:commentId`,
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

        const commentId = String(params.commentId);

        const comment = db.comment.findFirst({
          where: {
            id: {
              equals: commentId,
            },
          },
        });

        if (!comment) {
          return HttpResponse.json(
            { message: 'Comment not found' },
            { status: 404 },
          );
        }

        /**
         * Verify that the comment belongs to a discussion
         * inside the authenticated user's team.
         */
        const discussion = db.discussion.findFirst({
          where: {
            id: {
              equals: comment.discussionId,
            },
            teamId: {
              equals: user.teamId,
            },
          },
        });

        if (!discussion) {
          return HttpResponse.json(
            { message: 'Comment not found' },
            { status: 404 },
          );
        }

        /**
         * Regular users can only delete their own comments.
         * Admins can delete comments inside their own team.
         */
        if (user.role === 'USER' && comment.authorId !== user.id) {
          return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        db.comment.delete({
          where: {
            id: {
              equals: commentId,
            },
            discussionId: {
              equals: comment.discussionId,
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
