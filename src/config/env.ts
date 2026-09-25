import { z } from 'zod';

const booleanEnv = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

const EnvSchema = z.object({
  API_URL: z.string().trim().min(1, 'API_URL is required'),

  APP_URL: z
    .string()
    .trim()
    .url('APP_URL must be a valid URL')
    .default('http://localhost:5173'),

  ENABLE_API_MOCKING: booleanEnv.default(false),

  APP_MOCK_API_PORT: z.coerce.number().int().min(1).max(65535).default(8080),
});

export type Env = z.infer<typeof EnvSchema>;

const getEnvVars = (): Record<string, string> => {
  const prefix = 'VITE_APP_';

  return Object.entries(import.meta.env).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (!key.startsWith(prefix)) {
        return acc;
      }

      const envKey = key.slice(prefix.length);

      if (typeof value === 'string') {
        acc[envKey] = value;
      }

      return acc;
    },
    {},
  );
};

const createEnv = (): Env => {
  const result = EnvSchema.safeParse(getEnvVars());

  if (!result.success) {
    const errors = Object.entries(result.error.flatten().fieldErrors)
      .map(([key, messages]) => `- ${key}: ${messages?.join(', ')}`)
      .join('\n');

    throw new Error(`Invalid environment variables:\n\n${errors}`);
  }

  if (import.meta.env.PROD && result.data.ENABLE_API_MOCKING) {
    throw new Error('API mocking must not be enabled in production.');
  }

  return result.data;
};

export const env = createEnv();
