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
      <div className="bg-item-background border-item-border w-(--sm-max-w) overflow-hidden rounded-3xl border-4 md:max-w-(--breakpoint-lg)">
        <div className="border-b-item-border flex flex-row items-center justify-between border-b-2 px-4 py-3 md:max-w-(--breakpoint-lg)">
          <h2 className="xs:text-2xl m-0 text-xl font-bold">Map</h2>
          <div className="flex flex-row items-center gap-2">
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
          <>
            <Image
              src="/map/ritbusmap_light.png"
              className="dark:hidden"
              alt="Unofficial diagram of the RIT shuttle system"
              width="1728"
              height="1008"
            />
            <Image
              src="/map/ritbusmap_dark.png"
              className="hidden dark:block"
              alt="Unofficial diagram of the RIT shuttle system"
              width="1728"
              height="1008"
            />
          </>
        )}
      </div>
    </>
  );
}
