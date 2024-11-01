"use client";
import { Map, Marker } from "pigeon-maps";

import type { Stops } from "@prisma/client";
import _ from "lodash";

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
      <div className=" flex flex-col items-center justify-center overflow-hidden rounded-xl bg-slate-200">
        <p className=" text-gray-700">Unknown Location</p>
      </div>
    );
  }
  return <DotMap markers={stopCoors} />;
}

export function DotMap({
  markers,
}: {
  markers: { lat: number; lng: number; tag: string | number; name: string }[];
}) {
  const center = {
    lat:
      ((_.minBy(markers, "lat")?.lat ?? markers[0]?.lat ?? 0) +
        (_.maxBy(markers, "lat")?.lat ?? markers[0]?.lat ?? 0)) /
      2,
    lng:
      ((_.minBy(markers, "lng")?.lng ?? markers[0]?.lng ?? 0) +
        (_.maxBy(markers, "lng")?.lng ?? markers[0]?.lng ?? 0)) /
      2,
  };
  return (
    <Map center={[center.lat, center.lng]}>
      {markers.map((marker, i) => (
        <Marker anchor={[marker.lat, marker.lng]} offset={[-7, -7]} key={i}>
          <div
            className=" flex aspect-square w-7 flex-col items-center justify-center rounded-full border-2 border-[--color] bg-white p-[2px] text-center [--color:var(--bus-color,black)]"
            title={marker.name}
          >
            <p>{marker.tag}</p>
          </div>
        </Marker>
      ))}
    </Map>
  );
}
