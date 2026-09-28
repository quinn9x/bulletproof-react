import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconEdit } from '@tabler/icons-react';
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
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { Authorization } from '@/lib/authorization';
import { ROLES } from '@/lib/roles';
import { useDiscussion } from '../api/get-discussion';
import {
  updateDiscussionInputSchema,
  useUpdateDiscussion,
  type UpdateDiscussionInput,
} from '../api/update-discussion';

type UpdateDiscussionProps = {
  discussionId: string;
};

export const UpdateDiscussion = ({ discussionId }: UpdateDiscussionProps) => {
  const [open, setOpen] = useState(false);
  const discussionQuery = useDiscussion({ discussionId });
  const discussion = discussionQuery.data;

  const form = useForm<UpdateDiscussionInput>({
    resolver: zodResolver(updateDiscussionInputSchema),
    defaultValues: {
      title: discussion?.title ?? '',
      body: discussion?.body ?? '',
    },
  });

  const updateDiscussionMutation = useUpdateDiscussion({
    mutationConfig: {
      onSuccess: () => {
        setOpen(false);

        toast.add({
          type: 'success',
          description: 'Discussion updated successfully.',
        });
      },
    },
  });

  const onSubmit = (values: UpdateDiscussionInput) => {
    updateDiscussionMutation.mutate({
      data: values,
      discussionId,
    });
  };

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger
          render={
            <Button type="button" size="sm">
              <IconEdit
                aria-hidden="true"
                className="size-4"
                data-icon="inline-start"
              />
              Update Discussion
            </Button>
          }
        />

        <DrawerContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DrawerHeader>
              <DrawerTitle>Update Discussion</DrawerTitle>
              <DrawerDescription>
                Update a new discussion by providing a title and body.
              </DrawerDescription>
            </DrawerHeader>

            <div className="p-4">
              <FieldGroup>
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Title</FieldLabel>

                      <Input
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
              <Button
                type="submit"
                disabled={updateDiscussionMutation.isPending}
              >
                {updateDiscussionMutation.isPending && (
                  <Spinner data-icon="inline-start" />
                )}

                {updateDiscussionMutation.isPending
                  ? 'Submitting...'
                  : 'Submit'}
              </Button>

              <DrawerClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    disabled={updateDiscussionMutation.isPending}
                  >
                    Cancel
                  </Button>
                }
              />
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </Authorization>
  );
};
