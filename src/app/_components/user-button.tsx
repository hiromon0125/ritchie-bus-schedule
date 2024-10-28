"use client";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { PopoverArrow } from "@radix-ui/react-popover";
import Link from "next/link";
import { GoCodeReview, GoHomeFill } from "react-icons/go";
import {
  MdDirectionsBus,
  MdOutlineAutoFixHigh,
  MdSettings,
} from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { VscAccount, VscLaw } from "react-icons/vsc";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { api } from "../../trpc/react";
import { BusStopIcon } from "./icons";

type RouteOptions = "home" | "bus" | "stop" | "about";

export default function ProfileButton({ route }: { route?: RouteOptions }) {
  const { user } = useUser();

  const { data } = api.manager.isManager.useQuery({ userId: user?.id ?? "" });
  return (
    <Popover>
      <PopoverTrigger>
        <div className=" flex h-[48px] w-[48px] items-center justify-center rounded-full border-black bg-gray-300 text-black md:bg-white">
          <VscAccount
            size={35}
            strokeWidth={0.5}
            className=" overflow-visible"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className=" flex flex-col border-slate-800">
        <PopoverArrow color="white" className=" fill-slate-800" />
        <Link
          href="/"
          className=" flex flex-row items-center gap-2 rounded-md p-2 opacity-[--disabled-opacity] hover:bg-[--bg-hover]"
          aria-disabled={route === "home"}
          style={
            {
              "--disabled-opacity": route === "home" ? "0.5" : "1",
              "--bg-hover": route === "home" ? "white" : "#e2e8f0",
            } as React.CSSProperties
          }
        >
          <GoHomeFill size={20} />
          Home
        </Link>
        <Link
          href="/about"
          className=" flex flex-row items-center gap-2 rounded-md p-2 opacity-[--disabled-opacity] hover:bg-[--bg-hover]"
          style={
            {
              "--disabled-opacity": route === "about" ? "0.5" : "1",
              "--bg-hover": route === "about" ? "white" : "#e2e8f0",
            } as React.CSSProperties
          }
        >
          <GoCodeReview size={20} />
          About
        </Link>
        <Link
          href="/buses"
          className=" flex flex-row items-center gap-2 rounded-md p-2 opacity-[--disabled-opacity] hover:bg-[--bg-hover]"
          style={
            {
              "--disabled-opacity": route === "bus" ? "0.5" : "1",
              "--bg-hover": route === "bus" ? "white" : "#e2e8f0",
            } as React.CSSProperties
          }
        >
          <MdDirectionsBus size={20} />
          Buses
        </Link>
        <Link
          href="/stops"
          className=" flex flex-row items-center gap-2 rounded-md p-2 opacity-[--disabled-opacity] hover:bg-[--bg-hover]"
          style={
            {
              "--disabled-opacity": route === "stop" ? "0.5" : "1",
              "--bg-hover": route === "stop" ? "white" : "#e2e8f0",
            } as React.CSSProperties
          }
        >
          <BusStopIcon width={20} height={20} color="black" />
          stops
        </Link>
        <hr className=" mx-2 my-1 border-slate-400" />
        <Link
          href="/settings"
          className=" flex flex-row items-center gap-2 rounded-md p-2 hover:bg-slate-200"
        >
          <MdSettings size={20} />
          Settings
        </Link>
        {data && (
          <Link
            href="/manage"
            className=" flex flex-row items-center gap-2 rounded-md p-2 hover:bg-slate-200"
          >
            <MdOutlineAutoFixHigh size={20} />
            Manage
          </Link>
        )}
        <Link
          href="/pp"
          className=" flex flex-row items-center gap-2 rounded-md p-2 hover:bg-slate-200"
        >
          <VscLaw size={20} />
          Private Policy
        </Link>
        <hr className=" mx-2 my-1 border-slate-400" />
        <SignOutButton>
          <p className=" box-border flex flex-row gap-2 rounded-md border-2 border-rose-600 p-2 text-rose-600 hover:bg-rose-200">
            <TbLogout2 size={20} />
            Sign out
          </p>
        </SignOutButton>
      </PopoverContent>
    </Popover>
  );
}
