import { SpecificFavBtn } from "@/favBtn";
import { BusTag, StopTag } from "@/tags";
import _ from "lodash";
import { type Metadata } from "next";
import Link from "next/link";
import { IoChevronForwardSharp } from "react-icons/io5";
import { api } from "t/server";
import { APPCONFIG } from "../../appconfig";

export const dynamic = "auto";

export const metadata: Metadata = {
  title: `Bus Stops | ${APPCONFIG.APP_TITLE}`,
  description:
    "Discover all available bus stops and navigate to detailed pages for each stop. Stay informed about bus schedules, stops, and more.",
  alternates: {
    canonical: "/stops",
  },
};

export default async function StopList() {
  const stops = await api.stops.getAll({ includeRelatedBus: true });
  return stops.map((stop) => {
    return (
      <Link
        href={`/stop/${stop.id}`}
        key={stop.id}
        className="bg-item-background hover:border-accent border-item-background flex w-full flex-row items-center justify-between rounded-xl border-[3px] p-3 pl-4 transition-all"
      >
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex w-full flex-row items-center">
            <div className="flex w-0 flex-row items-center justify-center overflow-hidden opacity-0 transition-all group-hover:w-8 group-hover:opacity-100">
              <SpecificFavBtn stopId={stop.id} />
            </div>
            <StopTag stop={stop} />
            <span className="xs:ml-2 ml-1 w-0 flex-1 overflow-clip text-lg font-bold text-nowrap text-ellipsis">
              {" "}
              {stop.name}
            </span>
          </div>
          <div className="flex flex-row flex-wrap gap-1">
            {stop.buses.length > 0 &&
              _.orderBy(stop.buses, ["id"], "asc").map((bus) => {
                return <BusTag bus={bus} key={bus.id} size="sm" />;
              })}
          </div>
          <p className="text-left text-lg">{stop.description}</p>
        </div>
        <IoChevronForwardSharp size={24} />
      </Link>
    );
  });
}
