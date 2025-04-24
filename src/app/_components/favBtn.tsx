"use client";
import { useUser } from "@clerk/nextjs";
import { useHover } from "@uidotdev/usehooks";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { api } from "t/react";
import { cn } from "../../lib/utils";

export function FavBtn({
  isFavorited,
  size = 24,
  ...props
}: {
  isFavorited: boolean;
  size?: number;
  onClick?: () => Promise<void> | void;
} & Omit<React.ComponentProps<"button">, "onClick">) {
  const { user } = useUser();
  const [ref, hovering] = useHover();
  return (
    <button
      className={cn(props.className, "group transition-all")}
      {...props}
      onClick={async (e) => {
        e.preventDefault();
        if (props.onClick && !user) {
          alert("Please log in to favorite");
          return;
        }
        await props.onClick?.();
      }}
      title={isFavorited ? "Unfavorite" : "Favorite"}
      ref={ref}
    >
      {isFavorited || (props.onClick && hovering) ? (
        <MdFavorite
          size={size}
          color="#FF78AE"
          className="transition-all hover:drop-shadow-md"
        />
      ) : (
        <MdFavoriteBorder size={size} color="gray" />
      )}
    </button>
  );
}

export function SpecificFavBtn({
  busId,
  stopId,
}:
  | {
      busId: number;
      stopId?: never;
    }
  | {
      busId?: never;
      stopId: number;
    }) {
  const { data: isBusFavorited } = api.favorite.isBusFavorited.useQuery(
    busId ?? -1,
    {
      enabled: busId != undefined,
    },
  );
  const { data: isStopFavorited } = api.favorite.isStopFavorited.useQuery(
    stopId ?? -1,
    {
      enabled: stopId != undefined,
    },
  );
  const isFavorited = busId != null ? isBusFavorited : isStopFavorited;
  return <FavBtn isFavorited={isFavorited ?? false} size={24} />;
}
