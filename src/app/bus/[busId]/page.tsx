import { currentUser } from "@clerk/nextjs/server";
import type { Bus, Stops } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { track } from "@vercel/analytics/server";
import _ from "lodash";
import { type Metadata } from "next";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { MdDirectionsBus } from "react-icons/md";
import { api } from "t/server";
import {
  BusInfoSkeleton,
  BusStatus,
  SkeletonBusStatusString,
} from "../../_components/busStatus";
import { FavBtn } from "../../_components/favBtn";
import Header from "../../_components/header";
import StopMap from "../../_components/Map";
import { BusTag, StopTag } from "../../_components/tags";
import TimeTable from "../../_components/timeTable";

type Props = {
  params: { busId: string };
  searchParams: { stopId?: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const busId = parseInt(params.busId);
  if (Number.isNaN(busId)) {
    throw TRPCClientError.from(
      Error(`Bus not found (bus id: ${params.busId})`),
    );
  }
  const bus = await api.bus.getByID.query({ id: busId });
  if (!bus) {
    throw TRPCClientError.from(Error(`Bus not found (bus id: ${busId})`));
  }
  await track("Bus Page Viewed", { busId: bus.id });
  return {
    title: `Ritche's Bus Schedule | ${bus.id} ${bus.name}`,
    description: bus.description,
  };
}

export default async function Page({
  params,
  searchParams: { stopId: rawStopID },
}: Props) {
  const user = await currentUser();
  const bus = await api.bus.getByID.query({ id: parseInt(params.busId) });
  if (!bus) {
    throw TRPCClientError.from(
      Error(`Bus not found (bus id: ${params.busId})`),
    );
  }

  let isFavorite = false;
  let favoriteStops: number[] = [];
  if (user) {
    const stopIds = bus.stops.map((b) => b.id);
    isFavorite = (await api.favorite.getAllBus.query())
      .map((e) => e.busId)
      .includes(bus.id);
    favoriteStops = (await api.favorite.getAllStop.query())
      .map((stop) => stop.stopId)
      .filter((bid) => stopIds.includes(bid))
      .filter(Boolean);
  }
  if (Array.isArray(rawStopID)) {
    permanentRedirect(`/bus/${params.busId}?stopId=${rawStopID[0]}`);
  }
  const selectedStopId = rawStopID ? Number(rawStopID) : NaN;
  const selectedStop = !isNaN(selectedStopId)
    ? await api.stops.getOneByID.query({ id: selectedStopId })
    : undefined;

  if (!selectedStop) {
    const stopId =
      favoriteStops.length > 0
        ? favoriteStops[0]
        : bus.stops.map((e) => e.id).sort()[0];
    permanentRedirect(`/bus/${params.busId}?stopId=${stopId}`);
  }
  return (
    <main
      className=" [--margin:8px] md:[--margin:24px]"
      style={{ "--bus-color": bus.color } as React.CSSProperties}
    >
      <Header title="Bus" route="bus" />
      <div className=" m-auto flex w-full max-w-screen-lg flex-col gap-2 px-[--margin] py-2 xs:gap-4">
        <div className=" flex flex-row items-center gap-2 xs:mt-3">
          <BusTag bus={bus} />
          <p className=" text-2xl font-bold">{bus.name}</p>
          <FavBtn isFavorited={isFavorite} />
        </div>
        <div className=" xs:mb-3">
          <p className=" text-lg">{bus.description}</p>
        </div>
        <div className=" flex w-[--sm-max-w] flex-row flex-wrap gap-2 rounded-[20px] bg-slate-200 p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:max-w-screen-lg">
          <div className=" flex w-full flex-row justify-between rounded-xl bg-white p-3 py-2">
            <h1 className=" m-0 text-xl font-bold xs:text-2xl">Buses</h1>
          </div>
          {_.sortBy(bus.stops, ["id"]).map((stop, i) => (
            <div
              className=" min-w-[calc(100vw-48px)] flex-1 md:w-auto md:min-w-[300px] md:max-w-[calc(50%-5px)] lg:min-w-[calc(50%-12px)]"
              key={i}
            >
              <Suspense fallback={<BusInfoSkeleton />}>
                <SelectableStopInfo
                  isSelected={selectedStopId === stop.id}
                  isFavorited={favoriteStops.includes(stop.id)}
                  bus={bus}
                  stopID={stop.id}
                  href={`/bus/${bus.id}?stopId=${stop.id}`}
                />
              </Suspense>
            </div>
          ))}
        </div>
        <div className=" flex flex-col gap-2 xs:gap-4 md:flex-row">
          <div className=" flex flex-1 flex-row flex-wrap gap-2 rounded-[20px] bg-slate-200 p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:max-w-screen-lg">
            <div className=" flex w-full flex-row justify-between rounded-xl bg-white p-3 py-2">
              <div className=" flex flex-col gap-2">
                <h2 className=" m-0 pl-2 font-bold text-gray-700 xs:text-lg">
                  Timetable
                </h2>
                <Link
                  href={`/stop/${selectedStop.id}`}
                  className=" flex flex-row items-center gap-2"
                >
                  <StopTag stop={selectedStop} size="md" />
                  <p className=" font-semibold xs:text-2xl">
                    {selectedStop.name}
                  </p>
                </Link>
              </div>
              <Link
                href={`/stop/${selectedStop.id}`}
                className=" mr-2 flex flex-col items-center justify-center"
              >
                <MdDirectionsBus size={24} color="gray" />
                <p className=" text-sm text-[gray]">View</p>
              </Link>
            </div>
            <div className=" flex w-full flex-row justify-between rounded-xl bg-white p-3 py-2">
              <TimeTable busId={bus.id} />
            </div>
          </div>
          <div className=" relative flex flex-1 flex-row flex-wrap gap-2 rounded-[20px] bg-slate-200 p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:min-h-0 md:max-w-screen-lg">
            <div className=" h-[50vh] w-full flex-1 overflow-clip rounded-xl md:h-full">
              <Suspense fallback={<p>Loading...</p>}>
                <StopMap stops={bus.stops} />
              </Suspense>
            </div>
            <div className=" absolute left-0 top-0 flex w-full flex-row justify-between p-4 xs:p-5">
              <div className=" w-full rounded-md bg-white p-2">
                <h2 className=" m-0 text-xl font-bold xs:text-2xl">
                  Bus Stop Location
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className=" max-w-[480px] rounded-[20px] border-[8px] border-[#E2E8F0] p-3 xs:rounded-3xl md:border-[12px]">
          <h2 className=" text-lg font-bold xs:text-xl sm:mb-2 sm:text-3xl">
            Rate Page
          </h2>
          <p>Rate this bus!</p>
          <div className=" flex w-full flex-row justify-end">
            <Link
              href="https://forms.gle/7ooRfsDzmKvHnnZ76"
              className=" rounded-md bg-blue-600 p-3 text-white"
            >
              Yes
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

type BusStatusProps =
  | {
      stopID: Stops["id"];
      stop?: never;
      isFavorited?: boolean;
      isSelected?: boolean;
      bus: Bus;
      href: string;
    }
  | {
      stop: Stops;
      stopID?: never;
      isFavorited?: boolean;
      isSelected?: boolean;
      bus: Bus;
      href: string;
    };

const favoriteStop = async (stopId: number) => {
  "use server";
  return api.favorite.addStop.mutate({ stopId });
};
const unfavoriteStop = async (stopId: number) => {
  "use server";
  return api.favorite.delStop.mutate({ stopId });
};

async function SelectableStopInfo({
  stopID,
  stop,
  isFavorited,
  isSelected,
  bus,
  href,
}: BusStatusProps) {
  const stopObj = stop ?? (await api.stops.getOneByID.query({ id: stopID }));
  if (!stopObj) return null;

  return (
    <div className=" relative">
      <Link
        className="relative box-border flex h-full w-full flex-row items-stretch rounded-xl border-[3px] border-[--active-border] bg-white p-1 transition-all hover:border-[#1567ea] hover:shadow-md"
        style={
          {
            "--active-border": isSelected ? "#1567ea" : "white",
          } as React.CSSProperties
        }
        href={href}
      >
        <div className=" h-auto min-w-3 rounded-l-md bg-[--bus-color]" />
        <div className=" relative flex w-min flex-1 flex-col flex-wrap justify-between">
          <div className=" mr-1 flex flex-1 flex-row items-center pl-4 pr-2 pt-2">
            <StopTag stop={stopObj} />
            <h2 className=" w-0 flex-1 overflow-hidden text-ellipsis text-nowrap text-left font-bold md:text-xl">
              {stopObj?.name}
            </h2>
            <div className=" favbtn-placeholder h-6 w-6" />
          </div>
          <Suspense fallback={<SkeletonBusStatusString />}>
            <BusStatus bus={bus} stop={stopObj} hideStopName />
          </Suspense>
        </div>
      </Link>
      <FavBtn
        className=" absolute right-3 top-3 z-10"
        isFavorited={isFavorited ?? false}
        onClick={async () => {
          "use server";
          await (isFavorited ? unfavoriteStop : favoriteStop)(stopObj.id);
          revalidatePath(`/bus/[busId]/page`);
        }}
      />
    </div>
  );
}
