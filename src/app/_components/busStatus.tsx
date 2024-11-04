import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import type { Bus, Stops } from "@prisma/client";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import React, { Suspense } from "react";
import { api } from "t/server";
import { type RouterOutputs } from "t/shared";
import { AnimatedDoubleList, ClickEventBlocker } from "./animatedList";
import BusStatusString, { BusStatusStringBig } from "./busStatusString";
import { FavBtn } from "./favBtn";
import { BusTag } from "./tags";

type BusStatusProps =
  | {
      busID: RouterOutputs["bus"]["getAllID"][0];
      bus?: never;
      isFavorited?: boolean;
    }
  | {
      bus: Bus;
      busID?: never;
      isFavorited?: boolean;
    };

const favoriteBus = async (busId: number) => {
  "use server";
  return api.favorite.addBus.mutate({ busId });
};
const unfavoriteBus = async (busId: number) => {
  "use server";
  return api.favorite.delBus.mutate({ busId });
};

export async function BusInfo({ busID, bus, isFavorited }: BusStatusProps) {
  const busObj =
    bus ?? (busID ? await api.bus.getByID.query({ id: busID }) : null);
  if (!busObj) return null;
  const color = (busObj.color?.toLowerCase() as `#${string}`) ?? "#000000";

  return (
    <div className=" relative h-full w-full">
      <ClickEventBlocker className=" h-full w-full">
        <Link
          href={`/bus/${busObj.id}`}
          title={`${busObj.id} ${busObj.name}`}
          className=" relative h-full"
        >
          <div
            className="relative box-border flex h-full w-full flex-row items-stretch rounded-xl border-[3px] border-white bg-white p-1 transition-all hover:border-[#1567ea] hover:shadow-md"
            style={{ "--bus-color": color } as React.CSSProperties}
          >
            <div className=" h-auto min-w-3 rounded-l-md bg-[--bus-color]" />
            <div className=" relative flex w-min flex-1 flex-col flex-wrap justify-between">
              <div className=" mr-1 flex flex-1 flex-row items-center gap-2 pl-2 pr-2 pt-2">
                <BusTag bus={busObj} size="sm" />
                <h2 className=" w-0 flex-1 overflow-hidden text-ellipsis text-nowrap text-left font-bold md:text-xl">
                  {busObj?.name}
                </h2>
                <div className=" favbtn-placeholder h-6 w-6" />
              </div>
              <Suspense fallback={<SkeletonBusStatusString />}>
                <BusStatus bus={busObj} />
              </Suspense>
            </div>
          </div>
        </Link>
      </ClickEventBlocker>
      <FavBtn
        className=" absolute right-3 top-3 z-10"
        isFavorited={isFavorited ?? false}
        onClick={async () => {
          "use server";
          await (isFavorited ? unfavoriteBus : favoriteBus)(busObj.id);
          revalidatePath("/", "page");
        }}
      />
    </div>
  );
}

type BusProp = { bus: Bus; busId?: never } | { busId: number; bus?: never };

type StopProp =
  | { stop?: never; stopId?: never }
  | { stop: Stops; stopId?: never }
  | { stopId: number; stop?: never };

type BusStatusProp = (BusProp & StopProp) & {
  hideStopName?: boolean;
};

export async function BusStatus({
  bus,
  stop,
  busId,
  stopId,
  hideStopName = false,
}: BusStatusProp) {
  const data = {
    stopId: stopId ?? stop?.id,
    busId: busId ?? bus.id,
    bus: bus ?? (await api.bus.getByID.query({ id: busId })),
    stop:
      stop ??
      (stopId ? await api.stops.getOneByID.query({ id: stopId }) : undefined) ??
      undefined,
  };
  if (!data.bus) return null;
  const currentRoute = await api.routes.getCurrentRouteOfBus.query({
    busId: data.busId,
    stopId: data.stopId,
  });
  const lastRoute = await api.routes.getLastRouteOfBuses
    .query({
      busId: data.busId,
      stopId: data.stopId,
    })
    .then((data) => data[0]?.lastRoute ?? null);
  return (
    <BusStatusString
      bus={data.bus}
      fetchedRoute={{ serverGuess: currentRoute, lastRoute }}
      stop={data.stop}
      hideStopName={hideStopName}
    />
  );
}

type BusStatusBigProp = BusProp & {
  stops: Stops[];
};

