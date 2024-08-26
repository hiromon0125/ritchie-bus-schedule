import { DateTime } from "luxon";
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

export function getStopStatus(
  routes: BusRoute[],
  now: Date,
  weekendBus: boolean,
) {
  const isTodayWeekend = [0, 6].includes(now.getDay());
  if ((isTodayWeekend && !weekendBus) || (!isTodayWeekend && weekendBus))
    return {
      statusMessage: "Out of service",
      location: undefined,
      isMoving: false,
      index: -2,
      nextUpdate: 5 * 60 * 1000,
    };
  // fix the date to 1970
  const currTime = new Date(now.getTime());
  currTime.setDate(1);
  currTime.setFullYear(1970);
  currTime.setMonth(0);
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
