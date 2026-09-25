import { ArchiveX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MDPreview } from '@/components/ui/md-preview';
import { Spinner } from '@/components/ui/spinner';
import { useUser } from '@/lib/auth';
import { Authorization } from '@/lib/authorization';
import { type User } from '@/types/api';
import { formatDate } from '@/utils/format';

import { useInfiniteComments } from '../api/get-comments';

import { POLICIES } from '@/lib/roles';
import { DeleteComment } from './delete-comment';

type CommentsListProps = {
  discussionId: string;
};

export const CommentsList = ({ discussionId }: CommentsListProps) => {
  const user = useUser();
  const commentsQuery = useInfiniteComments({
    discussionId,
  });

  if (commentsQuery.isPending) {
    return (
      <div
        className="flex h-48 w-full items-center justify-center"
        aria-label="Loading comments"
      >
        <Spinner className="size-10" />
      </div>
    );
  }

  if (commentsQuery.isError) {
    return (
      <div
        role="alert"
        className="flex h-40 flex-col items-center justify-center gap-2 bg-white text-gray-500"
      >
        <ArchiveX className="size-10" />
        <p>Failed to load comments.</p>

        <Button variant="outline" onClick={() => commentsQuery.refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  const comments = commentsQuery.data.pages.flatMap((page) => page.data);

  if (!comments.length) {
    return (
      <div
        aria-label="comments"
        className="flex h-40 flex-col items-center justify-center bg-white text-gray-500"
      >
        <ArchiveX className="size-10" />
        <h4>No Comments Found</h4>
      </div>
    );
  }

  return (
    <section aria-label="Comments">
      <ul aria-label="comments" className="flex flex-col space-y-3">
        {comments.map((comment) => (
          <li key={comment.id} className="w-full bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold">
                  {formatDate(comment.createdAt)}
                </span>

                {comment.author && (
                  <span className="text-xs font-bold">
                    {' '}
                    by {comment.author.firstName} {comment.author.lastName}
                  </span>
                )}
              </div>

              <Authorization
                policyCheck={POLICIES['comment:delete'](
                  user.data as User,
                  comment,
                )}
              >
                <DeleteComment discussionId={discussionId} id={comment.id} />
              </Authorization>
            </div>

            <MDPreview value={comment.body} />
          </li>
        ))}
      </ul>

      {commentsQuery.hasNextPage && (
        <div className="flex items-center justify-center py-4">
          <Button
            type="button"
            disabled={commentsQuery.isFetchingNextPage}
            onClick={() => commentsQuery.fetchNextPage()}
          >
            {commentsQuery.isFetchingNextPage ? (
              <>
                <Spinner />
                <span className="sr-only">Loading more comments</span>
              </>
            ) : (
              'Load More Comments'
            )}
          </Button>
        </div>
      )}
    </section>
  );
};
