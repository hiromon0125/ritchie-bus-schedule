"use client";
import { useState } from "react";
import Image from "next/image";
import { Suspense } from "react";
import { Switch } from "~/components/ui/switch";
import { HomeMap } from "~/app/page"

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
