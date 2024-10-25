import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import type { Bus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import React, { Suspense } from "react";
import { api } from "t/server";
import { type RouterOutputs } from "t/shared";
import BusStatusString from "./busStatusString";
import { FavBtn } from "./favBtn";

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

async function BusInfo({ busID, bus, isFavorited }: BusStatusProps) {
  const busObj = bus ?? (busID ? await api.bus.getByID.query(busID) : null);
  if (!busObj) return null;
  const color = (busObj.color?.toLowerCase() as `#${string}`) ?? "#000000";

  return (
    <div className=" relative">
      <Link
        href={`/bus/${busObj.id}`}
        title={`${busObj.id} ${busObj.name}`}
        className=" relative -z-0"
      >
        <div
          className="relative box-border flex h-full w-full flex-row items-stretch rounded-xl border-[3px] border-white bg-white p-1 transition-all hover:border-[#1567ea] hover:shadow-md"
          style={{ "--bus-color": color } as React.CSSProperties}
        >
          <div className=" h-auto min-w-3 rounded-l-md bg-[--bus-color]" />
          <div className=" relative flex w-full flex-1 flex-col flex-wrap justify-between">
            <div className=" mr-1 flex w-full flex-1 flex-row items-center pl-4 pr-2 pt-2">
              <h2 className=" w-full overflow-hidden text-ellipsis text-nowrap font-bold md:text-xl">
                {busObj.id} | {busObj?.name}
              </h2>
              <div className=" favbtn-placeholder h-6 w-6" />
            </div>
            <Suspense fallback={<SkeletonBusStatusString />}>
              <Status busObj={busObj} />
            </Suspense>
          </div>
        </div>
      </Link>
      <FavBtn
        className=" absolute right-3 top-3 z-10"
        isFavorited={isFavorited ?? false}
        onClick={async () => {
          "use server";
          await (isFavorited ? unfavoriteBus : favoriteBus)(busObj.id);
          revalidatePath("/");
        }}
      />
    </div>
  );
}

async function Status({ busObj }: { busObj: Bus }) {
  const currentRoute = await api.routes.getCurrentRouteOfBus.query({
    busId: busObj.id,
  });
  const lastRoute = await api.routes.getLastRouteOfBuses
    .query({
      busId: busObj.id,
    })
    .then((data) => data[0]?.lastRoute ?? null);
  return (
    <BusStatusString
      bus={busObj}
      fetchedRoute={{ serverGuess: currentRoute, lastRoute }}
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

export async function BusList() {
  const buses = await api.bus.getAll.query();
  const favBusesId = await api.favorite.getAllBus.query();
  const favBuses = favBusesId.map((favBus) =>
    buses.find((bus) => bus.id === favBus.busId),
  ) as Bus[];
  const nonFavBuses = buses.filter(
    (bus) => !favBusesId.find((favBus) => favBus.busId === bus.id),
  );
  return (
    <div className=" m-3 flex max-w-[--sm-max-w] flex-col gap-3 rounded-3xl bg-slate-200 p-3 md:max-w-screen-lg">
      <div className=" flex flex-row justify-between rounded-xl bg-white p-3 py-2">
        <h1 className=" m-0 text-2xl font-bold">Favorite Buses</h1>
      </div>
      <div
        className=" relative flex max-w-screen-lg flex-row flex-wrap gap-3 md:min-w-80"
        style={
          {
            "--md-max-width": "calc(50% - 5px)",
            "--lg-min-width": "calc(50% - 12px)",
            "--sm-min-width": "calc(100vw - 48px)",
          } as React.CSSProperties
        }
      >
        <SignedIn>
          {favBuses.map((bus, i) => (
            <div
              className=" min-w-[--sm-min-width] flex-1 md:w-auto md:min-w-[300px] md:max-w-[--md-max-width] lg:min-w-[--lg-min-width]"
              key={i}
            >
              <Suspense fallback={<BusInfoSkeleton />}>
                <BusInfo bus={bus} isFavorited />
              </Suspense>
            </div>
          ))}
          {favBusesId.length === 0 && (
            <div className=" flex h-28 w-full flex-row items-center justify-center rounded-md p-2 text-lg font-bold text-slate-500">
              Favorite some buses from below to see them here!
            </div>
          )}
        </SignedIn>
        <SignedOut>
          <div className=" flex h-28 w-full flex-row items-center justify-center rounded-md bg-slate-300 p-2 text-lg font-bold text-slate-600">
            <SignInButton>
              <u className=" text-blue-600 underline">Sign in</u>
            </SignInButton>{" "}
            to see your favorite buses
          </div>
        </SignedOut>
      </div>
      <div className=" flex flex-row justify-between rounded-xl bg-white p-3 py-2">
        <h1 className=" m-0 text-2xl font-bold">Buses</h1>
      </div>
      <div
        className=" relative flex max-w-screen-lg flex-row flex-wrap gap-3 md:min-w-80"
        style={
          {
            "--md-max-width": "calc(50% - 5px)",
            "--lg-min-width": "calc(50% - 12px)",
            "--sm-min-width": "calc(100vw - 48px)",
          } as React.CSSProperties
        }
      >
        {nonFavBuses.map((bus, i) => (
          <div
            className=" min-w-[--sm-min-width] flex-1 md:w-auto md:min-w-[300px] md:max-w-[--md-max-width] lg:min-w-[--lg-min-width]"
            key={i}
          >
            <Suspense fallback={<BusInfoSkeleton />}>
              <BusInfo bus={bus} />
            </Suspense>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BusListSkeleton() {
  return (
    <div className=" m-3 flex max-w-[--sm-max-w] flex-col gap-3 rounded-3xl bg-slate-200 p-3 md:max-w-screen-lg">
      <div className=" flex flex-row justify-between rounded-xl bg-white p-3 py-2">
        <h1 className=" m-0 text-2xl font-bold">Buses</h1>
      </div>
      <div
        className=" relative flex max-w-screen-lg flex-row flex-wrap gap-3 md:min-w-80"
        style={
          {
            "--md-max-width": "calc(50% - 5px)",
            "--sm-min-width": "calc(100vw - 48px)",
          } as React.CSSProperties
        }
      >
        {[...Array(6).keys()]?.map((i) => (
          <div
            className=" min-w-[--sm-min-width] flex-1 md:w-auto md:min-w-[300px] md:max-w-[--md-max-width]"
            key={i}
          >
            <BusInfoSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
