import { TRPCClientError } from "@trpc/client";
import { api } from "t/server";

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
    <main className="text-foreground xs:[--margin:24px] flex min-h-screen w-full flex-col items-center gap-3 py-2 [--margin:8px] [--sm-max-w:calc(100%-var(--margin))]">
      {props.children}
    </main>
  );
}
