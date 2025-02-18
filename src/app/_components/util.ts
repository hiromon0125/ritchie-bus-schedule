import { DateTime } from "luxon";
import type { BusRoute, Status } from "./types";

export function getRelative(now: Date, time: Date) {
  return DateTime.fromJSDate(time).toRelative({
    base: DateTime.fromJSDate(now),
  });
}

export const NEWYORK_TIMEZONE = "America/New_York";
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

/**
 * Previously there was a bug that was seen where some server computed date had the incorrect UTC time.
 * These two, while is now identical, differenciates the two functions run in different environments,
 * and if this bug is seen again this should be used to correct them. This can especially be problematic
 * after or before daylight savings time changes.
 */
export function getCurrentTime(): { date: Date; isWeekend: boolean } {
  const now = new Date();
  const isTodayWeekend = [6, 7].includes(
    DateTime.now().setZone(NEWYORK_TIMEZONE).weekday,
  );
  // set date to 0 so that we can compare times
  now.setFullYear(1970, 0, 1);
  return { date: now, isWeekend: isTodayWeekend };
}
export function getCurrentTimeServer(): { date: Date; isWeekend: boolean } {
  const now = new Date();
  const isTodayWeekend = [6, 7].includes(
    DateTime.now().setZone(NEWYORK_TIMEZONE).weekday,
  );
  // set date to 0 so that we can compare times
  now.setFullYear(1970, 0, 1);
  return { date: now, isWeekend: isTodayWeekend };
}

/**
 * Determines the status of the bus based on the route and the current time.
 * This function should always run on the client side to get the current time.
 *
 * This is the following statuses:
 * - "Out of service": The bus's next stop null.
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
export function evalStatusFromRoute(
  route: BusRoute | null | undefined,
  currentTime: ReturnType<typeof getCurrentTime>,
): Status | undefined {
  const { date: now } = currentTime;

  // out of service
  if (!route) {
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
  const arriDT = DateTime.fromJSDate(arriTime).toLocal();
  const deptDT = DateTime.fromJSDate(route.deptTime).toLocal();

  if (
    route.index === 1 &&
    arriTime.getTime() - now.getTime() >= 10 * 60 * 1000
  ) {
    return {
      statusMessage: `Out of service • Starting at ${deptDT.toFormat("h:mm a")}`,
      location: route,
      isMoving: "starting",
      index: route.index - 0.5,
      nextUpdate: 5 * 60 * 1000,
    };
  }

  // moving
  const arrDiff: number = arriTime.getTime() - now.getTime();
  if (arrDiff > 0) {
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
  const deptDiff: number = route.deptTime.getTime() - now.getTime();
  if (arrDiff <= 0 && deptDiff > 0) {
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
