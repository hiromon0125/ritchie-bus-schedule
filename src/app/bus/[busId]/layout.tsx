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
  const bus = await api.bus.getByID({ id: busId });
  if (!bus) {
    throw TRPCClientError.from(Error(`Bus not found (bus id: ${busId})`));
  }
  return (
    <main
      className="xs:[--margin:24px] text-foreground flex min-h-screen w-full flex-col items-center gap-3 py-2 [--margin:8px] [--sm-max-w:calc(100%-var(--margin))]"
      style={{ "--bus-color": bus.color } as React.CSSProperties}
    >
      {children}
      <div className="xs:gap-4 flex w-(--sm-max-w) flex-col gap-2 md:max-w-(--breakpoint-lg) md:flex-row">
        {timetable}
        {map}
      </div>
      <div className="bg-border-background xs:gap-3 xs:rounded-3xl xs:p-3 relative flex w-(--sm-max-w) flex-1 flex-row flex-wrap gap-2 rounded-[20px] p-2 md:min-h-0 md:max-w-(--breakpoint-lg)">
        <div className="bg-item-background flex w-full flex-row justify-between rounded-xl p-3">
          <h2 className="xs:text-xl text-lg font-bold sm:mb-2 sm:text-3xl">
            Rate My Ride
          </h2>
          <Link
            href={
              "https://ritbus.info/report?route=" + bus.id + " - " + bus.name
            }
            className="bg-accent rounded-md p-3"
          >
            Rate!
          </Link>
        </div>
      </div>
    </main>
  );
}
