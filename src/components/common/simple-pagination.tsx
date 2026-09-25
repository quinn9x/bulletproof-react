import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type SimplePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type PaginationPage = number | 'ellipsis';

const getPaginationPages = (
  currentPage: number,
  totalPages: number,
): PaginationPage[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    'ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis',
    totalPages,
  ];
};

export const SimplePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: SimplePaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPaginationPages(currentPage, totalPages);

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={hasPreviousPage ? `?page=${currentPage - 1}` : undefined}
            aria-disabled={!hasPreviousPage}
            className={
              !hasPreviousPage ? 'pointer-events-none opacity-50' : undefined
            }
            onClick={(event) => {
              event.preventDefault();

              if (hasPreviousPage) {
                onPageChange(currentPage - 1);
              }
            }}
          />
        </PaginationItem>

        {pages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href={`?page=${page}`}
                isActive={page === currentPage}
                onClick={(event) => {
                  event.preventDefault();

                  if (page !== currentPage) {
                    onPageChange(page);
                  }
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={hasNextPage ? `?page=${currentPage + 1}` : undefined}
            aria-disabled={!hasNextPage}
            className={
              !hasNextPage ? 'pointer-events-none opacity-50' : undefined
            }
            onClick={(event) => {
              event.preventDefault();

              if (hasNextPage) {
                onPageChange(currentPage + 1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
