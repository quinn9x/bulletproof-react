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
import { useDeleteComment } from '../api/delete-comment';

type DeleteCommentProps = {
  id: string;
  discussionId: string;
};

export const DeleteComment = ({ id, discussionId }: DeleteCommentProps) => {
  const deleteCommentMutation = useDeleteComment({
    discussionId,
    mutationConfig: {
      onSuccess: () => {
        toast.add({
          type: 'success',
          description: 'Comment Deleted',
        });
      },
    },
  });

  if (!id) return null;

  const isDeleting = deleteCommentMutation.isPending;

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="destructive">Delete</Button>}
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Comment</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete this comment?
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
                onClick={() => deleteCommentMutation.mutate({ commentId: id })}
              >
                {isDeleting && <Spinner data-icon="inline-start" />}
                {isDeleting ? 'Deleting...' : 'Delete Comment'}
              </Button>
            }
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
