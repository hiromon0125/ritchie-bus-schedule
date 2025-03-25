import { TRPCClientError } from "@trpc/client";
import Link from "next/link";
import { api } from "../../../trpc/server";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ stopId?: string }>;
  searchParams: Promise<{ busId?: string }>;
}) {
  const [{ stopId }, { busId }] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const currentStop = await api.stops.getOneByID({ id: Number(stopId) });
  const selectedBusId = busId ? Number(busId) : undefined;
  if (!currentStop) {
    throw TRPCClientError.from(Error(`Stop not found (stop id: ${stopId})`));
  } else if (isNaN(selectedBusId ?? -1)) {
    throw TRPCClientError.from(Error(`Invalid ID (bus id: ${busId})`));
  }
  const selectedBus = await api.bus.getByID({
    id: selectedBusId ?? -1,
  });
  return (
    <main className="text-foreground xs:[--margin:24px] flex min-h-screen w-full flex-col items-center gap-3 py-2 [--margin:8px] [--sm-max-w:calc(100%-var(--margin))]">
      {props.children}
      <div className="bg-border-background xs:gap-3 xs:rounded-3xl xs:p-3 relative flex w-(--sm-max-w) flex-1 flex-row flex-wrap gap-2 rounded-[20px] p-2 md:min-h-0 md:max-w-(--breakpoint-lg)">
        <div className="bg-item-background flex w-full flex-row justify-between rounded-xl p-3">
          <h2 className="xs:text-xl text-lg font-bold sm:mb-2 sm:text-3xl">
            Rate this bus
          </h2>
          <Link
            href={
              `https://ritbus.info/report?redirect=rit-bus.app&stop=${currentStop.name.replace(" ", "%20")}` +
              (selectedBus != null
                ? `&bus=${selectedBus.id}%20-%20${selectedBus.name.replace(" ", "%20")}`
                : "")
            }
            className="rounded-md bg-blue-600 p-3 text-white"
          >
            Rate!
          </Link>
        </div>
      </div>
    </main>
  );
}
