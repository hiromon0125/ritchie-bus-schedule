"use client";
import { useUser } from "@clerk/nextjs";
import { useHover } from "@uidotdev/usehooks";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
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
      className={cn(props.className, " group transition-all")}
      {...props}
      onClick={async (e) => {
        e.preventDefault();
        if (!user) {
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
          className=" transition-all hover:drop-shadow-md"
        />
      ) : (
        <MdFavoriteBorder size={size} color="gray" />
      )}
    </button>
  );
}
