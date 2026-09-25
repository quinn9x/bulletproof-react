import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
  teamId: z.string(),
  role: z.string(),
  bio: z.string(),
  createdAt: z.string(),
});

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string(),
});

export const DiscussionSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  authorId: z.string(),
  teamId: z.string(),
  createdAt: z.string(),
});

export const CommentSchema = z.object({
  id: z.string(),
  body: z.string(),
  authorId: z.string(),
  discussionId: z.string(),
  createdAt: z.string(),
});

export type UserRecord = z.infer<typeof UserSchema>;
export type TeamRecord = z.infer<typeof TeamSchema>;
export type DiscussionRecord = z.infer<typeof DiscussionSchema>;
export type CommentRecord = z.infer<typeof CommentSchema>;
