import { Show, SignInButton } from "@clerk/nextjs";
import { TbLogin2 } from "react-icons/tb";
import ProfileButton from "./userButton";

export default function ProfileBtn() {
  return (
    <div className="flex h-full w-full flex-none flex-col items-center justify-center rounded-lg text-lg">
      <Show when="signed-out">
        <div className="border-accent flex h-full w-full flex-none flex-col items-center justify-center rounded-lg border-2 text-lg">
          <SignInButton>
            <span className="flex flex-col items-center justify-center gap-1">
              <TbLogin2 size={24} color="var(--color-accent)" />
              <span className="text-accent xs:text-sm text-base">Login</span>
            </span>
          </SignInButton>
        </div>
      </Show>
      <Show when="signed-in">
        <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full">
          <ProfileButton />
        </div>
      </Show>
    </div>
  );
}
