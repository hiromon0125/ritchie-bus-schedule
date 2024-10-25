import { BusTag } from "@/tags";
import Link from "next/link";
import { IoChevronForwardSharp } from "react-icons/io5";
import { api } from "../../trpc/server";

export default async function BusPageList() {
  const buses = await api.bus.getAll.query();

  return (
    <>
      {buses.map((bus) => (
        <Link
          href={`/bus/${bus.id}`}
          key={bus.id}
          className=" flex w-full flex-row items-center gap-3 border-t-2 p-3  transition-all hover:bg-slate-200"
          style={{ "--bus-color": bus.color } as React.CSSProperties}
        >
          <div className=" flex flex-1 flex-col gap-2">
            <div className=" flex flex-row items-center gap-2">
              <BusTag bus={bus} />
              <span className=" text-lg font-bold"> {bus.name}</span>
            </div>
            <p className=" text-left text-lg">{bus.description}</p>
          </div>
          <IoChevronForwardSharp size={24} />
        </Link>
      ))}
    </>
  );
}
