import {
  CommentSchema,
  DiscussionSchema,
  TeamSchema,
  UserSchema,
} from './schemas';

import { db } from './index';

import {
  clearPersistedDb,
  loadDb,
  persistDb,
  type PersistedDb,
} from './persistence';

import { seedDb } from './seed';

const restoreDb = (data: PersistedDb): void => {
  for (const record of data.user) {
    db.user.create(UserSchema.parse(record));
  }

  for (const record of data.team) {
    db.team.create(TeamSchema.parse(record));
  }

  for (const record of data.discussion) {
    db.discussion.create(DiscussionSchema.parse(record));
  }

  for (const record of data.comment) {
    db.comment.create(CommentSchema.parse(record));
  }
};

export const snapshotDb = (): PersistedDb => ({
  user: db.user.getAll().map((record) => UserSchema.parse(record)),

  team: db.team.getAll().map((record) => TeamSchema.parse(record)),

  discussion: db.discussion
    .getAll()
    .map((record) => DiscussionSchema.parse(record)),

  comment: db.comment.getAll().map((record) => CommentSchema.parse(record)),
});

export const bootstrapDb = async (): Promise<void> => {
  const data = await loadDb();

  const hasData =
    data.user.length > 0 ||
    data.team.length > 0 ||
    data.discussion.length > 0 ||
    data.comment.length > 0;

  if (hasData) {
    restoreDb(data);
    return;
  }

  seedDb();

  await persistDb(snapshotDb());
};

export const persistCurrentDb = async (): Promise<void> => {
  await persistDb(snapshotDb());
};

export const resetDb = async (): Promise<void> => {
  await clearPersistedDb();
};
