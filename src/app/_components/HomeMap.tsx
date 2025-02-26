"use client";
import { useState } from "react";
import { DotMap } from "@/Map";
import Image from "next/image";
import { Switch } from "~/components/ui/switch";

export default function HomeMapOrRouteMap() {
  const [isMapVisible, setMapVisible] = useState<boolean>(false);
  return (
    <>
      <div>
        <p>Show map</p>
        <Switch
          checked={isMapVisible}
          onClick={() => setMapVisible(!isMapVisible)}
        />
      </div>
      <div className=" relative mx-3 h-[60vh] w-[--sm-max-w] overflow-hidden rounded-3xl border-4 border-gray-400 md:max-w-screen-lg">
        {isMapVisible ? (
          <Suspense fallback={<p>Loading map...</p>}>
            <HomeMap />
          </Suspense>
        ) : (
          <Image
            src="/images/unofficial-diagram-of-the-rit-shuttle-system-v0-crop.webp"
            alt="Unofficial diagram of the RIT shuttle system"
            width="1080"
            height="720"
          ></Image>
        )}
      </div>
    </>
  );
}

async function HomeMap() {
  const coors = (await api.stops.getCoorOfAllStop())
    .map((stop) => ({
      lat: stop.latitude,
      lng: stop.longitude,
      tag: stop.tag ?? stop.id,
      name: stop.name,
    }))
    .filter((coor) => coor.lat !== 0 && coor.lng !== 0);
  return <DotMap markers={coors} />;
}
