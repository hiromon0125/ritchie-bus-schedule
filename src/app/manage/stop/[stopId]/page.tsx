import EditStopDetail from "@/editors/editStopDetail";
import Link from "next/link";
import { api } from "t/server";
import { z } from "zod";

export default async function Page(props: { params: Promise<{ stopId: string }> }) {
  const params = await props.params;
  const stopIdNumber = z.coerce.number().parse(params.stopId);
  const stop = await api.stops.getOneByID.query({ id: stopIdNumber });
  if (stop == null) {
    return (
      <div className=" w-full max-w-screen-lg">
        <h1>Stop not found</h1>
        <p>Stop ID: {params.stopId}</p>
        <Link href="/manage/stop">
          <a>Back to stop list</a>
        </Link>
      </div>
    );
  }
  return (
    <div className="w-full max-w-screen-lg">
      <EditStopDetail stop={stop} />
    </div>
  );
}
