import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { type QueryConfig } from '@/lib/react-query';
import { type Comment, type Meta } from '@/types/api';

type GetCommentsParams = {
  discussionId: string;
  page?: number;
};

type GetCommentsResponse = {
  data: Comment[];
  meta: Meta;
};

export const getComments = ({
  discussionId,
  page = 1,
}: GetCommentsParams): Promise<GetCommentsResponse> => {
  return apiClient.get('/comments', {
    params: {
      discussionId,
      page,
    },
  });
};

export const getInfiniteCommentsQueryOptions = (discussionId: string) => {
  return infiniteQueryOptions({
    queryKey: ['comments', discussionId],

    queryFn: ({ pageParam }) =>
      getComments({
        discussionId,
        page: pageParam,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;

      return page < totalPages ? page + 1 : undefined;
    },
  });
};

type UseInfiniteCommentsOptions = {
  discussionId: string;
  queryConfig?: QueryConfig<typeof getComments>;
};

export const useInfiniteComments = ({
  discussionId,
  queryConfig,
}: UseInfiniteCommentsOptions) => {
  return useInfiniteQuery({
    ...getInfiniteCommentsQueryOptions(discussionId),
    ...queryConfig,
  });
};
