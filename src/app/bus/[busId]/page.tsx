import {
  BusInfoSkeleton,
  BusStatus,
  BusStatusBig,
  SkeletonBusStatusString,
} from "@/busStatus";
import { FavBtn } from "@/favBtn";
import { BusTag, StopTag } from "@/tags";
import { currentUser } from "@clerk/nextjs/server";
import type { Bus, Stops } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import _ from "lodash";
import { DateTime } from "luxon";
import { type Metadata } from "next";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { IoMdInformationCircle } from "react-icons/io";
import { api } from "t/server";
import ClickableTooltip from "../../_components/infobtn";
import { ServiceInfoContentDecorator } from "../../_components/serviceinfo";
type Props = {
  params: Promise<{ busId: string }>;
  searchParams: Promise<{ stopId?: string | string[] | undefined }>;
  timetable: React.ReactNode;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const busId = parseInt(params.busId);
  if (Number.isNaN(busId)) {
    throw TRPCClientError.from(
      Error(`Bus not found (bus id: ${params.busId})`),
    );
  }
  const bus = await api.bus.getByID({ id: busId });
  if (!bus) {
    throw TRPCClientError.from(Error(`Bus not found (bus id: ${busId})`));
  }
  return {
    title: `Ritche's Bus Schedule | ${bus.id} ${bus.name}`,
    description: bus.description,
  };
}

