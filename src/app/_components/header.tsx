import UserButton from "./user-button";

function Header() {
  return (
    <div className=" container top-0 flex min-w-full flex-row justify-between bg-slate-400">
      <a href="/">
        <div className=" p-3">
          <h1 className=" text-xl">Ritchie Bus Schedule</h1>
        </div>
      </a>
      <UserButton />
    </div>
  );
}

export default Header;
