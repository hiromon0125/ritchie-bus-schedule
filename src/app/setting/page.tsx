import Settings from "@/settings";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings | RIT Bus Schedule",
  description: "Customize your RIT Bus Schedule profile, update your profile picture or change preferences",
}

export default function SettingPage() {
  return (
    <main className=" m-auto w-full max-w-(--breakpoint-lg)">
      <Settings />
    </main>
  );
}
