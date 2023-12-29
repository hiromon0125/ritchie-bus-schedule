"use client";
import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs";

export default function UserButton() {
  const { isSignedIn } = useAuth();
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      {isSignedIn ? <SignOutButton /> : <SignInButton />}
    </div>
  );
}
