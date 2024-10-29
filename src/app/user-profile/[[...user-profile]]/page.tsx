import Header from "../../_components/header";
import Settings from "../../_components/settings";

function UserProfilePage() {
  return (
    <div className=" w-full">
      <Header title="User Profile" />
      <div className=" m-auto flex min-h-screen w-full max-w-screen-lg flex-col items-center justify-center">
        <Settings />
      </div>
    </div>
  );
}

export default UserProfilePage;
