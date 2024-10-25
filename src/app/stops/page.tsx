import { BackBtn } from "@/backBtn";
import Header from "@/header";
import { StopListSkeleton } from "@/navlist/stopNavList";
import ScrollToTopButton from "@/scrollToTopBtn";
import { BusTag, StopTag } from "@/tags";
import _ from "lodash";
import Link from "next/link";
import { Suspense } from "react";
import { IoChevronBackSharp, IoChevronForwardSharp } from "react-icons/io5";
import { api } from "../../trpc/server";

export default async function Page() {
  return (
    <div className=" bg-slate-700">
      <Header title="Stops" route="stop" titleColor="white" />
      <div className=" px-5">
        <div>
          <Suspense fallback={<button>Back</button>}>
            <BackBtn className=" m-2 flex flex-row items-center gap-2 bg-transparent p-2 text-white">
              <IoChevronBackSharp size={24} />
              <p>Back</p>
            </BackBtn>
          </Suspense>
        </div>
        <Suspense fallback={<StopListSkeleton />}>
          <StopList />
        </Suspense>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

async function StopList() {
  const stops = await api.stops.getAll.query({ includeRelatedBus: true });

  return (
    <>
      {stops.map((stop) => (
        <Link
          href={`/stop/${stop.id}`}
          key={stop.id}
          className=" flex w-full flex-row items-center gap-3 border-t-2 border-white p-3 text-white transition-all hover:bg-slate-600"
        >
          <div className=" flex flex-1 flex-col gap-2">
            <div className=" flex w-full flex-row items-center gap-2">
              <StopTag stop={stop} />
              <span className=" w-full overflow-clip text-ellipsis text-nowrap text-lg font-bold">
                {" "}
                {stop.name}
              </span>
            </div>
            <div className=" flex flex-row flex-wrap gap-1">
              {stop.buses.length > 0 &&
                _.orderBy(stop.buses, ["id"], "asc").map((bus) => {
                  return <BusTag bus={bus} key={bus.id} size="sm" />;
                })}
            </div>
            <p className=" text-left text-lg">{stop.description}</p>
          </div>
          <IoChevronForwardSharp size={24} />
        </Link>
      ))}
    </>
  );
}
