import Settings from "@/settings";
import { type Metadata } from "next";
import { APPCONFIG } from "../../appconfig";

export const metadata: Metadata = {
  title: `Account Settings | ${APPCONFIG.APP_TITLE}`,
  description:
    "Customize your app profile, update your profile picture or change preferences",
  alternates: {
    canonical: "/setting",
  },
};

export default function SettingPage() {
  return (
    <main className="m-auto w-full max-w-(--breakpoint-lg)">
      <Settings />
    </main>
  );
}
