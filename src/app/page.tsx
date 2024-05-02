import { Suspense } from "react";
import BusList, { BusListSkeleton } from "./_components/busStatus";
import Header from "./_components/header";

export default async function Home() {
  return (
    <main className=" flex min-h-screen w-full flex-col items-center bg-slate-100 pb-8 text-black">
      <Header />
      <Suspense fallback={<BusListSkeleton />}>
        <BusList />
      </Suspense>
      <div className=" relative mt-3 h-screen w-full max-w-screen-lg overflow-hidden rounded-lg">
        <iframe
          className=" h-full w-full"
          src="https://experience.arcgis.com/experience/2ee741ae4a8d4e23be34fa5a5b9173f3/"
        />
      </div>
    </main>
  );
}
