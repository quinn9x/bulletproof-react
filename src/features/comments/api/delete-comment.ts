import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';

import { getInfiniteCommentsQueryOptions } from './get-comments';

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
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: getInfiniteCommentsQueryOptions(discussionId).queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteComment,
  });
};
