import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Team } from '@/types/api';

export const getTeams = (): Promise<Team[]> => {
  return apiClient.get<Team[]>('/teams');
};

export const getTeamsQueryOptions = () => {
  return queryOptions({
    queryKey: ['teams'],
    queryFn: () => getTeams(),
  });
};

type UseTeamsOptions = {
  queryConfig?: QueryConfig<typeof getTeamsQueryOptions>;
};

export const useTeams = ({ queryConfig = {} }: UseTeamsOptions = {}) => {
  return useQuery({
    ...getTeamsQueryOptions(),
    ...queryConfig,
  });
};
