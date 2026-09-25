import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import { type Comment } from '@/types/api';

import { getInfiniteCommentsQueryOptions } from './get-comments';

export const createCommentInputSchema = z.object({
  discussionId: z.string().min(1, 'Discussion ID is required'),
  body: z.string().min(1, 'Body is required'),
});

export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;

export const createComment = ({
  data,
}: {
  data: CreateCommentInput;
}): Promise<Comment> => {
  return apiClient.post('/comments', data);
};

type UseCreateCommentOptions = {
  discussionId: string;
  mutationConfig?: MutationConfig<typeof createComment>;
};

export const useCreateComment = ({
  mutationConfig,
  discussionId,
}: UseCreateCommentOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: getInfiniteCommentsQueryOptions(discussionId).queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createComment,
  });
};
