import type { Bus, Stops } from "@prisma/client";
import { cn } from "../../lib/utils";

type TagSize = "sm" | "md" | "lg";
const SIZES: Record<TagSize, string> = {
  sm: "text-sm min-w-7",
  md: "text-lg min-w-10",
  lg: "text-2xl min-w-12",
};

export function StopTag({
  stop,
  size = "md",
}: {
  stop: Stops;
  size?: TagSize;
}) {
  return (
    <p
      className={cn(
        "bg-item-background text-foreground flex aspect-square flex-row items-center justify-center rounded-full border-[3px] border-(--bus-color) text-center text-lg font-bold",
        SIZES[size],
      )}
    >
      {stop.tag ?? stop.id}
    </p>
  );
}

export function BusTag({ bus, size = "md" }: { bus: Bus; size?: TagSize }) {
  return (
    <p
      className={cn(
        "text-foreground flex aspect-square flex-row items-center justify-center rounded-md border-[3px] border-(--bus-color) bg-transparent text-center text-lg font-bold",
        SIZES[size],
      )}
      title={bus.name}
      style={{ "--bus-color": bus.color } as React.CSSProperties}
    >
      {bus.tag ?? bus.id}
    </p>
  );
}
