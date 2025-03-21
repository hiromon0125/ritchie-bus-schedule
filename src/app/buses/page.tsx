import { SpecificFavBtn } from "@/favBtn";
import { BusTag } from "@/tags";
import Link from "next/link";
import { IoChevronForwardSharp } from "react-icons/io5";
import { api } from "../../trpc/server";

export const dynamic = "auto";

export default async function BusPageList() {
  const buses = await api.bus.getAll();
  return (
    <>
      {buses.map((bus) => {
        return (
          <Link
            href={`/bus/${bus.id}`}
            key={bus.id}
            className="bg-item-background hover:border-accent border-item-background flex w-full flex-row items-center justify-between rounded-xl border-[3px] p-3 pl-4 transition-all"
            style={{ "--bus-color": bus.color } as React.CSSProperties}
          >
            <div className="flex flex-1 flex-col gap-2">
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
