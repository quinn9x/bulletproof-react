import { describe, expect, it } from 'vite-plus/test';

import { loginInputSchema, registerInputSchema } from './auth';

describe('loginInputSchema', () => {
  it('accepts valid login credentials', () => {
    const result = loginInputSchema.safeParse({
      email: 'john@example.com',
      password: 'password',
    });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid email address', () => {
    const result = loginInputSchema.safeParse({
      email: 'invalid-email',
      password: 'password',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a password shorter than five characters', () => {
    const result = loginInputSchema.safeParse({
      email: 'john@example.com',
      password: '1234',
    });

    expect(result.success).toBe(false);
  });
});

describe('registerInputSchema', () => {
  it('accepts registration when joining an existing team', () => {
    const result = registerInputSchema.safeParse({
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
      chooseTeam: true,
      teamId: 'team-1',
      teamName: null,
    });

    expect(result.success).toBe(true);
  });

  it('accepts registration when creating a new team', () => {
    const result = registerInputSchema.safeParse({
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
      chooseTeam: false,
      teamId: null,
      teamName: 'Engineering',
    });

    expect(result.success).toBe(true);
  });

  it('requires a team ID when joining an existing team', () => {
    const result = registerInputSchema.safeParse({
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
      chooseTeam: true,
      teamId: '',
      teamName: null,
    });

    expect(result.success).toBe(false);
  });

  it('requires a team name when creating a new team', () => {
    const result = registerInputSchema.safeParse({
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
      chooseTeam: false,
      teamId: null,
      teamName: '',
    });

    expect(result.success).toBe(false);
  });
});
