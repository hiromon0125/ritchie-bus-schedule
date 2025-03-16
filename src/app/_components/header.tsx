import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LuClockAlert } from "react-icons/lu";
import { MdDirectionsBus } from "react-icons/md";
import { TbRoute } from "react-icons/tb";
import { api } from "../../trpc/server";
import { ProfileBtnComponent } from "./profileBtnWrapper";
import ServiceInfoButton from "./serviceinfo";

export default function Header() {
  return (
    <div className="  top-0 z-20 w-full px-1 text-slate-900 xs:px-3 md:sticky">
      <div className=" m-2 mx-auto h-24 w-full justify-center rounded-3xl bg-slate-200/60 p-3  md:max-w-screen-lg  md:shadow-md md:backdrop-blur-md">
        <div className=" top-0 m-auto flex h-full w-full max-w-screen-lg flex-row items-center gap-4">
          <Link
            href="/"
            className=" flex h-full flex-1 flex-row items-center gap-4 rounded-xl bg-white p-[10px]"
          >
            <Image
              src="/icons/bus-512x512.png"
              alt="Logo"
              width={48}
              height={48}
            />
            <h1 className=" m-0 text-lg font-semibold max-[450px]:hidden min-[850px]:text-xl min-[850px]:text-[--lg-title-color] lg:text-2xl">
              Ritchie's Bus Schedule
            </h1>
          </Link>
          <div
            className=" hidden h-full flex-row items-center gap-[5px] rounded-xl bg-neutral-500/60 p-[5px] text-xl shadow-[0px_2px_2px_-1px_var(--black-shadow-color)_inset,0px_-2px_4px_-1px_var(--white-shadow-color)_inset,0px_1px_1px_0px_var(--white-highlight-color)] md:flex"
            style={
              // This is a workaround because I couldn't get the opacity to work with the tailwind var classes
              {
                "--black-shadow-color": "rgba(0, 0, 0, 0.25)",
                "--white-shadow-color": "rgba(255, 255, 255, 0.7)",
                "--white-highlight-color": "rgba(255, 255, 255, 0.9)",
              } as React.CSSProperties
            }
          >
            <Link
              href="/buses"
              className=" flex h-full flex-row items-center justify-center gap-1 rounded-lg border-[3px] border-white bg-white pl-3 pr-4 shadow-[0_4px_4px_0_var(--black-shadow-color),0_-1px_2px_0_var(--white-shadow-color)] transition-all hover:border-[#1567ea] hover:shadow-md"
            >
              <MdDirectionsBus size={24} color="#0f172a" />
              <p>Buses</p>
            </Link>
            <Link
              href="/stops"
              className=" flex h-full flex-row items-center justify-center gap-1 rounded-lg border-[3px] border-white bg-white pl-3 pr-4 shadow-[0_4px_4px_0_var(--black-shadow-color),0_-1px_2px_0_var(--white-shadow-color)] transition-all hover:border-[#1567ea] hover:shadow-md"
            >
              <TbRoute size={24} color="#0f172a" />
              <p>Stops</p>
            </Link>
            <Suspense
              fallback={
                <ServiceInfoButton className=" flex h-full flex-row items-center justify-center rounded-lg border-[3px] border-white bg-white shadow-[0_4px_4px_0_var(--black-shadow-color),0_-1px_2px_0_var(--white-shadow-color)] transition-all hover:border-[#1567ea] hover:shadow-md">
                  <LuClockAlert size={24} color="#0f172a" />
                  <p>Alert</p>
                </ServiceInfoButton>
              }
            >
              <AlertNavigation />
            </Suspense>
          </div>
          <div className=" h-14 w-[2px] bg-neutral-700" />
          <div className=" flex aspect-square h-full items-center justify-center rounded-xl bg-white shadow-md">
            <Suspense>
              <ProfileBtnComponent />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

async function AlertNavigation() {
  const count = await api.serviceinfo.getCount();
  return (
    <ServiceInfoButton className=" flex h-full flex-row items-center justify-center gap-1 rounded-lg border-[3px] border-white bg-white px-3 shadow-[0_4px_4px_0_var(--black-shadow-color),0_-1px_2px_0_var(--white-shadow-color)] transition-all hover:border-[#1567ea] hover:shadow-md">
      <LuClockAlert size={24} color="#0f172a" />
      <div className=" relative">
        <p>Alert</p>
        {count > 0 && (
          <div className=" absolute right-[-8px] top-[-5px] flex aspect-square h-4 flex-row items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
            <p>{count}</p>
          </div>
        )}
      </div>
    </ServiceInfoButton>
  );
}
