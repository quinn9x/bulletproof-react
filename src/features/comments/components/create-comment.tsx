import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconPlus } from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/lib/api-error';
import {
  createCommentInputSchema,
  useCreateComment,
  type CreateCommentInput,
} from '../api/create-comment';

type CreateCommentProps = {
  discussionId: string;
};

export const CreateComment = ({ discussionId }: CreateCommentProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentInputSchema),
    defaultValues: {
      discussionId,
      body: '',
    },
  });

  const createCommentMutation = useCreateComment({
    discussionId,
    mutationConfig: {
      onSuccess: () => {
        form.reset();
        setOpen(false);

        toast.add({
          type: 'success',
          description: 'Comment created successfully.',
        });
      },

      onError: (error) => {
        toast.add({
          type: 'error',
          description: getApiErrorMessage(
            error,
            'Failed to create comment. Please try again.',
          ),
        });
      },
    },
  });
  const isPending = createCommentMutation.isPending;

  const onSubmit = (values: CreateCommentInput) => {
    createCommentMutation.mutate({
      data: values,
    });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <Button type="button" size="sm">
            <IconPlus
              aria-hidden="true"
              className="size-4"
              data-icon="inline-start"
            />
            Create Comment
          </Button>
        }
      />

      <DrawerContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DrawerHeader>
            <DrawerTitle>Create Comment</DrawerTitle>
            <DrawerDescription>
              Create a new comment by providing a body.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4">
            <FieldGroup>
              <Controller
                name="body"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Body</FieldLabel>

                    <Textarea
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <DrawerFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              {isPending ? 'Submitting...' : 'Submit'}
            </Button>

            <DrawerClose
              render={
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              }
            />
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
