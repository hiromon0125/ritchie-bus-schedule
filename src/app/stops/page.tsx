import { FavBtn } from "@/favBtn";
import { BusTag, StopTag } from "@/tags";
import { currentUser } from "@clerk/nextjs/server";
import _ from "lodash";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { IoChevronForwardSharp } from "react-icons/io5";
import { api } from "t/server";

export const dynamic = "force-dynamic";

async function handleFavorite(stopId: number, isFav: boolean) {
  await api.favorite[isFav ? "delStop" : "addStop"]({ stopId });
  revalidatePath("/stops");
}

export default async function StopList() {
  const user = await currentUser();
  const stops = await api.stops.getAll({ includeRelatedBus: true });
  const favStop = !user
    ? []
    : (await api.favorite.getAllStop()).map((stop) => stop.stopId);
  return stops.map((stop) => {
    const isFav = favStop.includes(stop.id);
    return (
      <Link
        href={`/stop/${stop.id}`}
        key={stop.id}
        className=" hover:bg-border-background group flex w-full flex-row items-center gap-2 border-t-2 p-1 transition-all xs:gap-3 xs:p-3"
      >
        <div className=" flex flex-1 flex-col gap-2">
          <div className=" flex w-full flex-row items-center">
            <div className=" flex w-0 flex-row items-center justify-center overflow-hidden opacity-0 transition-all group-hover:w-8 group-hover:opacity-100">
              <FavBtn
                isFavorited={isFav}
                onClick={async () => {
                  "use server";
                  await handleFavorite(stop.id, isFav);
                }}
              />
            </div>
            <StopTag stop={stop} />
            <span className=" ml-1 w-0 flex-1 overflow-clip text-ellipsis text-nowrap text-lg font-bold xs:ml-2">
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
    );
  });
}
