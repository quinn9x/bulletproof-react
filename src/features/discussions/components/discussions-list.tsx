import { noop, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

import { SimplePagination } from '@/components/common/simple-pagination';
import {
  SimpleTable,
  type SimpleTableColumn,
} from '@/components/common/simple-table';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import type { Discussion } from '@/types/api';
import { formatDate } from '@/utils/format';
import { getDiscussionQueryOptions } from '../api/get-discussion';
import { useDiscussions } from '../api/get-discussions';
import { DeleteDiscussion } from './delete-discussion';

export type DiscussionsListProps = {
  onDiscussionPrefetch?: (id: string) => void;
};

export const DiscussionsList = ({
  onDiscussionPrefetch,
}: DiscussionsListProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const currentPage = Math.max(1, Number(searchParams.get('page') || 1));

  const discussionsQuery = useDiscussions({
    page: currentPage,
  });

  if (discussionsQuery.isLoading) {
    return (
      <div
        className="flex h-48 w-full items-center justify-center"
        aria-label="Loading discussions"
      >
        <Spinner className="size-10" />
      </div>
    );
  }

  if (discussionsQuery.isError) {
    return (
      <div
        role="alert"
        className="flex h-40 flex-col items-center justify-center gap-2 text-gray-500"
      >
        <p>Failed to load discussions.</p>

        <Button variant="outline" onClick={() => discussionsQuery.refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  const discussions = discussionsQuery.data?.data;
  const meta = discussionsQuery.data?.meta;

  if (!discussions || !meta) {
    return null;
  }

  const totalPages = meta.totalPages;

  const columns: SimpleTableColumn<Discussion>[] = [
    {
      id: 'title',
      header: 'Title',
      cell: (discussion) => (
        <span className="font-medium">{discussion.title}</span>
      ),
    },
    {
      id: 'createdAt',
      header: 'Created At',
      cell: (discussion) => formatDate(discussion.createdAt),
    },
    {
      id: 'view',
      header: '',
      className: 'w-[80px]',
      cell: (discussion) => (
        <Link
          onMouseEnter={() => {
            void queryClient
              .query(getDiscussionQueryOptions(discussion.id))
              .catch(noop);

            onDiscussionPrefetch?.(discussion.id);
          }}
          to={paths.app.discussion.getHref(discussion.id)}
        >
          View
        </Link>
      ),
    },
    {
      id: 'delete',
      header: '',
      className: 'w-[80px]',
      cell: (discussion) => <DeleteDiscussion id={discussion.id} />,
    },
  ];

  const handlePageChange = (page: number) => {
    setSearchParams((current) => {
      current.set('page', String(page));

      return current;
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-md border">
        <SimpleTable
          data={discussions}
          columns={columns}
          getRowId={(discussion) => discussion.id}
          emptyMessage="No discussions found."
        />
      </div>

      {totalPages > 1 && (
        <SimplePagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
