"use client";
import { useUser } from "@clerk/nextjs";
import { useHover } from "@uidotdev/usehooks";
import { AiOutlineLoading } from "react-icons/ai";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { api } from "t/react";
import { cn } from "../../lib/utils";

export function FavBtn({
  isFavorited,
  isPending,
  size = 24,
  togglable = false,
  onClick,
  className,
  ...props
}: {
  isFavorited: boolean;
  isPending?: boolean;
  size?: number;
  onClick?: () => Promise<void> | void;
  togglable?: boolean;
} & Omit<React.ComponentProps<"button">, "onClick">) {
  const { user } = useUser();
  const [ref, hovering] = useHover();
  return (
    <button
      className={cn("group/fav transition-all", className)}
      {...props}
      onClick={
        onClick
          ? async (e) => {
              e.preventDefault();
              if (!user) {
                alert("Please log in to favorite");
                return;
              }
              await onClick();
            }
          : undefined
      }
      title={isFavorited ? "Unfavorite" : "Favorite"}
      ref={ref}
    >
      {isPending ? (
        <div className="animate-spin">
          <AiOutlineLoading size={size} color="gray" />
        </div>
      ) : isFavorited || ((onClick || togglable) && hovering) ? (
        <MdFavorite
          size={size}
          color="#FF78AE"
          className="transition-all group-hover/fav:scale-120"
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
  className,
  size = 24,
  togglable = false,
}: (
  | {
      busId: number;
      stopId?: never;
    }
  | {
      busId?: never;
      stopId: number;
    }
) & {
  className?: string;
  togglable?: boolean;
  size?: number;
}) {
  const utils = api.useUtils();
  const { data: isBusFavorited, isPending: isBusPending } =
    api.favorite.isBusFavorited.useQuery(busId ?? null);
  const { data: isStopFavorited, isPending: isStopPending } =
    api.favorite.isStopFavorited.useQuery(stopId ?? null);
  const { mutateAsync: mutateBusAsync, isPending: isBusActionPending } =
    api.favorite.toggleBus.useMutation();
  const { mutateAsync: mutateStopAsync, isPending: isStopActionPending } =
    api.favorite.toggleStop.useMutation();
  const toggleFavorite = async () => {
    if (busId != null) {
      await mutateBusAsync({ busId });
      await utils.favorite.isBusFavorited.invalidate(busId);
    } else if (stopId != null) {
      await mutateStopAsync({ stopId });
      await utils.favorite.isStopFavorited.invalidate(stopId);
    }
  };
  const isFavorited = busId != null ? isBusFavorited : isStopFavorited;
  const isPending =
    isBusPending || isStopPending || isBusActionPending || isStopActionPending;
  return (
    <FavBtn
      className={className}
      isFavorited={isFavorited ?? false}
      isPending={isPending}
      size={size}
      onClick={togglable ? toggleFavorite : undefined}
    />
  );
}
