import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { type LoaderFunctionArgs, useParams } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import { getInfiniteCommentsQueryOptions } from '@/features/comments/api/get-comments';
import { Comments } from '@/features/comments/components/comments';
import {
  getDiscussionQueryOptions,
  useDiscussion,
} from '@/features/discussions/api/get-discussion';
import { DiscussionView } from '@/features/discussions/components/discussion-view';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const discussionId = params.discussionId;

    if (!discussionId) {
      throw new Response('Discussion ID is required', {
        status: 400,
      });
    }

    const discussionQuery = getDiscussionQueryOptions(discussionId);
    const commentsQuery = getInfiniteCommentsQueryOptions(discussionId);

    await Promise.all([
      queryClient.query(discussionQuery),
      queryClient.infiniteQuery(commentsQuery),
    ]);

    return {
      discussionId,
    };
  };

const DiscussionRoute = () => {
  const { discussionId } = useParams();

  if (!discussionId) {
    return null;
  }

  return <DiscussionContent discussionId={discussionId} />;
};

type DiscussionContentProps = {
  discussionId: string;
};

const DiscussionContent = ({ discussionId }: DiscussionContentProps) => {
  const discussionQuery = useDiscussion({
    discussionId,
  });

  if (discussionQuery.isPending) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (discussionQuery.isError) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        Failed to load discussion. Try to refresh the page.
      </div>
    );
  }

  const discussion = discussionQuery.data;

  return (
    <ContentLayout title={discussion.title}>
      <DiscussionView discussionId={discussionId} />

      <div className="mt-8">
        <ErrorBoundary
          fallback={
            <div>Failed to load comments. Try to refresh the page.</div>
          }
        >
          <Comments discussionId={discussionId} />
        </ErrorBoundary>
      </div>
    </ContentLayout>
  );
};

export default DiscussionRoute;
