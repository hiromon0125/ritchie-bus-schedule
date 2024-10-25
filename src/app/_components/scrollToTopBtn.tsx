"use client";
import { useWindowScroll } from "@uidotdev/usehooks";
import { IoIosArrowUp } from "react-icons/io";

export default function ScrollToTopButton({
  color,
}: {
  color?: string | null;
}) {
  const [{ y }, scrollTo] = useWindowScroll();
  const bgColor = color ?? "white";
  return (
    ((y ?? 0) > 1000 && (
      <button
        className=" fixed bottom-24 right-4 flex items-center justify-center rounded-full border-[3px] border-black md:bottom-4"
        onClick={() => scrollTo({ left: 0, top: 0, behavior: "smooth" })}
        style={{ backgroundColor: bgColor }}
      >
        <div className=" translate-y-[-2px]">
          <IoIosArrowUp size={48} />
        </div>
      </button>
    )) ||
    null
  );
}
