import ManageButton from "./manageBtn";
import UserButton from "./user-button";

function Header() {
  return (
    <div className=" container top-0 flex min-w-full flex-row justify-between bg-slate-400">
      <div className=" top-0 m-auto flex w-full max-w-screen-lg flex-row justify-between px-4 sm:px-0">
        <a href="/">
          <div className=" py-6">
            <h1 className=" m-0 text-lg sm:text-2xl">Ritchie Bus Schedule</h1>
          </div>
        </a>
        <div className=" flex flex-row gap-4">
          <ManageButton />
          <UserButton />
        </div>
      </div>
    </div>
  );
}

export default Header;
