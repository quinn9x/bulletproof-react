import type {
  CommentRecord,
  DiscussionRecord,
  TeamRecord,
  UserRecord,
} from './schemas';

export type PersistedDb = {
  user: UserRecord[];
  team: TeamRecord[];
  discussion: DiscussionRecord[];
  comment: CommentRecord[];
};

const STORAGE_KEY = 'msw-db';
const DB_FILE = 'mocked-db.json';

const EMPTY_DB: PersistedDb = {
  user: [],
  team: [],
  discussion: [],
  comment: [],
};

const isBrowser = typeof window !== 'undefined';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const loadDb = async (): Promise<PersistedDb> => {
  if (isBrowser) {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return clone(EMPTY_DB);
    }

    return {
      ...EMPTY_DB,
      ...JSON.parse(raw),
    };
  }

  const { readFile } = await import('node:fs/promises');

  try {
    const raw = await readFile(DB_FILE, 'utf8');

    return {
      ...EMPTY_DB,
      ...JSON.parse(raw),
    };
  } catch {
    return clone(EMPTY_DB);
  }
};

let writeQueue = Promise.resolve();

export const persistDb = (data: PersistedDb): Promise<void> => {
  const serialized = JSON.stringify(data, null, 2);

  writeQueue = writeQueue
    .catch(() => undefined)
    .then(async () => {
      if (isBrowser) {
        localStorage.setItem(STORAGE_KEY, serialized);
        return;
      }

      const { writeFile } = await import('node:fs/promises');

      await writeFile(DB_FILE, serialized, 'utf8');
    });

  return writeQueue;
};

export const clearPersistedDb = async (): Promise<void> => {
  if (isBrowser) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  const { writeFile } = await import('node:fs/promises');

  await writeFile(DB_FILE, JSON.stringify(EMPTY_DB, null, 2), 'utf8');
};
