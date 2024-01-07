import { Suspense } from "react";
import BusList, { BusListSkeleton } from "./_components/bus-status";
import Header from "./_components/header";

export default async function Home() {
  return (
    <main className=" flex min-h-screen w-full flex-col items-center bg-slate-100 text-black">
      <Header />
      <Suspense fallback={<BusListSkeleton />}>
        <BusList />
      </Suspense>
    </main>
  );
}
