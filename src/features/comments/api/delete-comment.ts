import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import { commentsQueryKeys } from './get-comments';

export const deleteComment = ({ commentId }: { commentId: string }) => {
  return apiClient.delete(`/comments/${commentId}`);
};

type UseDeleteCommentOptions = {
  discussionId: string;
  mutationConfig?: MutationConfig<typeof deleteComment>;
};

export const useDeleteComment = ({
  mutationConfig,
  discussionId,
}: UseDeleteCommentOptions) => {
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
    mutationFn: deleteComment,
  });
};
