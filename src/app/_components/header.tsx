import Image from "next/image";
import Link from "next/link";
import { HiHome } from "react-icons/hi2";
import { MdDirectionsBus } from "react-icons/md";
import { BusStopIcon } from "./icons";
import UserButton from "./user-button";

type RouteOptions = "home" | "bus" | "stop" | "about";

function Header({ title, route }: { title?: string; route?: RouteOptions }) {
  return (
    <div className=" container top-0 flex min-w-full flex-row justify-between md:bg-slate-400">
      <div className=" m-auto hidden w-full max-w-screen-lg justify-center md:block">
        <div className=" top-0 m-auto flex w-full max-w-screen-lg flex-row justify-between px-4">
          <a href="/">
            <div className=" flex flex-row items-center gap-4 py-6">
              <Image
                src="/icons/bus-512x512.png"
                alt="Logo"
                width={48}
                height={48}
              />
              <h1 className=" m-0 text-xl font-semibold max-md:text-lg max-md:font-normal max-sm:hidden lg:text-2xl">
                Ritchie's Bus Schedule
              </h1>
            </div>
          </a>
          <div className=" flex flex-row items-center gap-4">
            <Link href="/">
              <p className=" mx-3 text-xl underline">Buses</p>
            </Link>
            <Link href="/about">
              <p className=" mx-3 text-xl underline">About</p>
            </Link>
            <UserButton route={route} />
          </div>
        </div>
      </div>
      <div className=" relative m-auto w-full max-w-screen-lg justify-center md:hidden">
        <MobileHeader title={title ?? ""} route={route} />
      </div>
    </div>
  );
}

function MobileHeader({
  title,
  route,
}: {
  title: string;
  route?: RouteOptions;
}) {
  return (
    <>
      <div className=" flex flex-row items-end justify-between px-3">
        <div className=" flex flex-row items-center gap-4 pt-4">
          <a href="/">
            <Image
              src="/icons/bus-512x512.png"
              alt="Logo"
              width={48}
              height={48}
            />
          </a>
          <h1 className=" m-0 text-2xl font-semibold">{title}</h1>
        </div>
        <div>
          <UserButton route={route} />
        </div>
      </div>
      <div className=" fixed bottom-3 z-50 w-full max-w-[100vw] px-3">
        <div className=" flex flex-row justify-around rounded-lg bg-slate-500 bg-opacity-50 px-3 backdrop-blur">
          <Link
            href="/"
            className=" flex flex-1 flex-col items-center p-2"
            style={
              {
                "--color": route === "bus" ? "#1567ea" : "black",
              } as React.CSSProperties
            }
          >
            <MdDirectionsBus
              size={32}
              color={route === "bus" ? "#1567ea" : "black"}
            />
            <p className=" m-0 text-center text-sm text-[--color]">Buses</p>
          </Link>
          <Link
            href="/"
            className=" m-1 flex flex-1 flex-col items-center rounded-lg p-1 px-4"
            style={
              {
                "--color": route === "home" ? "#1567ea" : "black",
              } as React.CSSProperties
            }
          >
            <HiHome size={32} color={route === "home" ? "#1567ea" : "white"} />
            <p className=" m-0 text-center text-sm text-[--color]">Home</p>
          </Link>
          <Link
            href="/about"
            className=" flex flex-1 flex-col items-center p-2"
            style={
              {
                "--color": route === "stop" ? "#1567ea" : "black",
              } as React.CSSProperties
            }
          >
            <BusStopIcon
              width={32}
              height={32}
              color={route === "stop" ? "#1567ea" : "black"}
            />
            <p className=" m-0 text-center text-sm text-[--color]">Stops</p>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Header;
