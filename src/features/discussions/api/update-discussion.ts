import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import { type Discussion } from '@/types/api';

import { getDiscussionQueryOptions } from './get-discussion';
import { discussionsQueryKeys } from './get-discussions';

export const updateDiscussionInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
});

export type UpdateDiscussionInput = z.infer<typeof updateDiscussionInputSchema>;

export const updateDiscussion = ({
  data,
  discussionId,
}: {
  data: UpdateDiscussionInput;
  discussionId: string;
}): Promise<Discussion> => {
  return apiClient.patch(`/discussions/${discussionId}`, data);
};

type UseUpdateDiscussionOptions = {
  mutationConfig?: MutationConfig<typeof updateDiscussion>;
};

export const useUpdateDiscussion = ({
  mutationConfig,
}: UseUpdateDiscussionOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: async (data, ...args) => {
      await queryClient.invalidateQueries({
        queryKey: getDiscussionQueryOptions(data.id).queryKey,
      });

      await queryClient.invalidateQueries({
        queryKey: discussionsQueryKeys.all,
      });

      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateDiscussion,
  });
};
