import { SpecificFavBtn } from "@/favBtn";
import { BusTag } from "@/tags";
import { type Metadata } from "next";
import Link from "next/link";
import { IoChevronForwardSharp } from "react-icons/io5";
import { api } from "t/server";

export const dynamic = "auto";

export const metadata: Metadata = {
  title: "Bus Routes | RIT Bus Schedule",
  description: "Discover all available bus routes and navigate to detailed pages for each route. Stay informed about bus schedules, stops, and more."
}

export default async function BusPageList() {
  const buses = await api.bus.getAll();
  return (
    <>
      {buses.map((bus) => {
        return (
          <Link
            href={`/bus/${bus.id}`}
            key={bus.id}
            className="bg-item-background hover:border-accent border-item-background flex w-full flex-row items-center justify-between gap-4 rounded-xl border-[3px] p-1 transition-all"
            style={{ "--bus-color": bus.color } as React.CSSProperties}
          >
            <div className="h-full w-3 rounded-l-md bg-(--bus-color)" />
            <div className="flex flex-1 flex-col gap-3 pt-4 pb-2">
              <div className="flex flex-row items-center gap-2">
                <BusTag bus={bus} />
                <span className="font-bold md:text-lg">{bus.name}</span>
                <div className="flex flex-row items-center justify-center overflow-hidden transition-all">
                  <SpecificFavBtn busId={bus.id} />
                </div>
              </div>
              <p className="text-left text-sm md:text-lg">{bus.description}</p>
            </div>
            <IoChevronForwardSharp size={24} />
          </Link>
        );
      })}
    </>
  );
}
