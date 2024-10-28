import Image from "next/image";
import Link from "next/link";
import { HiHome } from "react-icons/hi2";
import { MdDirectionsBus } from "react-icons/md";
import { BusStopIcon } from "./icons";
import UserButton from "./user-button";

type RouteOptions = "home" | "bus" | "stop" | "about";

export default function Header({
  title,
  route,
  titleColor = { sm: "black", lg: "white" },
  bgColor = { sm: "#f1f5f9", lg: "#1E283B" },
}: {
  title?: string;
  route?: RouteOptions;
  titleColor?: { sm: string; lg: string };
  bgColor?: { sm: string; lg: string };
}) {
  return (
    <div
      className=" w-full"
      style={
        {
          "--lg-bg-color": bgColor.lg,
          "--sm-bg-color": bgColor.sm,
          "--lg-title-color": titleColor.lg,
          "--sm-title-color": titleColor.sm,
        } as React.CSSProperties
      }
    >
      <div className=" container top-0 flex min-w-full flex-row justify-between bg-[--sm-bg-color] text-[--sm-title-color] md:bg-[--lg-bg-color] md:text-[--lg-title-color]">
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
                <h1 className=" m-0 text-xl font-semibold text-[--sm-title-color] max-md:text-lg max-md:font-normal max-sm:hidden md:text-[--lg-title-color] lg:text-2xl">
                  Ritchie's Bus Schedule
                </h1>
              </div>
            </a>
            <div className=" flex flex-row items-center gap-4">
              <Link href="/buses">
                <p className=" mx-3 text-xl text-[--sm-title-color] underline md:text-[--lg-title-color]">
                  Buses
                </p>
              </Link>
              <Link href="/stops">
                <p className=" mx-3 text-xl text-[--sm-title-color] underline md:text-[--lg-title-color]">
                  Stops
                </p>
              </Link>
              <Link href="/about">
                <p className=" mx-3 text-xl text-[--sm-title-color] underline md:text-[--lg-title-color]">
                  About
                </p>
              </Link>
              <UserButton route={route} />
            </div>
          </div>
        </div>
        <div className=" relative m-auto w-full max-w-screen-lg justify-center md:hidden">
          <MobileHeader title={title ?? ""} route={route} />
        </div>
      </div>
      <div className=" h-3 w-full bg-gradient-to-b from-[--sm-bg-color] md:hidden" />
    </div>
  );
}

const TABBAR_COLOR = {
  OFF: "black",
  ON: "#1567ea",
};

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
          <h1 className=" m-0 text-2xl font-semibold text-[--sm-title-color] md:text-[--lg-title-color]">
            {title}
          </h1>
        </div>
        <div>
          <UserButton route={route} />
        </div>
      </div>
      <div className=" fixed bottom-3 z-50 w-full max-w-[100vw] px-3">
        <div className=" flex flex-row justify-around rounded-lg bg-slate-500 bg-opacity-50 backdrop-blur">
          <Link
            href="/buses"
            className=" m-1 flex flex-1 flex-col items-center rounded-md p-1"
            style={
              {
                "--color": route === "bus" ? TABBAR_COLOR.ON : TABBAR_COLOR.OFF,
                backgroundColor:
                  route === "bus" ? "rgba(255,255,255,0.2)" : "transparent",
              } as React.CSSProperties
            }
          >
            <MdDirectionsBus
              size={32}
              color={route === "bus" ? TABBAR_COLOR.ON : TABBAR_COLOR.OFF}
            />
            <p className=" m-0 text-center text-sm text-[--color]">Buses</p>
          </Link>
          <Link
            href="/"
            className=" m-1 flex flex-1 flex-col items-center rounded-md p-1"
            style={
              {
                "--color":
                  route === "home" ? TABBAR_COLOR.ON : TABBAR_COLOR.OFF,
                backgroundColor:
                  route === "home" ? "rgba(255,255,255,0.2)" : "transparent",
              } as React.CSSProperties
            }
          >
            <HiHome
              size={32}
              color={route === "home" ? TABBAR_COLOR.ON : TABBAR_COLOR.OFF}
            />
            <p className=" m-0 text-center text-sm text-[--color]">Home</p>
          </Link>
          <Link
            href="/stops"
            className=" m-1 flex flex-1 flex-col items-center rounded-md p-1"
            style={
              {
                "--color":
                  route === "stop" ? TABBAR_COLOR.ON : TABBAR_COLOR.OFF,
                backgroundColor:
                  route === "stop" ? "rgba(255,255,255,0.2)" : "transparent",
              } as React.CSSProperties
            }
          >
            <BusStopIcon
              width={32}
              height={32}
              color={route === "stop" ? TABBAR_COLOR.ON : TABBAR_COLOR.OFF}
            />
            <p className=" m-0 text-center text-sm text-[--color]">Stops</p>
          </Link>
        </div>
      </div>
    </>
  );
}
