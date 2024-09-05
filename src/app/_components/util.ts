import { DateTime } from "luxon";
import { type BusMovingStatus } from "./hooks";
import { type BusRoute } from "./types";

export function getRelative(now: Date, time: Date) {
  return DateTime.fromJSDate(time).toRelative({
    base: DateTime.fromJSDate(now),
  });
}

const DEFAULT_OFFSET = 2 * 60 * 1000;
/**
 * returns a date that is 2 minutes before the given date
 * @param date date to offset
 * @returns date that is 2 minutes before the given date
 */
export function offSetByMinutes(date: Date, offset?: number): Date {
  return new Date(date.getTime() - (offset ?? DEFAULT_OFFSET));
}

export function getArriTime(current: BusRoute, prev?: BusRoute) {
  if (current.arriTime) {
    return current.arriTime;
  } else if (!prev) {
    return offSetByMinutes(current.deptTime);
  }
  const prevDeptTime = prev.deptTime;
  const currentDeptTime = current.deptTime;
  const diff = currentDeptTime.getTime() - prevDeptTime.getTime();

  if (diff < DEFAULT_OFFSET) {
    return currentDeptTime;
  }
  return offSetByMinutes(currentDeptTime);
}

/**
 * updates every 5 minutes, unless it's seconds or minutes away, then it updates every second or minute
 */
export function getTimeToUpdateNext(status: string | undefined) {
  if (!status) return 5 * 60 * 1000;
  if (status.includes("second")) {
    return 1000;
  } else if (status.includes("minute")) {
    return 60 * 1000;
  }
  return 5 * 60 * 1000;
}

function getIndexOfCurrentLocation(routes: BusRoute[], now: Date): number {
  if (routes.length === 0) {
    console.log("No routes found");
    return -2;
  }
  const stops = routes.map((route, i) => [
    getArriTime(route, routes[i - 1]),
    route.deptTime,
  ]);
  const listOfTimes = stops.flat();
  const index = listOfTimes.findIndex((time) => time > now);
  if (index === -1) {
    return -2;
  }
  return (index + 1) / 2 - 1;
}

export function getCurrentTime(): { date: Date; isWeekend: boolean } {
  const now = new Date();
  const isTodayWeekend = [0, 6].includes(now.getDay());
  // set date to 0 so that we can compare times
  now.setDate(1);
  now.setFullYear(1970);
  now.setMonth(0);
  return { date: now, isWeekend: isTodayWeekend };
}

type Status = {
  statusMessage: string;
  location: BusRoute | undefined;
  isMoving: BusMovingStatus;
  index: number;
  nextUpdate: number;
};

export function getStopStatus(
  routes: BusRoute[],
  now: Date,
  weekendBus: boolean,
) {
  const { date: currTime, isWeekend: isTodayWeekend } = getCurrentTime();
  if ((isTodayWeekend && !weekendBus) || (!isTodayWeekend && weekendBus))
    return {
      statusMessage: "Out of service",
      location: undefined,
      isMoving: false,
      index: -2,
      nextUpdate: 5 * 60 * 1000,
    };
  const index = getIndexOfCurrentLocation(routes, currTime);

  if (index === -2) {
    return {
      statusMessage: "Out of service",
      location: undefined,
      isMoving: false,
      index,
      nextUpdate: 5 * 60 * 1000,
    };
  } else if (index !== Math.floor(index)) {
    const nextLocation = routes[index === -0.5 ? 0 : Math.floor(index + 1)]!;
    const nextNextLocation = routes[index === -0.5 ? 1 : Math.floor(index + 2)];
    const arriTime = getArriTime(nextLocation, nextNextLocation);
    if (arriTime.getTime() - currTime.getTime() >= 60 * 60 * 1000) {
      return {
        statusMessage: "Out of service",
        location: undefined,
        isMoving: false,
        index: -2,
        nextUpdate: 5 * 60 * 1000,
      };
    }
    const offsetTime = getRelative(currTime, arriTime);
    const arriDT = DateTime.fromJSDate(arriTime);
    return {
      statusMessage: `Arriving ${offsetTime} • ${arriDT.toFormat("h:mm a")}`,
      location: nextLocation,
      isMoving: true,
      index,
      nextUpdate: getTimeToUpdateNext(offsetTime ?? "minutes"),
    };
  }
  const currentLocation = routes[Math.floor(index)]!;
  const deptTime = currentLocation.deptTime;
  const deptDT = DateTime.fromJSDate(deptTime);
  const offsetTime = getRelative(currTime, deptTime);
  const departingMessage = `Departing ${offsetTime} • ${deptDT.toFormat("h:mm a")}`;
  return {
    statusMessage: departingMessage,
    location: currentLocation,
    isMoving: false,
    index,
    nextUpdate: getTimeToUpdateNext(offsetTime ?? "minutes"), // default to update every minute
  };
}

