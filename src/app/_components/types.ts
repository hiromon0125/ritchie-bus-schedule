import type { Stops } from "@prisma/client";
import type { RouterOutputs } from "t/shared";

export type BusRoute = RouterOutputs["routes"]["getAllByBusId"][0];
export type BusStop = Stops;

/**
 * The status of a bus at a given time.
 * @typedef {"starting" | "moving" | "stopped" | "out-of-service"} BusMovingStatus
 * - "starting": The bus is starting its route on this route.
 * - "moving": The bus is moving to this route.
 * - "stopped": The bus is stopped at this route.
 * - "out-of-service": The bus is out of service. (eod)
 * - "departed": The bus has departed from this route. This is not a valid status and should be treated as an error or trigger a refetching of the data.
 */
export type BusMovingStatus =
  | "starting"
  | "moving"
  | "stopped"
  | "out-of-service"
  | "departed"
  | "loading";

export type Status = {
  statusMessage: string;
  location: BusRoute | undefined;
  isMoving: BusMovingStatus;
  index: number;
  nextUpdate: number;
};

export type PartialKey<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
