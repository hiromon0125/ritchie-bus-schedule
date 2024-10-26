"use client";
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
  onClick?: () => void;
} & React.ComponentProps<"button">) {
  const [ref, hovering] = useHover();
  return (
    <button
      className={cn(props.className, " transition-all hover:drop-shadow-sm")}
      {...props}
      onClick={() => {
        props.onClick?.();
        console.log("Favorite clicked");
      }}
      title={isFavorited ? "Unfavorite" : "Favorite"}
      ref={ref}
    >
      {isFavorited || hovering ? (
        <MdFavorite size={size} color="#FF78AE" className=" transition-all" />
      ) : (
        <MdFavoriteBorder size={size} color="gray" />
      )}
    </button>
  );
}
