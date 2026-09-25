import { ContentLayout } from '@/components/layouts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UpdateProfile } from '@/features/users/components/update-profile';
import { useUser } from '@/lib/auth';

type EntryProps = {
  label: string;
  value?: string | null;
};

const Entry = ({ label, value }: EntryProps) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
    <dt className="text-sm font-medium text-muted-foreground">{label}</dt>

    <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">
      {value || '—'}
    </dd>
  </div>
);

const ProfileRoute = () => {
  const user = useUser();

  if (!user.data) return null;

  const { firstName, lastName, email, role, bio } = user.data;

  return (
    <ContentLayout title="Profile">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>User Information</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Personal details of the user.
              </p>
            </div>

            <UpdateProfile />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="border-t border-border">
            <dl className="sm:divide-y sm:divide-border">
              <Entry label="First Name" value={firstName} />
              <Entry label="Last Name" value={lastName} />
              <Entry label="Email Address" value={email} />
              <Entry label="Role" value={role} />
              <Entry label="Bio" value={bio} />
            </dl>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default ProfileRoute;
