import {
  SimpleTable,
  type SimpleTableColumn,
} from '@/components/common/simple-table';
import { Spinner } from '@/components/ui/spinner';
import type { User } from '@/types/api';
import { formatDate } from '@/utils/format';

import { useUsers } from '../api/get-users';
import { DeleteUser } from './delete-user';

export const UsersList = () => {
  const usersQuery = useUsers();

  if (usersQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (usersQuery.isError) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-destructive">
        Failed to load users.
      </div>
    );
  }

  const users = usersQuery.data ?? [];

  const columns: SimpleTableColumn<User>[] = [
    {
      id: 'firstName',
      header: 'First Name',
      cell: (user) => <span className="font-medium">{user.firstName}</span>,
    },
    {
      id: 'lastName',
      header: 'Last Name',
      cell: (user) => user.lastName,
    },
    {
      id: 'email',
      header: 'Email',
      cell: (user) => user.email,
    },
    {
      id: 'role',
      header: 'Role',
      cell: (user) => user.role,
    },
    {
      id: 'createdAt',
      header: 'Created At',
      cell: (user) => formatDate(user.createdAt),
    },
    {
      id: 'delete',
      header: '',
      className: 'w-[50px]',
      cell: (user) => <DeleteUser id={user.id} />,
    },
  ];

  return (
    <SimpleTable
      data={users}
      columns={columns}
      getRowId={(user) => user.id}
      emptyMessage="No users found."
    />
  );
};
