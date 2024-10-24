import type { Bus } from "@prisma/client";
import Link from "next/link";
import React, { Suspense } from "react";
import { api } from "t/server";
import { type RouterOutputs } from "t/shared";
import BusStatusString from "./busStatusString";

type BusStatusProps =
  | {
      busID: RouterOutputs["bus"]["getAllID"][0];
      bus?: never;
    }
  | {
      bus: Bus;
      busID?: never;
    };

async function BusInfo({ busID, bus }: BusStatusProps) {
  const busObj = bus ?? (busID ? await api.bus.getByID.query(busID) : null);
  if (!busObj) return null;
  const color = (busObj.color?.toLowerCase() as `#${string}`) ?? "#000000";

  return (
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
          <div className=" mr-1 flex w-full flex-1 flex-row items-center px-4 pt-2">
            <h2 className=" w-full overflow-hidden text-ellipsis text-nowrap font-bold md:text-xl">
              {busObj.id} | {busObj?.name}
            </h2>
          </div>
          <Suspense fallback={<SkeletonBusStatusString />}>
            <Status busObj={busObj} />
          </Suspense>
        </div>
      </div>
    </Link>
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
        <div className=" absolute left-0 top-0 h-3 w-3 rounded-full bg-[gray] animation-delay-100" />
      </div>
      <div className=" flex h-full flex-col justify-center pl-4">
        <p>Loading...</p>
      </div>
    </div>
  );
}

function BusInfoSkeleton() {
  return (
    <div className="relative pl-3">
      <div className=" absolute left-0 top-0 h-full w-3 rounded-bl-full rounded-tr-full bg-gray-400" />
      <div className=" relative flex w-full flex-row flex-wrap justify-between">
        <div className=" relative mr-1 flex w-full min-w-56 flex-1 flex-row items-center p-4">
          <h2 className=" w-full overflow-hidden text-ellipsis text-nowrap text-xl font-bold">
            <div className=" h-8 w-full rounded-full bg-gray-200" />
          </h2>
        </div>
        <div className=" relative flex h-24 w-full min-w-56 flex-1 flex-row items-center p-4">
          <div className=" mr-4 h-full min-w-16 rounded-full bg-gray-200" />
          <div className=" flex h-full flex-1 flex-col gap-4">
            <div className=" h-4 w-full rounded-full bg-gray-200" />
            <div className=" h-4 w-full rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function BusList() {
  const buses = await api.bus.getAll.query();
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
        {buses?.map((bus, i) => (
          <div
            className=" min-w-[--sm-min-width] flex-1 md:w-auto md:min-w-[300px] md:max-w-[--md-max-width]"
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
    <div className=" w-11/12 min-w-80 max-w-screen-lg">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className=" w-full py-3">
          <BusInfoSkeleton />
        </div>
      ))}
    </div>
  );
}

export default BusList;
