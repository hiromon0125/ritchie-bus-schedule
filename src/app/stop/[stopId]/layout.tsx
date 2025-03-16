import { TRPCClientError } from "@trpc/client";
import Link from "next/link";
import { api } from "../../../trpc/server";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ stopId?: string }>;
}) {
  const { stopId } = await props.params;

  const currentStop = await api.stops.getOneByID({ id: Number(stopId) });
  if (!currentStop) {
    throw TRPCClientError.from(Error(`Stop not found (stop id: ${stopId})`));
  }
  return (
    <main className=" m-auto flex w-full max-w-screen-lg flex-col gap-2 px-[--margin] py-2 xs:gap-4">
      {props.children}
      <div className=" flex max-w-[480px] flex-row items-center justify-between rounded-[20px] border-[8px] border-[#E2E8F0] p-3 xs:rounded-3xl md:border-[12px]">
        <h2 className=" text-lg font-bold xs:text-xl sm:mb-2 sm:text-3xl">
          Rate this bus
        </h2>
        <Link
          href="https://forms.gle/7ooRfsDzmKvHnnZ76"
          className=" rounded-md bg-blue-600 p-3 text-white"
        >
          Rate!
        </Link>
      </div>
    </main>
  );
}
