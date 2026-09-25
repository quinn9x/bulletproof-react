import { primaryKey } from '@mswjs/data';
import { nanoid } from 'nanoid';

export const models = {
  user: {
    id: primaryKey(nanoid),
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    teamId: String,
    role: String,
    bio: String,
    createdAt: String,
  },

  team: {
    id: primaryKey(nanoid),
    name: String,
    description: String,
    createdAt: String,
  },

  discussion: {
    id: primaryKey(nanoid),
    title: String,
    body: String,
    authorId: String,
    teamId: String,
    createdAt: String,
  },

  comment: {
    id: primaryKey(nanoid),
    body: String,
    authorId: String,
    discussionId: String,
    createdAt: String,
  },
} as const;
