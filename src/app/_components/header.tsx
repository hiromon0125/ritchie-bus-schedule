import Image from "next/image";
import Link from "next/link";
import ManageButton from "./manageBtn";
import UserButton from "./user-button";

function Header() {
  return (
    <div className=" container top-0 flex min-w-full flex-row justify-between bg-slate-400 px-2">
      <div className=" top-0 m-auto flex w-full max-w-screen-lg flex-row justify-between px-4">
        <a href="/">
          <div className=" flex flex-row items-center gap-4 py-6">
            <Image
              src="/icons/bus-512x512.png"
              alt="Logo"
              width={48}
              height={48}
            />
            <h1 className=" m-0 text-lg max-sm:hidden">Ritchie Bus Schedule</h1>
          </div>
        </a>
        <div className=" flex flex-row items-center gap-4">
          <Link href="/">
            <p className=" mx-3 text-xl underline">Buses</p>
          </Link>
          <Link href="/about">
            <p className=" mx-3 text-xl underline">About</p>
          </Link>
          <ManageButton />
          <UserButton />
        </div>
      </div>
    </div>
  );
}

export default Header;
