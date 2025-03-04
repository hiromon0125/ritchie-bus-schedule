"use client";
import { FavBtn } from "@/favBtn";
import { BusTag, StopTag } from "@/tags";
import { useUser } from "@clerk/nextjs";
import type { Bus, Stops } from "@prisma/client";
import _ from "lodash";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { api } from "../../../trpc/react";
import {
  BusStatus,
  BusStatusBig,
  SkeletonBusStatusString,
} from "../../_components/busStatusClient";
import { ServiceInfoContentDecorator } from "../../_components/serviceinfo";

export default function BusPage() {
  const util = api.useUtils();
  const params = useParams();
  const searchParams = useSearchParams();
  const busId = params.busId ? parseInt(params.busId as string) : undefined;
  const rawSelectedStopId = searchParams.get("stopId");
  const { data: bus, isLoading } = api.bus.getByID.useQuery(
    {
      id: busId ?? -1,
      includeStops: true,
    },
    { enabled: !!busId },
  );
  const selectedStopId = rawSelectedStopId
    ? parseInt(rawSelectedStopId)
    : bus
      ? _.sortBy(bus.stops, "id")[0]?.id
      : undefined;
  const { isSignedIn } = useUser();
  const { data: favoriteBuses } = api.favorite.getAllBus.useQuery();
  const { mutate: favoriteBusHandle } = api.favorite.addBus.useMutation({
    onSuccess: async () => {
      await util.favorite.getAllBus.invalidate();
    },
  });
  const { mutate: unfavoriteBusHandle } = api.favorite.delBus.useMutation({
    onSuccess: async () => {
      await util.favorite.getAllBus.invalidate();
    },
  });
  const [favoriteBus, setFavoriteBus] = useState(
    () => _.findIndex(favoriteBuses, { id: busId }) >= 0,
  );
  if (isLoading) {
    return <BusDetailSkeleton />;
  }
  if (busId == undefined || isNaN(busId) || !bus) {
    return <div>Bus not found</div>;
  }
  const handleFavorite = () => {
    if (!isSignedIn) {
      alert("Please sign in to favorite this bus");
      return;
    }
    setFavoriteBus((p) => !p);
    if (favoriteBus) unfavoriteBusHandle({ busId: bus.id });
    else favoriteBusHandle({ busId: bus.id });
  };

  return (
    <>
      <div className=" flex flex-row items-center gap-2 xs:mt-3">
        <BusTag bus={bus} />
        <p className=" text-2xl font-bold">{bus.name}</p>
        <FavBtn isFavorited={favoriteBus} onClick={handleFavorite} />
      </div>
      <div className=" flex flex-col gap-1 xs:mb-2">
        <p className=" text-lg">{bus.description}</p>
        <BusStatusBig busId={bus.id ?? -1} />
      </div>
      <div>
        <BusServiceInfo busId={bus.id} />
      </div>
      <div className=" flex w-[--sm-max-w] flex-row flex-wrap gap-2 rounded-[20px] bg-slate-200 p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:max-w-screen-lg">
        <div className=" flex w-full flex-row justify-between rounded-xl bg-white p-3 py-2">
          <h1 className=" m-0 text-xl font-bold xs:text-2xl">Select Stops</h1>
        </div>
        {_.sortBy(bus.stops, ["id"]).map((stop, i) => (
          <div
            className=" min-w-[calc(100vw-48px)] flex-1 md:w-auto md:min-w-[300px] md:max-w-[calc(50%-5px)] lg:min-w-[calc(50%-12px)]"
            key={i}
          >
            <Suspense fallback={<BusInfoSkeleton />}>
              <SelectableStopInfo
                isSelected={selectedStopId === stop.id}
                bus={bus}
                stop={stop}
                href={`/bus/${bus.id}?stopId=${stop.id}`}
              />
            </Suspense>
          </div>
        ))}
      </div>
    </>
  );
}

type BusStatusProps = {
  stop: Stops;
  isSelected?: boolean;
  bus: Bus;
  href: string;
};

