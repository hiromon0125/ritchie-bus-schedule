import Link from "next/link";
import { Suspense } from "react";
import { IoChevronBackSharp, IoChevronForwardSharp } from "react-icons/io5";
import { api } from "../../trpc/server";
import { BackBtn } from "../_components/backBtn";
import Header from "../_components/header";
import ScrollToTopButton from "../_components/scrollToTopBtn";
import { BusTag } from "../_components/tags";

export default async function Page() {
  return (
    <div className=" bg-slate-700">
      <Header title="Buses" route="bus" titleColor="white" />
      <div className=" px-5">
        <div>
          <Suspense fallback={<button>Back</button>}>
            <BackBtn className=" m-2 flex flex-row items-center gap-2 bg-transparent p-2 text-white">
              <IoChevronBackSharp size={24} />
              <p>Back</p>
            </BackBtn>
          </Suspense>
        </div>
        <Suspense fallback={<BusListSkeleton />}>
          <BusList />
        </Suspense>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

async function BusList() {
  const buses = await api.bus.getAll.query();

  return (
    <>
      {buses.map((bus) => (
        <Link
          href={`/bus/${bus.id}`}
          key={bus.id}
          className=" flex w-full flex-row items-center gap-3 border-t-2 border-white p-3 text-white transition-all hover:bg-slate-600"
          style={{ "--bus-color": bus.color } as React.CSSProperties}
        >
          <div className=" flex flex-1 flex-col gap-2">
            <div className=" flex flex-row items-center gap-2">
              <BusTag bus={bus} />
              <span className=" text-lg font-bold"> {bus.name}</span>
            </div>
            <p className=" text-left text-lg">{bus.description}</p>
          </div>
          <IoChevronForwardSharp size={24} />
        </Link>
      ))}
    </>
  );
}

export function BusListSkeleton() {
  return (
    <>
      {[...Array(6).keys()].map((count) => (
        <div
          key={count}
          className=" flex w-full flex-row items-center gap-3 border-t-2 border-white p-3 text-white transition-all hover:bg-slate-600"
        >
          <div className=" flex flex-1 flex-col gap-2">
            <div className=" flex w-full flex-row items-center gap-2">
              <div className=" aspect-square w-10 animate-pulse rounded-md bg-slate-400" />
              <div className=" h-5 w-full animate-pulse overflow-clip text-ellipsis text-nowrap rounded-md bg-slate-400 text-lg font-bold animation-delay-150" />
            </div>
            <div className=" h-5 w-8/12 animate-pulse rounded-md bg-slate-400"></div>
          </div>
          <IoChevronForwardSharp size={24} />
        </div>
      ))}
    </>
  );
}
