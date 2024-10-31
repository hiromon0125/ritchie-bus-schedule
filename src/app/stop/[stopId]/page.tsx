import {
  BusInfoSkeleton,
  BusStatus,
  SkeletonBusStatusString,
} from "@/busStatus";
import { FavBtn } from "@/favBtn";
import Header from "@/header";
import StopMap from "@/Map";
import { BusTag, StopTag } from "@/tags";
import TimeTable from "@/timeTable";
import { currentUser } from "@clerk/nextjs/server";
import type { Bus } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import _ from "lodash";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { MdDirectionsBus } from "react-icons/md";
import { api } from "~/trpc/server";
import type { RouterOutputs } from "../../../trpc/shared";

export default async function Page({
  params,
  searchParams: { busId: rawSelectedBusId },
}: {
  params: { stopId: string };
  searchParams: { busId?: string };
}) {
  const user = await currentUser();
  const stopId = Number(params.stopId);
  if (Number.isNaN(stopId)) {
    throw TRPCClientError.from(Error(`Invalid ID (stop id: ${params.stopId})`));
  }
  const currentStop = await api.stops.getOneByID.query({ id: stopId });
  if (!currentStop) {
    throw TRPCClientError.from(Error(`Stop not found (stop id: ${stopId})`));
  }
  let isFavorite = false;
  let favoriteBuses: number[] = [];
  if (user) {
    isFavorite = (await api.favorite.getAllStop.query())
      .map((e) => e.stopId)
      .includes(stopId);
    favoriteBuses = (await api.favorite.getAllBus.query())
      .map((bus) => bus.busId)
      .filter((bid) => currentStop.buses.map((b) => b.id).includes(bid))
      .filter(Boolean);
  }
  if (Array.isArray(rawSelectedBusId)) {
    permanentRedirect(`/stop/${stopId}?busId=${rawSelectedBusId[0]}`);
  }
  const selectedBusId = rawSelectedBusId ? Number(rawSelectedBusId) : NaN;
  const selectedBus = !isNaN(selectedBusId)
    ? currentStop.buses.find((bus) => bus.id === selectedBusId)
    : undefined;

  if (selectedBus === undefined) {
    const busId =
      favoriteBuses.length > 0 ? favoriteBuses[0] : currentStop.buses[0]?.id;
    permanentRedirect(`/stop/${stopId}?busId=${busId}`);
  }

  return (
    <main className=" [--margin:8px] md:[--margin:24px]">
      <Header title="Stop" route="stop" />
      <div className=" m-auto flex w-full max-w-screen-lg flex-col gap-2 px-[--margin] py-2 xs:gap-4">
        <div className=" flex flex-row items-center gap-2 xs:mt-3">
          <StopTag stop={currentStop} />
          <p className=" text-2xl font-bold">{currentStop.name}</p>
          <FavBtn isFavorited={isFavorite} />
        </div>
        <div className=" xs:mb-3">
          <p className=" text-lg">{currentStop.description}</p>
        </div>
        <div className=" flex w-[--sm-max-w] flex-row flex-wrap gap-2 rounded-[20px] bg-slate-200 p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:max-w-screen-lg">
          <div className=" flex w-full flex-row justify-between rounded-xl bg-white p-3 py-2">
            <h1 className=" m-0 text-xl font-bold xs:text-2xl">Buses</h1>
          </div>
          {_.sortBy(currentStop.buses, ["id"]).map((bus, i) => (
            <div
              className=" min-w-[calc(100vw-48px)] flex-1 md:w-auto md:min-w-[300px] md:max-w-[calc(50%-5px)] lg:min-w-[calc(50%-12px)]"
              key={i}
            >
              <Suspense fallback={<BusInfoSkeleton />}>
                <SelectableBusInfo
                  isSelected={selectedBusId === bus.id}
                  isFavorited={favoriteBuses.includes(bus.id)}
                  bus={bus}
                  stopId={stopId}
                  href={`/stop/${stopId}?busId=${bus.id}`}
                />
              </Suspense>
            </div>
          ))}
        </div>
        <div className=" flex flex-col gap-2 xs:gap-4 md:flex-row">
          <div
            className=" flex flex-1 flex-row flex-wrap gap-2 rounded-[20px] bg-slate-200 p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:max-w-screen-lg"
            style={
              {
                "--bus-color": selectedBus?.color ?? "gray",
              } as React.CSSProperties
            }
          >
            <div className=" flex w-full flex-row justify-between rounded-xl bg-white p-3 py-2">
              <div className=" flex flex-col gap-2">
                <h2 className=" m-0 pl-2 font-bold text-gray-700 xs:text-lg">
                  Timetable
                </h2>
                <Link
                  href={`/bus/${selectedBus.id}`}
                  className=" flex flex-row items-center gap-2"
                >
                  <BusTag bus={selectedBus} size="md" />
                  <p className=" font-semibold xs:text-2xl">
                    {selectedBus.name}
                  </p>
                </Link>
              </div>
              <Link
                href={`/bus/${selectedBus.id}`}
                className=" mr-2 flex flex-col items-center justify-center"
              >
                <MdDirectionsBus size={24} color="gray" />
                <p className=" text-sm text-[gray]">View</p>
              </Link>
            </div>
            <div className=" flex w-full flex-row justify-between rounded-xl bg-white p-3 py-2">
              <TimeTable stopId={stopId} />
            </div>
          </div>
          <div className=" relative flex flex-1 flex-row flex-wrap gap-2 rounded-[20px] bg-slate-200 p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:min-h-0 md:max-w-screen-lg">
            <div className=" h-[50vh] w-full flex-1 overflow-clip rounded-xl md:h-full">
              <Suspense fallback={<p>Loading...</p>}>
                <StopMap stops={currentStop} />
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
      busID: RouterOutputs["bus"]["getAllID"][0];
      bus?: never;
      isFavorited?: boolean;
      isSelected?: boolean;
      stopId: number;
      href: string;
    }
  | {
      bus: Bus;
      busID?: never;
      isFavorited?: boolean;
      isSelected?: boolean;
      stopId: number;
      href: string;
    };

const favoriteBus = async (busId: number) => {
  "use server";
  return api.favorite.addBus.mutate({ busId });
};
const unfavoriteBus = async (busId: number) => {
  "use server";
  return api.favorite.delBus.mutate({ busId });
};

async function SelectableBusInfo({
  busID,
  bus,
  isFavorited,
  isSelected,
  stopId,
  href,
}: BusStatusProps) {
  const busObj =
    bus ?? (busID ? await api.bus.getByID.query({ id: busID }) : null);
  if (!busObj) return null;
  const color = (busObj.color?.toLowerCase() as `#${string}`) ?? "#000000";

  return (
    <div className=" relative">
      <Link
        className="relative box-border flex h-full w-full flex-row items-stretch rounded-xl border-[3px] border-[--active-border] bg-white p-1 transition-all hover:border-[#1567ea] hover:shadow-md"
        style={
          {
            "--bus-color": color,
            "--active-border": isSelected ? "#1567ea" : "white",
          } as React.CSSProperties
        }
        href={href}
      >
        <div className=" h-auto min-w-3 rounded-l-md bg-[--bus-color]" />
        <div className=" relative flex w-min flex-1 flex-col flex-wrap justify-between">
          <div className=" mr-1 flex flex-1 flex-row items-center pl-4 pr-2 pt-2">
            <h2 className=" w-0 flex-1 overflow-hidden text-ellipsis text-nowrap text-left font-bold md:text-xl">
              {busObj.id} | {busObj?.name}
            </h2>
            <div className=" favbtn-placeholder h-6 w-6" />
          </div>
          <Suspense fallback={<SkeletonBusStatusString />}>
            <BusStatus bus={busObj} stopId={stopId} hideStopName />
          </Suspense>
        </div>
      </Link>
      <FavBtn
        className=" absolute right-3 top-3 z-10"
        isFavorited={isFavorited ?? false}
        onClick={async () => {
          "use server";
          await (isFavorited ? unfavoriteBus : favoriteBus)(busObj.id);
          revalidatePath(`/stop/[stopId]/page`);
        }}
      />
    </div>
  );
}
