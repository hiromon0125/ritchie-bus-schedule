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
    <div className="xs:px-3 text-foreground top-2 z-20 w-full px-1 md:sticky">
      <div className="bg-border-background md:bg-border-background/60 m-2 mx-auto h-24 w-full justify-center rounded-3xl border-slate-700 p-3 md:max-w-(--breakpoint-lg) md:backdrop-blur-md not-dark:md:shadow-md dark:border">
        <div className="top-0 m-auto flex h-full w-full max-w-(--breakpoint-lg) flex-row items-center gap-4">
          <Link
            href="/"
            className="bg-item-background flex h-full flex-1 flex-row items-center gap-4 rounded-xl p-[10px]"
          >
            <Image
              src="/icons/bus-512x512.png"
              alt="Logo"
              width={48}
              height={48}
            />
            <p className="m-0 text-lg font-semibold max-[450px]:hidden min-[850px]:text-xl lg:text-2xl">
              Ritchie's Bus Schedule
            </p>
          </Link>
          <div
            className="hidden h-full flex-row items-center gap-[5px] rounded-xl bg-neutral-500/60 p-[5px] text-xl not-dark:shadow-[0px_2px_2px_-1px_var(--black-shadow-color)_inset,0px_-2px_4px_-1px_var(--white-shadow-color)_inset,0px_1px_1px_0px_var(--white-highlight-color)] md:flex dark:bg-slate-950/60"
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
              className="bg-item-background hover:border-accent border-item-background flex h-full flex-row items-center justify-center gap-1 rounded-lg border-[3px] pr-4 pl-3 transition-all not-dark:shadow-[0_4px_4px_0_var(--black-shadow-color),0_-1px_2px_0_var(--white-shadow-color)] hover:shadow-md"
            >
              <MdDirectionsBus
                size={24}
                color="black"
                className="dark:invert-100"
              />
              <p>Buses</p>
            </Link>
            <Link
              href="/stops"
              className="bg-item-background hover:border-accent border-item-background flex h-full flex-row items-center justify-center gap-1 rounded-lg border-[3px] pr-4 pl-3 transition-all not-dark:shadow-[0_4px_4px_0_var(--black-shadow-color),0_-1px_2px_0_var(--white-shadow-color)] hover:shadow-md"
            >
              <TbRoute size={24} color="black" className="dark:invert-100" />
              <p>Stops</p>
            </Link>
            <Suspense
              fallback={
                <ServiceInfoButton className="bg-item-background hover:border-accent border-item-background flex h-full flex-row items-center justify-center gap-1 rounded-lg border-[3px] px-3 transition-all not-dark:shadow-[0_4px_4px_0_var(--black-shadow-color),0_-1px_2px_0_var(--white-shadow-color)] hover:shadow-md">
                  <LuClockAlert
                    size={24}
                    color="black"
                    className="dark:invert-100"
                  />
                  <p>Alert</p>
                </ServiceInfoButton>
              }
            >
              <AlertNavigation />
            </Suspense>
          </div>
          <div className="h-14 w-[2px] rounded-full bg-neutral-700 dark:bg-neutral-300" />
          <div className="bg-item-background flex aspect-square h-full items-center justify-center rounded-xl shadow-md">
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
    <ServiceInfoButton className="bg-item-background hover:border-accent border-item-background flex h-full flex-row items-center justify-center gap-1 rounded-lg border-[3px] px-3 transition-all not-dark:shadow-[0_4px_4px_0_var(--black-shadow-color),0_-1px_2px_0_var(--white-shadow-color)] hover:shadow-md">
      <LuClockAlert size={24} color="black" className="dark:invert-100" />
      <div className="relative">
        <p>Alert</p>
        {count > 0 && (
          <div className="absolute top-[-5px] right-[-8px] flex aspect-square h-4 flex-row items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
            <p>{count}</p>
          </div>
        )}
      </div>
    </ServiceInfoButton>
  );
}
