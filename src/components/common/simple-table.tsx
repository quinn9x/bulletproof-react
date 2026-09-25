import type { ReactNode } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type SimpleTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (item: T) => ReactNode;
  className?: string;
};

type SimpleTableProps<T> = {
  data: T[];
  columns: SimpleTableColumn<T>[];
  getRowId: (item: T) => string;
  emptyMessage?: ReactNode;
};

export const SimpleTable = <T,>({
  data,
  columns,
  getRowId,
  emptyMessage = 'No results.',
}: SimpleTableProps<T>) => {
  return (
    <div className="w-full overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={getRowId(item)}>
                {columns.map((column) => (
                  <TableCell key={column.id} className={column.className}>
                    {column.cell(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
