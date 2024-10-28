"use client";
import { Map, Marker } from "pigeon-maps";

import type { Stops } from "@prisma/client";
import _ from "lodash";

export default function StopMap({ stops }: { stops: Stops[] | Stops }) {
  const stopCoors = Array.isArray(stops)
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
      ];
  const center = {
    lat:
      ((_.minBy(stopCoors, "lat")?.lat ?? stopCoors[0]?.lat ?? 0) +
        (_.maxBy(stopCoors, "lat")?.lat ?? stopCoors[0]?.lat ?? 0)) /
      2,
    lng:
      ((_.minBy(stopCoors, "lng")?.lng ?? stopCoors[0]?.lng ?? 0) +
        (_.maxBy(stopCoors, "lng")?.lng ?? stopCoors[0]?.lng ?? 0)) /
      2,
  };
  return (
    <Map
      center={[center.lat, center.lng]}
      zoom={14}
      boxClassname=" rounded-xl overflow-hidden"
    >
      {stopCoors.map((coor, index) => (
        <Marker key={index} anchor={[coor.lat, coor.lng]} offset={[-7, -7]}>
          <div
            className=" aspect-square w-7 rounded-full border-2 border-black bg-white p-[2px]"
            title={coor.name}
          >
            {coor.tag}
          </div>
        </Marker>
      ))}
    </Map>
  );
}
