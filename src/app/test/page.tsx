import { api } from "../../trpc/server";
import { ClientRenderedComp } from "./clientRenderedComp";

const busId = 3;

export default async function Page() {
  const res = await api.routes.getCurrentRouteOfBus({ busId });

  return <ClientRenderedComp busId={busId} serverGuess={res} />;
}
