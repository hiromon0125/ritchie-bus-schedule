import Header from "@/header";
import { TRPCClientError } from "@trpc/client";
import Link from "next/link";
import { api } from "../../../trpc/server";

export default async function Layout({
  children,
  map,
  timetable,
  params,
}: {
  children: React.ReactNode;
  timetable: React.ReactNode;
  map: React.ReactNode;
  params: Promise<{ busId: string }>;
}) {
  const { busId: rawBusId } = await params;
  const busId = parseInt(rawBusId);
  if (Number.isNaN(busId)) {
    throw TRPCClientError.from(Error(`Bus not found (bus id: ${rawBusId})`));
  }
  const bus = await api.bus.getByID.query({ id: busId });
  if (!bus) {
    throw TRPCClientError.from(Error(`Bus not found (bus id: ${busId})`));
  }
  return (
    <main className=" [--margin:8px] md:[--margin:24px]">
      <Header title="Bus" route="bus" />
      <div
        className=" m-auto flex w-full max-w-screen-lg flex-col gap-2 px-[--margin] py-2 xs:gap-4"
        style={{ "--bus-color": bus.color } as React.CSSProperties}
      >
        {children}
        <div className=" flex flex-col gap-2 xs:gap-4 md:flex-row">
          {timetable}
          {map}
        </div>
        <div className=" max-w-[480px] rounded-[20px] border-[8px] border-[#E2E8F0] p-3 xs:rounded-3xl md:border-[12px]">
          <h2 className=" text-lg font-bold xs:text-xl sm:mb-2 sm:text-3xl">
            Rate Page
          </h2>
          <p>Rate this bus!</p>
          <div className=" flex w-full flex-row justify-end">
            <Link
              href="https://forms.gle/7ooRfsDzmKvHnnZ76"
              className=" rounded-md bg-blue-600 p-3 text-white"
            >
              Yes
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
