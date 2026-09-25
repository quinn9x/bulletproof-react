import { factory } from '@mswjs/data';

import { models } from './models';

export const db = factory(models);

export const createTimestamp = (): string => new Date().toISOString();
