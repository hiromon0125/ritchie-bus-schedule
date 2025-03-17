"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { TbLogin2 } from "react-icons/tb";
import ProfileButton from "./userButton";

export default function ProfileBtn() {
  return (
    <div className="flex h-full w-full flex-none flex-col items-center justify-center rounded-lg text-lg has-[div#loggedout]:border-2 has-[div#loggedout]:border-accent">
      <SignedOut>
        <div id="loggedout" className="hidden" />
        <SignInButton>
          <>
            <TbLogin2 size={24} color="hsl(var(--accent))" />
            <button className=" text-base text-accent xs:text-sm">Login</button>
          </>
        </SignInButton>
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
