import { SignInButton, SignOutButton, auth } from "@clerk/nextjs";

export default function UserButton() {
  const { userId } = auth();
  return (
    <div className="flex flex-none flex-row justify-end p-6 text-lg">
      {userId ? <SignOutButton /> : <SignInButton />}
    </div>
  );
}
