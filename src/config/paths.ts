const authPaths = {
  login: {
    path: '/auth/login',
    getHref: (redirectTo?: string | null) =>
      redirectTo
        ? `/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`
        : '/auth/login',
  },
  register: {
    path: '/auth/register',
    getHref: (redirectTo?: string | null) =>
      redirectTo
        ? `/auth/register?redirectTo=${encodeURIComponent(redirectTo)}`
        : '/auth/register',
  },
};

export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },

  auth: authPaths,

  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    dashboard: {
      path: '',
      getHref: () => '/app',
    },
    discussions: {
      path: 'discussions',
      getHref: () => '/app/discussions',
    },
    discussion: {
      path: 'discussions/:discussionId',
      getHref: (id: string) => `/app/discussions/${id}`,
    },
    users: {
      path: 'users',
      getHref: () => '/app/users',
    },
    profile: {
      path: 'profile',
      getHref: () => '/app/profile',
    },
  },
};
