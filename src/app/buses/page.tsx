import { BusTag } from "@/tags";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { IoChevronForwardSharp } from "react-icons/io5";
import { api } from "../../trpc/server";
import { FavBtn } from "../_components/favBtn";

async function favoriteBus(busId: number) {
  "use server";
  await api.favorite.addBus.mutate({ busId });
  revalidatePath("/buses");
}

async function unfavoriteBus(busId: number) {
  "use server";
  await api.favorite.delBus.mutate({ busId });
  revalidatePath("/buses");
}

export default async function BusPageList() {
  const buses = await api.bus.getAll.query();
  const favBus = (await api.favorite.getAllBus.query()).map((bus) => bus.busId);
  return (
    <>
      {buses.map((bus) => {
        const isFav = favBus.includes(bus.id);
        return (
          <Link
            href={`/bus/${bus.id}`}
            key={bus.id}
            className=" group flex w-full flex-row items-center gap-3 border-t-2  p-3 transition-all hover:bg-slate-200"
            style={{ "--bus-color": bus.color } as React.CSSProperties}
          >
            <div className=" flex flex-1 flex-col gap-2">
              <div className=" flex flex-row items-center gap-2">
                <div className=" flex w-0 flex-row items-center justify-center overflow-hidden opacity-0 transition-all group-hover:w-8 group-hover:opacity-100">
                  <FavBtn
                    isFavorited={isFav}
                    onClick={async () => {
                      "use server";
                      await (isFav ? unfavoriteBus : favoriteBus)(bus.id);
                    }}
                  />
                </div>
                <BusTag bus={bus} />
                <span className=" font-bold md:text-lg"> {bus.name}</span>
              </div>
              <p className=" text-left text-sm md:text-lg ">
                {bus.description}
              </p>
            </div>
            <IoChevronForwardSharp size={24} />
          </Link>
        );
      })}
    </>
  );
}
