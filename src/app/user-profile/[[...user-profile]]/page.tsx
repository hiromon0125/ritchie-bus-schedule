import Settings from "@/settings";
import type { Metadata } from "next";
import { APPCONFIG } from "../../../appconfig";

export const metadata: Metadata = {
  title: `User Profile | ${APPCONFIG.APP_TITLE}`,
  description:
    "Customize your app profile, update your profile picture or change preferences",
  alternates: {
    canonical: "/user-profile",
  },
};

function UserProfilePage() {
  return (
    <main className="w-full">
      <div className="m-auto flex min-h-screen w-full max-w-(--breakpoint-lg) flex-col items-center justify-center">
        <Settings />
      </div>
    </main>
  );
}

export default UserProfilePage;
