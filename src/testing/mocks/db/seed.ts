import { hash } from '../utils';
import { createTimestamp, db } from './index';

export const seedDb = (): void => {
  if (db.user.getAll().length > 0) {
    return;
  }

  const team = db.team.create({
    name: 'Engineering',
    description: 'Engineering team',
    createdAt: createTimestamp(),
  });

  const user = db.user.create({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: hash('password'),
    teamId: team.id,
    role: 'ADMIN',
    bio: 'Software engineer',
    createdAt: createTimestamp(),
  });

  const discussion = db.discussion.create({
    title: 'Welcome',
    body: 'Welcome to the team!',
    authorId: user.id,
    teamId: team.id,
    createdAt: createTimestamp(),
  });

  db.comment.create({
    body: 'Thanks!',
    authorId: user.id,
    discussionId: discussion.id,
    createdAt: createTimestamp(),
  });
};
