import { BusList, BusListSkeleton } from "@/busStatus";
import Header from "@/header";
import { Suspense } from "react";
export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <main
      className=" flex min-h-screen w-full flex-col items-center bg-slate-100 pb-8 text-black"
      style={{ "--sm-max-w": "calc(100% - 24px)" } as React.CSSProperties}
    >
      <Header title="Home" route="home" />
      <Suspense fallback={<BusListSkeleton />}>
        <BusList />
      </Suspense>
      <div className=" relative mx-3 h-[60vh] w-full max-w-[--sm-max-w] overflow-hidden rounded-3xl border-4 border-gray-400 md:max-w-screen-lg">
        <iframe
          title="ArcGIS Experience"
          className=" h-full w-full"
          src="https://experience.arcgis.com/experience/2ee741ae4a8d4e23be34fa5a5b9173f3/"
        />
      </div>
    </main>
  );
}
