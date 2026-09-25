import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';

import { getDiscussionsQueryOptions } from './get-discussions';

export const deleteDiscussion = ({
  discussionId,
}: {
  discussionId: string;
}) => {
  return apiClient.delete(`/discussions/${discussionId}`);
};

type UseDeleteDiscussionOptions = {
  mutationConfig?: MutationConfig<typeof deleteDiscussion>;
};

export const useDeleteDiscussion = ({
  mutationConfig,
}: UseDeleteDiscussionOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: getDiscussionsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteDiscussion,
  });
};
