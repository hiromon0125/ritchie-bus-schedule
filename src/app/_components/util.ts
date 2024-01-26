import { DateTime } from "luxon";
import { type BusRoute } from "./types";

function getNextSaturday(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() + (day === 0 ? 6 : 6 - day); // adjust when day is sunday
  return new Date(now.setDate(diff));
}
function getNextMonday(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() + (day === 0 ? 1 : 8 - day); // adjust when day is sunday
  return new Date(now.setDate(diff));
}
function editDate(
  date: Date,
  { year, month, day }: { year?: number; month?: number; day?: number },
): Date {
  const newDate = new Date(date);
  if (year) {
    newDate.setFullYear(year);
  }
  if (month) {
    newDate.setMonth(month);
  }
  if (day) {
    newDate.setDate(day);
  }
  return newDate;
}
export function isWeekend(date: Date): boolean {
  return [0, 6].includes(date.getDay());
}
/**
 * - Returns a date that today's date with the time of the given date.
 * - If given date is not a weekend and today is a weekend, the date will be the next Monday.
 * - If given date is a weekend and today is not a weekend, the date will be the next Saturday.
 * @param date date to fix
 * @returns date that follows the rules above
 */
export function fixDate(date: Date): Date {
  const now = new Date();
  const isDateWeekend = isWeekend(date);
  const isNowWeekend = isWeekend(now);
  const dateToCorrectTo =
    isDateWeekend && !isNowWeekend
      ? getNextSaturday()
      : isNowWeekend && !isDateWeekend
        ? getNextMonday()
        : now;
  return editDate(date, {
    year: dateToCorrectTo.getFullYear(),
    month: dateToCorrectTo.getMonth(),
    day: dateToCorrectTo.getDate(),
  });
}

export function getNowInUTC() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000);
}
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
    return fixDate(current.arriTime);
  } else if (!prev) {
    return offSetByMinutes(fixDate(current.deptTime));
  }
  const prevDeptTime = prev.deptTime;
  const currentDeptTime = current.deptTime;
  const diff = currentDeptTime.getTime() - prevDeptTime.getTime();

  if (diff < DEFAULT_OFFSET) {
    return fixDate(currentDeptTime);
  }
  return offSetByMinutes(fixDate(currentDeptTime));
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

function getIndexOfCurrentLocation(routes: BusRoute[], nowUTC: Date): number {
  if (routes.length === 0) {
    return -2;
  }
  // check if it's both a weekday or both a weekend
  const isWknd = isWeekend(new Date()); // use local time to determine if it's a weekend as dates are not correct for UTC
  if (isWeekend(routes[0]!.deptTime) != isWknd) {
    return -2;
  }
  const stops = routes.map((route, i) => {
    return [getArriTime(route, routes[i - 1]), fixDate(route.deptTime)];
  });
  const listOfTimes = stops.flat();
  const index = listOfTimes.findIndex((time) => time > nowUTC);
  if (index === -1) {
    return -2;
  }
  return (index + 1) / 2 - 1;
}

export function getStopStatus(routes: BusRoute[], now: Date) {
  const index = getIndexOfCurrentLocation(routes, now);
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
    if (arriTime.getTime() - now.getTime() >= 60 * 60 * 1000) {
      return {
        statusMessage: "Out of service",
        location: undefined,
        isMoving: false,
        index: -2,
        nextUpdate: 5 * 60 * 1000,
      };
    }
    const arrivalMessage = `Arriving ${getRelative(now, arriTime)}`;
    return {
      statusMessage: `${arrivalMessage} • ${DateTime.fromJSDate(arriTime)
        .toUTC()
        .toFormat("h:mm a")}`,
      location: nextLocation,
      isMoving: true,
      index,
      nextUpdate: getTimeToUpdateNext(arrivalMessage),
    };
  }
  const currentLocation = routes[Math.floor(index)]!;
  const deptTime = fixDate(currentLocation.deptTime);
  const departingMessage = `Departing ${getRelative(
    now,
    deptTime,
  )} • ${DateTime.fromJSDate(deptTime).toUTC().toFormat("h:mm a")}`;
  return {
    statusMessage: departingMessage,
    location: currentLocation,
    isMoving: false,
    index,
    nextUpdate: getTimeToUpdateNext(departingMessage),
  };
}
