import { UserProfileClient } from "@/components/UserProfileClient";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return <UserProfileClient username={username} />;
}
