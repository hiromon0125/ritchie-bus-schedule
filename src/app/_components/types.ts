import type { Stops } from "@prisma/client";
import type { RouterOutputs } from "t/shared";

export type BusRoute = RouterOutputs["routes"]["getAllByBusId"][0];
export type BusStop = Stops;
