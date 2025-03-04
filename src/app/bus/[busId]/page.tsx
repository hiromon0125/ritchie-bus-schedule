import { TRPCClientError } from "@trpc/client";
import { type Metadata } from "next";
import { api as apiServer } from "../../../trpc/server";
import BusPage from "./_busPage";

type Props = {
  params: Promise<{ busId: string }>;
  searchParams: Promise<{ stopId?: string | string[] | undefined }>;
  timetable: React.ReactNode;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const busId = parseInt(params.busId);
  if (Number.isNaN(busId)) {
    throw TRPCClientError.from(
      Error(`Bus not found (bus id: ${params.busId})`),
    );
  }
  const bus = await apiServer.bus.getByID({ id: busId });
  if (!bus) {
    throw TRPCClientError.from(Error(`Bus not found (bus id: ${busId})`));
  }
  return {
    title: `Ritche's Bus Schedule | ${bus.id} ${bus.name}`,
    description: bus.description,
  };
}

export default BusPage;
