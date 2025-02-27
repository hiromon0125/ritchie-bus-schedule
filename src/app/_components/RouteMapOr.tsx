"use client";
import { useState } from "react";
import Image from "next/image";
import { Switch } from "~/components/ui/switch";

export default function RouteMapOr({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMapVisible, setMapVisible] = useState<boolean>(false);
  return (
    <>
      <div className="m-[5px] ml-[2em]">
        <label>
          Show map{" "}
          <Switch
            id="maptoggle"
            name="maptoggle"
            checked={isMapVisible}
            onClick={() => setMapVisible(!isMapVisible)}
          />
        </label>
      </div>

      {isMapVisible ? (
        children
      ) : (
        <div className="w-[--sm-max-w] rounded-3xl border-4 border-gray-400 md:max-w-screen-lg">
          <Image
            src="/images/unofficial-diagram-of-the-rit-shuttle-system-v0-crop.webp"
            alt="Unofficial diagram of the RIT shuttle system"
            width="1080"
            height="720"
            className="rounded-3xl"
          ></Image>
        </div>
      )}
    </>
  );
}