function SelectableStopInfo({ stop, isSelected, bus, href }: BusStatusProps) {
  const { isSignedIn } = useUser();
  const util = api.useUtils();
  const { data: favoriteStops, isLoading } = api.favorite.getAllStop.useQuery();
  const { mutate: favoriteStopHandle } = api.favorite.addStop.useMutation({
    onSuccess: async () => {
      await util.favorite.getAllStop.invalidate();
    },
  });
  const { mutate: unfavoriteStopHandle } = api.favorite.delStop.useMutation({
    onSuccess: async () => {
      await util.favorite.getAllStop.invalidate();
    },
  });
  const [isFavoriteStop, setFavoriteStop] = useState(
    () => _.findIndex(favoriteStops, { stopId: stop.id }) >= 0,
  );
  const handleFavorite = () => {
    if (!isSignedIn) {
      alert("Please sign in to favorite this stop");
      return;
    }
    setFavoriteStop((p) => !p);
    if (isFavoriteStop) unfavoriteStopHandle({ stopId: stop.id });
    else favoriteStopHandle({ stopId: stop.id });
  };
  if (isLoading) {
    return <BusInfoSkeleton />;
  }
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
          <div className=" mr-1 flex flex-1 flex-row items-center gap-2 pl-4 pr-2 pt-2">
            <StopTag stop={stop} />
            <h2 className=" w-0 flex-1 overflow-hidden text-ellipsis text-nowrap text-left font-bold md:text-xl">
              {stop.name}
            </h2>
            <div className=" favbtn-placeholder h-6 w-6" />
          </div>
          <BusStatus busId={bus.id} stopId={stop.id} hideStopName />
        </div>
      </Link>
      <FavBtn
        className=" absolute right-3 top-3 z-10"
        isFavorited={isFavoriteStop}
        onClick={handleFavorite}
      />
    </div>
  );
}

function BusServiceInfo({ busId }: { busId: number }) {
  const { data: infoService } = api.serviceinfo.getAll.useQuery({ busId });
  if (!infoService || infoService.length < 1) return null;

  return (
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
  );
}

function BusInfoSkeleton() {
  return (
    <div className=" relative -z-0">
      <div
        className="relative box-border flex h-full w-full flex-row items-stretch rounded-xl border-[3px] border-white bg-white p-1"
        style={{ "--bus-color": "gray" } as React.CSSProperties}
      >
        <div className=" h-auto min-w-3 rounded-l-md bg-[--bus-color]" />
        <div className=" relative flex w-full flex-1 flex-col flex-wrap justify-between">
          <div className=" mr-1 flex w-full flex-1 flex-row items-center px-4 pt-2">
            <div className=" h-4 w-full animate-pulse overflow-hidden text-ellipsis text-nowrap rounded-sm bg-slate-300 font-bold md:text-xl"></div>
          </div>
          <SkeletonBusStatusString />
        </div>
      </div>
    </div>
  );
}

function BusDetailSkeleton() {
  return (
    <div className=" flex w-full max-w-screen-lg flex-col gap-5">
      <div className=" flex flex-row items-center gap-2">
        <div className=" aspect-square h-10 animate-pulse rounded-md bg-slate-400" />
        <div className=" h-6 w-1/3 animate-pulse rounded-md bg-slate-400" />
        <div className=" aspect-square h-6 animate-pulse rounded-full bg-slate-400"></div>
      </div>
      <div className=" flex flex-col gap-2">
        <div className=" h-6 w-2/3 animate-pulse rounded-md bg-slate-400" />
        <div className=" h-6 w-1/3 animate-pulse rounded-md bg-slate-400" />
      </div>
      <div className=" flex flex-col gap-2">
        <div className=" flex flex-row items-center gap-2">
          <div className=" aspect-square h-6 animate-pulse rounded-full bg-slate-400" />
          <div className=" h-3 w-1/5 animate-pulse rounded-sm bg-slate-400" />
        </div>
        <div className=" flex flex-row items-center gap-2 pl-2">
          <div className=" aspect-square h-4 animate-pulse rounded-full bg-slate-400" />
          <div className=" h-3 w-1/3 animate-pulse rounded-sm bg-slate-400" />
        </div>
      </div>
    </div>
  );
}
