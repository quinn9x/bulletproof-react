import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { User } from '@/types/api';

export const getUsers = (): Promise<User[]> => {
  return apiClient.get<User[]>('/users');
};

export const usersQueryKeys = {
  all: ['users'] as const,
};

export const getUsersQueryOptions = () => {
  return queryOptions({
    queryKey: usersQueryKeys.all,
    queryFn: () => getUsers(),
  });
};

type UseUsersOptions = {
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

export const useUsers = ({ queryConfig = {} }: UseUsersOptions = {}) => {
  return useQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  });
};
