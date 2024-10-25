import { BusTag, StopTag } from "@/tags";
import _ from "lodash";
import Link from "next/link";
import { IoChevronForwardSharp } from "react-icons/io5";
import { api } from "../../trpc/server";

export default async function StopList() {
  const stops = await api.stops.getAll.query({ includeRelatedBus: true });

  return stops.map((stop) => (
    <Link
      href={`/stop/${stop.id}`}
      key={stop.id}
      className=" flex w-full flex-row items-center gap-3 border-t-2 p-3 transition-all hover:bg-slate-200"
    >
      <div className=" flex flex-1 flex-col gap-2">
        <div className=" flex w-full flex-row items-center gap-2">
          <StopTag stop={stop} />
          <span className=" w-full overflow-clip text-ellipsis text-nowrap text-lg font-bold">
            {" "}
            {stop.name}
          </span>
        </div>
        <div className=" flex flex-row flex-wrap gap-1">
          {stop.buses.length > 0 &&
            _.orderBy(stop.buses, ["id"], "asc").map((bus) => {
              return <BusTag bus={bus} key={bus.id} size="sm" />;
            })}
        </div>
        <p className=" text-left text-lg">{stop.description}</p>
      </div>
      <IoChevronForwardSharp size={24} />
    </Link>
  ));
}