export async function BusStatusBig({ bus, busId, stops }: BusStatusBigProp) {
  const data = {
    busId: busId ?? bus.id,
    bus: bus ?? (await api.bus.getByID.query({ id: busId })),
  };
  if (!data.bus) return null;
  const currentRoute = await api.routes.getCurrentRouteOfBus.query({
    busId: data.busId,
  });
  const lastRoute = await api.routes.getLastRouteOfBuses
    .query({
      busId: data.busId,
    })
    .then((data) => data[0]?.lastRoute ?? null);
  return (
    <BusStatusStringBig
      bus={data.bus}
      fetchedRoute={{ serverGuess: currentRoute, lastRoute }}
      stops={stops}
    />
  );
}
export function SkeletonBusStatusString() {
  return (
    <div className=" flex h-12 flex-row items-center">
      <div className=" relative ml-5 h-3 w-3">
        <div className=" absolute left-0 top-0 h-3 w-3 rounded-full bg-[--bus-color] animation-delay-100" />
      </div>
      <div className=" relative flex h-full w-full flex-col justify-center pl-4">
        <div className=" h-5 w-9/12 animate-pulse rounded-sm bg-slate-300 animation-delay-100" />
      </div>
    </div>
  );
}

export function BusInfoSkeleton() {
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

export function InfoSkeleton() {
  return (
    <div className=" relative flex w-full flex-1 flex-col flex-wrap justify-between">
      <div className=" mr-1 flex w-full flex-1 flex-row items-center px-4 pt-2">
        <div className=" h-4 w-full animate-pulse overflow-hidden text-ellipsis text-nowrap rounded-sm bg-slate-300 font-bold md:text-xl"></div>
      </div>
      <SkeletonBusStatusString />
    </div>
  );
}

export async function BusList() {
  const user = await currentUser();
  const buses = await api.bus.getAll.query();
  let favBusesId: number[] = [];
  if (user) {
    favBusesId = (await api.favorite.getAllBus.query()).map((bus) => bus.busId);
  }
  return (
    <AnimatedDoubleList
      favoritedBusKeys={favBusesId.map((favBus) => favBus.toString())}
      emptySection={
        <>
          <SignedIn>
            <div className=" flex h-28 w-full flex-row items-center justify-center rounded-md p-2 text-lg font-bold text-slate-500">
              Favorite some buses from below to see them here!
            </div>
          </SignedIn>
          <SignedOut>
            <div className=" flex h-28 w-full flex-row items-center justify-center gap-1 rounded-md bg-slate-300 p-2 text-lg font-bold text-slate-600">
              <SignInButton>
                <u className=" text-blue-600 underline">Sign in</u>
              </SignInButton>
              <p>to add your favorite buses.</p>
            </div>
          </SignedOut>
        </>
      }
      locked={!user}
    >
      {buses.map((bus) => {
        return (
          <div className=" h-full w-full" key={bus.id}>
            <Suspense fallback={<BusInfoSkeleton />}>
              <BusInfo bus={bus} isFavorited={favBusesId.includes(bus.id)} />
            </Suspense>
          </div>
        );
      })}
    </AnimatedDoubleList>
  );
}

export function BusListSkeleton() {
  return (
    <div className=" flex w-[--sm-max-w] flex-col gap-2 rounded-[20px] bg-slate-200 p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:max-w-screen-lg">
      <div className=" flex flex-row justify-between rounded-xl bg-white p-3 py-2">
        <h1 className=" m-0 text-2xl font-bold">Favorite Buses</h1>
      </div>
      <div className=" relative flex max-w-screen-lg flex-row flex-wrap gap-3 md:min-w-80">
        {[...Array(4).keys()]?.map((i) => (
          <div
            className=" w-auto min-w-full flex-1 md:min-w-[40%] md:max-w-[calc(50%-6px)]"
            key={i}
          >
            <BusInfoSkeleton />
          </div>
        ))}
      </div>
      <div className=" flex flex-row justify-between rounded-xl bg-white p-3 py-2">
        <h1 className=" m-0 text-2xl font-bold">Buses</h1>
      </div>
      <div className=" relative flex max-w-screen-lg flex-row flex-wrap gap-3 md:min-w-80">
        {[...Array(6).keys()]?.map((i) => (
          <div
            className=" w-auto min-w-full flex-1 md:min-w-[40%] md:max-w-[calc(50%-6px)]"
            key={i}
          >
            <BusInfoSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
