import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { FaHome } from "react-icons/fa";
import { LuClockAlert } from "react-icons/lu";
import { MdDirectionsBus } from "react-icons/md";
import { TbRoute } from "react-icons/tb";
import { api } from "../../trpc/server";
import Coffee from "./buymecoffee";
import { ProfileBtnComponent } from "./profileBtnWrapper";
import ServiceInfoButton from "./serviceinfo";
import { Share } from "./share";

function Footer() {
  return (
    <>
      <div className="mb-[calc(var(--mobile-footer-space)*-1)] w-full bg-slate-800 pb-(--mobile-footer-space) text-start text-base text-white [--mobile-footer-space:calc(var(--mobile-bottom-nav-height)+var(--mobile-bottom-nav-margin))] md:pb-0">
        <div className="m-auto flex w-full max-w-(--breakpoint-lg) flex-col">
          <div className="flex flex-col justify-between gap-3 px-3 pt-3 sm:px-6 sm:pt-6 md:flex-row md:items-end md:gap-8">
            <div className="flex flex-row items-center md:gap-2 md:pb-6">
              <Image
                src="/icons/bus-512x512.png"
                alt="Logo"
                width={60}
                height={60}
                className="scale-75 md:scale-100"
              />
              <h2 className="text-lg text-slate-200 md:text-2xl">
                Ritchie's Bus Schedule
              </h2>
            </div>
            <p className="text-sm sm:text-base md:hidden">
              A seemless tool for quickly finding the next bus arrival, keeping
              you focused on school.
            </p>
            <p className="text-xs text-slate-300 sm:text-sm md:hidden">
              Designed & Developed by{" "}
              <a className="underline" href="https://github.com/hiromon0125">
                Hiroto Takeuchi
              </a>
            </p>
            <div className="group">
              <Image
                className="translate-x-0 transition-all duration-500 group-hover:translate-x-36 group-hover:opacity-0"
                src="/images/speedy-bus.png"
                alt="speedy bus"
                width={84}
                height={32}
              />
            </div>
          </div>
          <div className="flex flex-row gap-6 border-t-2 border-t-white p-3 sm:p-6">
            <div className="hidden w-24 flex-auto flex-col justify-between md:visible md:flex">
              <p className="text-lg">
                A seemless tool for quickly finding the next bus arrival,
                keeping you focused on school.
              </p>
              <p className="text-sm text-slate-300">
                Designed & Developed by{" "}
                <a className="underline" href="https://github.com/hiromon0125">
                  Hiroto Takeuchi
                </a>
                <br />
                Open source assisted by{" "}
                <a href="https://fossrit.github.io/" className="underline">
                  FOSSRIT
                </a>
              </p>
            </div>
            <div className="flex w-48 flex-auto flex-row gap-3 sm:gap-8 md:justify-end">
              <div className="flex flex-col gap-3">
                <p>Navigate</p>
                <Link className="text-slate-300" href="/">
                  Home
                </Link>
                <Link className="text-slate-300" href="/buses">
                  Buses
                </Link>
                <Link className="text-slate-300" href="/stops">
                  Stops
                </Link>
                <ServiceInfoButton className="text-left text-slate-300">
                  Service Alert
                </ServiceInfoButton>
              </div>
              <div className="flex flex-col gap-3">
                <p>Project</p>
                <Link className="text-slate-300" href="/about">
                  About
                </Link>
                <a
                  className="text-slate-300"
                  href="https://github.com/hiromon0125/ritchie-bus-schedule"
                >
                  Repository
                </a>
                <a
                  className="text-slate-300"
                  href="https://github.com/hiromon0125/ritchie-bus-schedule/issues"
                >
                  Report Issues
                </a>
              </div>
              <div className="flex flex-col gap-3">
                <p>Legal</p>
                <Link className="text-slate-300" href="/setting">
                  Settings
                </Link>
                <Link className="text-slate-300" href="/pp">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse items-start justify-between gap-2 border-t-2 border-t-white px-3 py-3 text-slate-300 sm:px-6 md:flex-row md:items-center">
            <p className="text-sm">© 2025 Open Source on GitHub</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex flex-row items-center gap-4">
                <p className="hidden text-lg md:flex">Share</p>
                <Share />
              </div>
              <div className="flex flex-row items-center gap-4">
                <p className="hidden text-lg md:flex">Donate</p>
                <Coffee size="small" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="xs:px-3 sticky bottom-0 left-0 z-10 p-2 px-1 md:hidden">
        <div className="bg-border-background/60 mx-auto h-(--mobile-bottom-nav-height) justify-center rounded-3xl p-3 shadow-md backdrop-blur-md">
          <div className="top-0 m-auto flex h-full w-full max-w-(--breakpoint-lg) flex-row items-center gap-4">
            <div
              className="flex h-full flex-1 flex-row items-center gap-1 rounded-xl bg-neutral-500/60 p-[5px] text-sm shadow-[0px_2px_2px_-1px_var(--black-shadow-color)_inset,0px_-2px_4px_-1px_var(--white-shadow-color)_inset,0px_1px_1px_0px_var(--white-highlight-color)]"
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
                className="bg-item-background border-item-background hover:border-accent flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-lg border-[3px] shadow-[0_4px_4px_0_var(--black-shadow-color),0_-1px_2px_0_var(--white-shadow-color)] transition-all hover:shadow-md"
              >
                <MdDirectionsBus size={24} color="#0f172a" />
                <p>Buses</p>
              </Link>
              <Link
                href="/"
                className="bg-item-background border-item-background hover:border-accent flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-lg border-[3px] shadow-[0_4px_4px_0_var(--black-shadow-color),0_-1px_2px_0_var(--white-shadow-color)] transition-all hover:shadow-md"
              >
                <FaHome size={24} color="#0f172a" />
                <p>Home</p>
              </Link>
              <Link
                href="/stops"
                className="bg-item-background border-item-background hover:border-accent flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-lg border-[3px] shadow-[0_4px_4px_0_var(--black-shadow-color),0_-1px_2px_0_var(--white-shadow-color)] transition-all hover:shadow-md"
              >
                <TbRoute size={24} color="#0f172a" />
                <p>Stops</p>
              </Link>
              <ServiceInfoBtn />
            </div>
            <div className="max-xs:hidden h-14 w-[2px] bg-neutral-700" />
            <div className="bg-item-background max-xs:hidden flex aspect-square h-full items-center justify-center rounded-xl shadow-md">
              <Suspense>
                <ProfileBtnComponent />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ServiceInfoBtn() {
  return (
    <Suspense
      fallback={
        <ServiceInfoButton className="bg-item-background border-item-background hover:border-accent max-xs:hidden flex h-full flex-1 flex-col items-center justify-center rounded-lg border-[3px] shadow-[0_4px_4px_0_var(--black-shadow-color),0_-1px_2px_0_var(--white-shadow-color)] transition-all hover:shadow-md">
          <LuClockAlert size={24} color="#0f172a" />
          <p>Alert</p>
        </ServiceInfoButton>
      }
    >
      <AlertNavigation />
    </Suspense>
  );
}

async function AlertNavigation() {
  const count = await api.serviceinfo.getCount();
  return (
    <ServiceInfoButton className="bg-item-background border-item-background hover:border-accent max-xs:hidden flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-lg border-[3px] shadow-[0_4px_4px_0_var(--black-shadow-color),0_-1px_2px_0_var(--white-shadow-color)] transition-all hover:shadow-md">
      <LuClockAlert size={24} color="#0f172a" />
      <div className="relative">
        <p>Alert</p>
        {count > 0 && (
          <div className="absolute top-[-5px] right-[-8px] flex aspect-square h-4 flex-row items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            <p>{count}</p>
          </div>
        )}
      </div>
    </ServiceInfoButton>
  );
}

export default Footer;
