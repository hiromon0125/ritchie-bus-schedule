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
    <main className=" flex min-h-screen w-full flex-col items-center gap-3 py-8 text-black [--margin:8px] [--sm-max-w:calc(100%-var(--margin))] xs:[--margin:24px]">
      {props.children}
      <div className=" bg-border-background relative flex w-[--sm-max-w] flex-1 flex-row flex-wrap gap-2 rounded-[20px] p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:min-h-0 md:max-w-screen-lg">
        <div className=" bg-item-background flex w-full flex-row justify-between rounded-xl p-3">
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
      </div>
    </main>
  );
}