/**
 * Determines the status of the bus based on the route and the current time.
 * This function should always run on the client side to get the current time.
 *
 * This is the following statuses:
 * - "Out of service": The bus's next stop null or the bus is not running today.
 * - "Starting": The bus is starting its route on this route. When the index is 1 and the arrival time is more than 10 minutes away.
 * - "Moving": The bus is arriving to the next stop. When the arrival time is less than 10 minutes away.
 * - "Stopped": The bus is stopped at this stop. When the arrival time is past the current time and departure time has not past the current time.
 * - undefined: The bus departed or something went wrong.
 *
 * Indexes are offset by 0.5 to show the bus is moving. For example, if the bus is moving to the first stop, the index will be 0.5.
 * If the bus is stopped at the first stop, the index will be 1.
 *
 * The default arrival time is 2 minutes before the departure time.
 *
 *
 * @param route BusRoute | null
 * @param isWeekend boolean
 * @returns Status
 */
export function getStopStatusPerf(
  route: BusRoute | null | undefined,
  isWeekend: boolean,
  currentTime: ReturnType<typeof getCurrentTime>,
): Status | undefined {
  const { date: now, isWeekend: isTodayWeekend } = currentTime;

  // out of service
  if (isWeekend != isTodayWeekend || route == null || route == undefined) {
    return {
      statusMessage: "Out of service",
      location: undefined,
      isMoving: "out-of-service",
      index: -2,
      nextUpdate: 5 * 60 * 1000,
    };
  }

  // starting
  const arriTime = getArriTime(route);
  const arriDT = DateTime.fromJSDate(arriTime);
  const deptDT = DateTime.fromJSDate(route.deptTime);
  if (
    route.index === 1 &&
    arriTime.getTime() - now.getTime() >= 10 * 60 * 1000
  ) {
    return {
      statusMessage: `Out of service • Starting in ${deptDT.toFormat("h:mm a")}`,
      location: route,
      isMoving: "starting",
      index: route.index - 0.5,
      nextUpdate: 5 * 60 * 1000,
    };
  }

  // moving
  let diff: number;
  if (
    (diff = arriTime.getTime() - now.getTime()) < 10 * 60 * 1000 &&
    diff > 0
  ) {
    const offsetTime = getRelative(now, arriTime);
    return {
      statusMessage: `Arriving ${offsetTime} • ${arriDT.toFormat("h:mm a")}`,
      location: route,
      isMoving: "moving",
      index: route.index - 0.5,
      nextUpdate: getTimeToUpdateNext(offsetTime ?? "minutes"),
    };
  }

  // stopped
  if (diff <= 0 && route.deptTime.getTime() > now.getTime()) {
    const offsetTime = getRelative(now, route.deptTime);
    return {
      statusMessage: `Departing ${offsetTime} • ${deptDT.toFormat("h:mm a")}`,
      location: route,
      isMoving: "stopped",
      index: route.index,
      nextUpdate: getTimeToUpdateNext(offsetTime ?? "minutes"),
    };
  }
}
