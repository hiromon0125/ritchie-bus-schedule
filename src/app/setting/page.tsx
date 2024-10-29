import Header from "../_components/header";
import Settings from "../_components/settings";

export default function SettingPage() {
  return (
    <div className=" m-auto w-full max-w-screen-lg">
      <Header title="Settings" />
      <Settings />
    </div>
  );
}
