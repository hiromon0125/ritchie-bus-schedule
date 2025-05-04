import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { TbLogin2 } from "react-icons/tb";
import ProfileButton from "./userButton";

export default function ProfileBtn() {
  return (
    <div className="has-[div#loggedout]:border-accent flex h-full w-full flex-none flex-col items-center justify-center rounded-lg text-lg has-[div#loggedout]:border-2">
      <SignedOut>
        <div id="loggedout" className="hidden" />
        <SignInButton>
          <div className="flex flex-col items-center justify-center gap-1">
            <TbLogin2 size={24} color="var(--color-accent)" />
            <button className="text-accent xs:text-sm text-base">Login</button>
          </div>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full">
          <ProfileButton />
        </div>
      </SignedIn>
    </div>
  );
}
