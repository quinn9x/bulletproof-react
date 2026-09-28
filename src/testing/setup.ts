import { afterAll, afterEach, beforeAll } from 'vite-plus/test';

import { bootstrapDb } from './mocks/db/bootstrap';
import { server } from './mocks/server';

beforeAll(async () => {
  await bootstrapDb();
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
