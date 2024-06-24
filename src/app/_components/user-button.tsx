"use client";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export default function UserButton() {
  const { isSignedIn } = useUser();
  return (
    <div className="flex flex-none flex-row items-center justify-end text-lg">
      <div className=" rounded-lg border-2 border-black p-2">
        {isSignedIn ? <SignOutButton /> : <SignInButton />}
      </div>
    </div>
  );
}
