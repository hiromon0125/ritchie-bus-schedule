"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import ProfileButton from "./userButton";

export function ProfileBtn() {
  return (
    <div className="flex flex-none flex-row items-center justify-end text-lg">
      <SignedOut>
        <div className=" rounded-full border-2 border-blue-600 bg-white px-4 py-2">
          <SignInButton>
            <button className=" text-blue-600">Sign In</button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
        <div
          className=" flex h-12 w-12 flex-col items-center justify-center rounded-full"
          suppressHydrationWarning
        >
          <ProfileButton />
        </div>
      </SignedIn>
    </div>
  );
}
