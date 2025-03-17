"use client";

import type { Stops } from "@prisma/client";
import dynamic from "next/dynamic";

export const DotMap = dynamic(() => import("./DotMap"), { ssr: false });

export default function StopMap({ stops }: { stops: Stops[] | Stops }) {
  const stopCoors = (
    Array.isArray(stops)
      ? stops.map((stop) => ({
          tag: stop.tag ?? stop.id,
          name: stop.name,
          lat: stop.latitude,
          lng: stop.longitude,
        }))
      : [
          {
            lat: stops.latitude,
            lng: stops.longitude,
            tag: stops.tag ?? stops.id,
            name: stops.name,
          },
        ]
  ).filter((coor) => coor.lat !== 0 && coor.lng !== 0);
  if (stopCoors.length === 0) {
    return (
      <div className=" bg-border-background flex flex-col items-center justify-center overflow-hidden rounded-xl">
        <p className=" text-gray-700">Unknown Location</p>
      </div>
    );
  }
  return <DotMap markers={stopCoors} />;
}
