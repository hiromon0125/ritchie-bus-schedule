import { BusList, BusListSkeleton } from "@/busStatus";
import { FavBtn } from "@/favBtn";
import Header from "@/header";
import { DotMap } from "@/Map";
import { BusTag, StopTag } from "@/tags";
import { SignedIn } from "@clerk/nextjs";
import _ from "lodash";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import { api } from "t/server";
import RouteMapOr from "./_components/RouteMapOr";
import WelcomePopup from "./_components/welcome";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <main className=" flex min-h-screen w-full flex-col items-center gap-3 bg-slate-100 pb-8 text-black [--margin:8px] [--sm-max-w:calc(100%-var(--margin))] xs:[--margin:24px]">
      <WelcomePopup />
      <Header />
      <SignedIn>
        <FavStopList />
      </SignedIn>
      <Suspense fallback={<BusListSkeleton />}>
        <BusList />
      </Suspense>
      <RouteMapOr>
        <div className="relative h-[60vh] overflow-hidden md:max-w-screen-lg">
          <Suspense fallback={<p>Loading map...</p>}>
            <HomeMap />
          </Suspense>
        </div>
      </RouteMapOr>
    </main>
  );
}

async function FavStopList() {
  const favStops = await api.favorite.getAllStop();
  if (favStops.length === 0) return null;
  return (
    <div className=" flex w-[--sm-max-w] flex-col gap-2 rounded-[20px] bg-slate-200 p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:max-w-screen-lg">
      <div className=" flex flex-row justify-between rounded-xl bg-white p-3 py-2">
        <h1 className=" m-0 text-xl font-bold xs:text-2xl">Favorite Stop</h1>
      </div>
      {favStops.map((stop) => (
        <StopView key={stop.stopId} stopId={stop.stopId} />
      ))}
    </div>
  );
}

async function StopView({ stopId }: { stopId: number }) {
  const stopBus = await api.stops.getOneByID({
    id: stopId,
  });
  if (!stopBus) return null;
  const { buses, ...stop } = stopBus;
  return (
    <div className=" relative">
      <Link href={`/stop/${stop.id}`}>
        <div className="relative box-border flex h-full w-full flex-row items-stretch rounded-xl border-[3px] border-white bg-white p-1 transition-all hover:border-[#1567ea] hover:shadow-md">
          <div className=" h-auto min-w-3 rounded-l-md bg-slate-700" />
          <div className=" flex flex-col gap-2 p-2">
            <div className=" flex flex-row items-center gap-2">
              <StopTag stop={stop} size="sm" />
              <h2 className=" font-bold md:text-xl">{stop.name}</h2>
            </div>
            <div className=" flex flex-row flex-wrap gap-1">
              {_.orderBy(buses, ["id"], "asc").map((bus) => {
                return <BusTag bus={bus} key={bus.id} size="sm" />;
              })}
            </div>
          </div>
        </div>
      </Link>
      <FavBtn
        className=" absolute right-3 top-3"
        isFavorited
        onClick={async () => {
          "use server";
          await api.favorite.delStop({ stopId });
          revalidatePath("/"); // revalidate the home page
        }}
      />
    </div>
  );
}

async function HomeMap() {
  const coors = (await api.stops.getCoorOfAllStop())
    .map((stop) => ({
      lat: stop.latitude,
      lng: stop.longitude,
      tag: stop.tag ?? stop.id,
      name: stop.name,
    }))
    .filter((coor) => coor.lat !== 0 && coor.lng !== 0);
  return <DotMap markers={coors} />;
}
