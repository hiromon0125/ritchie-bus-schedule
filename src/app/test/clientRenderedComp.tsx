"use client";

import { api, type RouterOutputs } from "../../trpc/react";
import { useBusStatus } from "../_components/hooks";

export function ClientRenderedComp({
  busId,
  serverGuess,
}: {
  busId: number;
  serverGuess: RouterOutputs["routes"]["getCurrentRouteOfBus"];
}) {
  const { data: isOperating } = api.routes.isBusOperating.useQuery({
    busId,
  });
  const statusDate = useBusStatus(busId, serverGuess);
  return (
    <div>
      <h1>Test Page</h1>
      <p>Is Operating: {isOperating ? "true" : "false"}</p>
      <p>Current Route: {JSON.stringify(serverGuess)}</p>
      <p>Current StatusDate: {JSON.stringify(statusDate)}</p>
    </div>
  );
}
