import { type Comment, type User } from '@/types/api';

export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const POLICIES = {
  'comment:delete': (user: User, comment: Comment) => {
    if (user.role === 'ADMIN') {
      return true;
    }

    if (user.role === 'USER' && comment.author?.id === user.id) {
      return true;
    }

    return false;
  },
};
