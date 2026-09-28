import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/lib/api-error';
import { useUser } from '@/lib/auth';
import { useDeleteUser } from '../api/delete-user';

type DeleteUserProps = {
  id: string;
};

export const DeleteUser = ({ id }: DeleteUserProps) => {
  const user = useUser();

  const deleteUserMutation = useDeleteUser({
    mutationConfig: {
      onSuccess: () => {
        toast.add({
          type: 'success',
          description: 'User Deleted',
        });
      },

      onError: (error) => {
        toast.add({
          type: 'error',
          description: getApiErrorMessage(
            error,
            'Failed to delete user. Please try again.',
          ),
        });
      },
    },
  });

  if (user.data?.id === id) return null;

  const isDeleting = deleteUserMutation.isPending;

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="destructive">Delete</Button>}
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete this user?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            variant="destructive"
            render={
              <Button
                type="button"
                disabled={isDeleting}
                onClick={() => deleteUserMutation.mutate({ userId: id })}
              >
                {isDeleting && <Spinner data-icon="inline-start" />}
                {isDeleting ? 'Deleting...' : 'Delete User'}
              </Button>
            }
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
