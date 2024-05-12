import type { RouterOutputs } from "t/shared";

export type BusRoute = RouterOutputs["routes"]["getAllByBusId"][0];
export type BusStop = RouterOutputs["stops"]["getStopsByBusID"][0];
export type Bus = RouterOutputs["bus"]["getByID"];
