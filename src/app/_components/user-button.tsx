import { SignInButton, SignOutButton, auth } from "@clerk/nextjs";

export default function UserButton() {
  const { userId } = auth();
  return (
    <div className="flex flex-none flex-row items-center justify-end text-lg">
      <div className=" rounded-lg border-2 border-black p-2">
        {userId ? <SignOutButton /> : <SignInButton />}
      </div>
    </div>
  );
}
