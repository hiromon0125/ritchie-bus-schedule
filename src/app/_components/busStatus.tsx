import type { Bus } from "@prisma/client";
import Link from "next/link";
import { Suspense } from "react";
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
    <Link href={`/bus/${busObj.id}`}>
      <div className="relative pl-3">
        <div
          className=" absolute left-0 top-0 h-full w-3 rounded-bl-full rounded-tr-full"
          style={{ backgroundColor: color }}
        />
        <div className=" relative flex w-full flex-row flex-wrap justify-between">
          <div className=" mr-1 flex w-full min-w-56 flex-1 flex-row items-center p-4">
            <h2 className=" w-full overflow-hidden text-ellipsis text-nowrap text-xl font-bold">
              {busObj.id} | {busObj?.name}
            </h2>
          </div>
          <BusStatusString bus={busObj} />
        </div>
      </div>
    </Link>
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
    <div className=" w-11/12 min-w-80 max-w-screen-lg">
      {buses?.map((bus, i) => (
        <div className=" w-full py-3" key={i}>
          <Suspense fallback={<BusInfoSkeleton />}>
            <BusInfo bus={bus} />
          </Suspense>
        </div>
      ))}
    </div>
  );
}

export function BusListSkeleton() {
  return (
    <div className=" w-11/12 min-w-80">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className=" w-full py-3">
          <BusInfoSkeleton />
        </div>
      ))}
    </div>
  );
}

export default BusList;
