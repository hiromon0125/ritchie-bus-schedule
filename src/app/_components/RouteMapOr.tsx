"use client";
import Image from "next/image";
import { useLocalStorage } from "usehooks-ts";
import { Switch } from "~/components/ui/switch";

export default function RouteMapOr({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mapType, setMapType] = useLocalStorage("mapType", "image");
  return (
    <>
      <div className="bg-item-background w-[--sm-max-w] overflow-hidden rounded-3xl border-4 border-gray-400 md:max-w-screen-lg">
        <div className=" flex flex-row items-center justify-between border-b-2 border-b-gray-400 px-4 py-3 md:max-w-screen-lg">
          <h2 className=" m-0 text-xl font-bold xs:text-2xl">Map</h2>
          <div className=" flex flex-row items-center gap-2">
            Interactive{" "}
            <Switch
              checked={"interactive" === mapType}
              onClick={() =>
                setMapType((p) =>
                  p === "interactive" ? "image" : "interactive",
                )
              }
            />
          </div>
        </div>
        {mapType === "interactive" ? (
          children
        ) : (
          <Image
            src="/images/bus-route-diagram.png"
            alt="Unofficial diagram of the RIT shuttle system"
            width="1728"
            height="1008"
          />
        )}
      </div>
    </>
  );
}