export default async function Page(props: Props) {
  const [{ stopId: rawStopID }, params, user] = await Promise.all([
    props.searchParams,
    props.params,
    currentUser(),
  ]);
  const bus = await api.bus.getByID({
    id: parseInt(params.busId),
    includeStops: true,
  });

  if (!bus) {
    throw TRPCClientError.from(
      Error(`Bus not found (bus id: ${params.busId})`),
    );
  }

  let isFavorite = false;
  let favoriteStops: number[] = [];
  if (user) {
    const stopIds = bus.stops.map((b) => b.id);
    const [allBus, allStop] = await Promise.all([
      api.favorite.getAllBus(),
      api.favorite.getAllStop(),
    ]);
    isFavorite = allBus.map((e) => e.busId).includes(bus.id);
    favoriteStops = allStop
      .map((stop) => stop.stopId)
      .filter((bid) => stopIds.includes(bid))
      .filter(Boolean);
  }
  if (Array.isArray(rawStopID)) {
    permanentRedirect(`/bus/${params.busId}?stopId=${rawStopID[0]}`);
  }
  const stopId =
    favoriteStops.length > 0
      ? favoriteStops[0]
      : bus.stops.map((e) => e.id).sort()[0];
  const selectedStopId = rawStopID ? Number(rawStopID) : NaN;
  const selectedStop = !isNaN(selectedStopId)
    ? bus.stops.find((stop) => stop.id === selectedStopId)
    : bus.stops.find((stop) => stop.id === stopId);

  if (!selectedStop) {
    permanentRedirect(`/bus/${params.busId}?stopId=${stopId}`);
  }
  return (
    <>
      <div className=" bg-border-background flex w-[--sm-max-w] flex-row flex-wrap gap-2 rounded-[20px] p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:max-w-screen-lg">
        <div className=" bg-item-background flex w-full flex-row rounded-xl p-2 md:gap-2">
          <div className=" h-auto min-w-3 rounded-l-md bg-[--bus-color]" />
          <div className=" bg-item-background flex w-full flex-col gap-2 px-2 md:p-3">
            <div className=" flex flex-row items-center gap-2">
              <BusTag bus={bus} />
              <p className=" text-lg font-bold md:text-2xl">{bus.name}</p>
              <FavBtn isFavorited={isFavorite} />
            </div>
            <p className=" text-base md:text-lg">{bus.description}</p>
          </div>
        </div>
        <div className=" bg-item-background flex w-full flex-col gap-2 rounded-xl p-2 pl-3">
          <h2 className=" m-0 text-lg font-semibold md:text-2xl">Status</h2>
        </div>
        <div className=" bg-item-background flex w-full flex-row gap-4 rounded-xl px-2 md:p-2 md:pl-3">
          <div className=" flex flex-col gap-2 py-2">
            <Suspense fallback={<p>Loading...</p>}>
              <BusStatusBig busId={bus.id ?? -1} />
            </Suspense>
          </div>
        </div>
        <BusServiceInfo busId={bus.id} />
      </div>
      <div className=" bg-border-background flex w-[--sm-max-w] flex-row flex-wrap gap-2 rounded-[20px] p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:max-w-screen-lg">
        <div className=" bg-item-background flex w-full flex-row items-center justify-between rounded-xl p-1 pl-3 pr-2 md:p-3">
          <h2 className=" m-0 text-lg font-bold xs:text-2xl">Select Stops</h2>
          <ClickableTooltip tipMessage="Click on the bus stop to view it's timetable below.">
            <IoMdInformationCircle
              size={32}
              className=" scale-150 opacity-30"
            />
          </ClickableTooltip>
        </div>
        {_.sortBy(bus.stops, ["id"]).map((stop, i) => (
          <div
            className=" min-w-[calc(100vw-48px)] flex-1 md:w-auto md:min-w-[300px] md:max-w-[calc(50%-5px)] lg:min-w-[calc(50%-12px)]"
            key={i}
          >
            <Suspense fallback={<BusInfoSkeleton />}>
              <SelectableStopInfo
                isSelected={selectedStop.id === stop.id}
                isFavorited={favoriteStops.includes(stop.id)}
                bus={bus}
                stopID={stop.id}
                href={`/bus/${bus.id}?stopId=${stop.id}`}
              />
            </Suspense>
          </div>
        ))}
      </div>
    </>
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
  return api.favorite.addStop({ stopId });
};
const unfavoriteStop = async (stopId: number) => {
  "use server";
  return api.favorite.delStop({ stopId });
};

async function SelectableStopInfo({
  stopID,
  stop,
  isFavorited,
  isSelected,
  bus,
  href,
}: BusStatusProps) {
  const stopObj = stop ?? (await api.stops.getOneByID({ id: stopID }));
  if (!stopObj) return null;

  return (
    <div className=" relative">
      <Link
        className="bg-item-background relative box-border flex h-full w-full flex-row items-stretch rounded-xl border-[3px] border-[--active-border] p-1 transition-all hover:border-[#1567ea] hover:shadow-md"
        style={
          {
            "--active-border": isSelected ? "#1567ea" : "white",
          } as React.CSSProperties
        }
        href={href}
      >
        <div className=" h-auto min-w-3 rounded-l-md bg-[--bus-color]" />
        <div className=" relative flex w-min flex-1 flex-col flex-wrap justify-between">
          <div className=" mr-1 flex flex-1 flex-row items-center gap-2 pl-2 pr-2 pt-2 sm:pl-4">
            <StopTag stop={stopObj} />
            <h2 className=" w-0 flex-1 overflow-hidden text-ellipsis text-nowrap text-left font-bold md:text-xl">
              {stopObj?.name}
            </h2>
            <div className=" favbtn-placeholder h-6 w-6" />
          </div>
          <Suspense fallback={<SkeletonBusStatusString />}>
            <BusStatus busId={bus.id} stopId={stopObj.id} hideStopName />
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

async function BusServiceInfo({ busId }: { busId: number }) {
  const infoService = await api.serviceinfo.getAll({ busId });
  if (!infoService || infoService.length < 1) return null;

  return (
    <div className=" bg-item-background rounded-xl">
      <div className=" flex flex-row gap-4 rounded-xl border-2 border-orange-500 bg-gradient-to-b from-orange-500/40 to-white/40 p-5">
        <div className=" min-w-[40px] sm:min-w-[60px]">
          <Image
            src="/service-info-icon.png"
            width={60}
            height={60}
            alt="Alert"
          />
        </div>
        <div className=" pt-1">
          {infoService.map((alert) => (
            <div key={alert.hash} className=" flex flex-col gap-2">
              <div className=" flex flex-row items-center gap-4">
                <p className=" text-lg font-bold">{alert.title}</p>
                <p className=" text-sm font-semibold text-[#63646e]">
                  {DateTime.fromJSDate(alert.createdAt).toFormat("LLL dd")}
                </p>
              </div>
              <div className=" text-base">
                <ServiceInfoContentDecorator content={alert.content} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
