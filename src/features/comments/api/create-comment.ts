import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import { type Comment } from '@/types/api';
import { commentsQueryKeys } from './get-comments';

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
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: commentsQueryKeys.list(discussionId),
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createComment,
  });
};
