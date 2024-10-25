import type { Bus, Stops } from "@prisma/client";
import { cn } from "../../lib/utils";

type TagSize = "sm" | "md" | "lg";
const SIZES: Record<TagSize, string> = {
  sm: "text-sm w-7",
  md: "text-lg w-10",
  lg: "text-xl w-12",
};

export async function StopTag({
  stop,
  size = "md",
}: {
  stop: Stops;
  size?: TagSize;
}) {
  return (
    <div
      className={cn(
        " inline-block aspect-square rounded-full border-[3px] border-[--bus-color] bg-white text-center text-lg font-bold text-black",
        SIZES[size],
      )}
    >
      {stop.tag ?? stop.id}
    </div>
  );
}

export async function BusTag({
  bus,
  size = "md",
}: {
  bus: Bus;
  size?: TagSize;
}) {
  return (
    <div
      className={cn(
        " flex aspect-square flex-row items-center justify-center rounded-md border-[3px] border-[--bus-color] bg-white text-center text-lg font-bold text-black",
        SIZES[size],
      )}
      style={{ "--bus-color": bus.color } as React.CSSProperties}
    >
      {bus.tag ?? bus.id}
    </div>
  );
}
