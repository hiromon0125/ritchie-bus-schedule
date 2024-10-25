import { BackBtn } from "@/backBtn";
import Header from "@/header";
import { BusPageListSkeleton } from "@/navlist/busNavList";
import ScrollToTopButton from "@/scrollToTopBtn";
import { BusTag } from "@/tags";
import Link from "next/link";
import { Suspense } from "react";
import { IoChevronBackSharp, IoChevronForwardSharp } from "react-icons/io5";
import { api } from "../../trpc/server";

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
        <Suspense fallback={<BusPageListSkeleton />}>
          <BusPageList />
        </Suspense>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

async function BusPageList() {
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
