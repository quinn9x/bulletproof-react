import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useSearchParams } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Link } from '@/components/ui/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { paths } from '@/config/paths';
import { registerInputSchema, useRegister } from '@/lib/auth';
import type { Team } from '@/types/api';

type RegisterRouteProps = {
  onSuccess: () => void;
  teams?: Team[];
};

export const RegisterForm = ({ onSuccess, teams }: RegisterRouteProps) => {
  const registering = useRegister({ onSuccess });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const form = useForm<z.infer<typeof registerInputSchema>>({
    resolver: zodResolver(registerInputSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      chooseTeam: false,
      teamId: null,
      teamName: '',
    },
  });

  const chooseTeam = useWatch({
    control: form.control,
    name: 'chooseTeam',
  });

  const onSubmit = (data: z.infer<typeof registerInputSchema>) => {
    registering.mutate(data);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="first_name">First Name</FieldLabel>

                <Input
                  {...field}
                  id="first_name"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your first name"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="last_name">Last Name</FieldLabel>

                <Input
                  {...field}
                  id="last_name"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your last name"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>

                <Input
                  {...field}
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="your-email@example.com"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>

                <Input
                  {...field}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="••••••••"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {teams && (
            <Controller
              name="chooseTeam"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <Switch
                    id="choose-team"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);

                      if (checked) {
                        form.setValue('teamId', null);
                        form.setValue('teamName', null);
                      } else {
                        form.setValue('teamId', null);
                        form.setValue('teamName', '');
                      }

                      form.clearErrors();
                    }}
                    aria-invalid={fieldState.invalid}
                  />

                  <FieldContent>
                    <FieldLabel htmlFor="choose-team">
                      Join Existing Team
                    </FieldLabel>
                  </FieldContent>
                </Field>
              )}
            />
          )}

          {chooseTeam && teams ? (
            <Controller
              name="teamId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <Select
                    name={field.name}
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    items={teams.map((team) => ({
                      label: team.name,
                      value: team.id,
                    }))}
                  >
                    <SelectTrigger
                      id="team-select"
                      aria-invalid={fieldState.invalid}
                      className="min-w-30"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>

                    <SelectContent alignItemWithTrigger>
                      {teams.map((team) => (
                        <SelectItem value={team.id} key={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          ) : (
            <Controller
              name="teamName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="team-name">Team Name</FieldLabel>

                  <Input
                    {...field}
                    value={field.value ?? ''}
                    id="team-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Team name"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={registering.isPending}
          >
            {registering.isPending && <Spinner data-icon="inline-start" />}
            {registering.isPending ? 'Registering...' : 'Register'}
          </Button>
        </FieldGroup>
      </form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <Link
            to={paths.auth.login.getHref(redirectTo)}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
