import Header from "@/header";
import Settings from "@/settings";

export default function SettingPage() {
  return (
    <div className=" m-auto w-full max-w-screen-lg">
      <Header title="Settings" />
      <Settings />
    </div>
  );
}
