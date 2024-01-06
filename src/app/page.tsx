import { api } from "../trpc/server";
import BusInfo from "./_components/bus-status";
import Header from "./_components/header";

export default async function Home() {
  const buses = await api.bus.getAll.query();
  return (
    <main className=" flex min-h-screen w-full flex-col items-center bg-slate-100 text-black">
      <Header />
      <div className=" w-11/12 min-w-80">
        {buses?.map((bus) => (
          <div className=" w-full py-3">
            <BusInfo bus={bus} />
          </div>
        ))}
      </div>
    </main>
  );
}
