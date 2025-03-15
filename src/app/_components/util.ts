import { type Bus } from "@prisma/client";
import _ from "lodash";
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
export function getCurrentTime(): {
  date: Date;
  isWeekend: boolean;
  dt: DateTime;
} {
  const isTodayWeekend = [6, 7].includes(
    DateTime.utc().setZone(NEWYORK_TIMEZONE).weekday,
  );
  // set date to 0 so that we can compare times
  const now = DateTime.utc().set({ year: 1970, month: 1, day: 1 });
  return { date: now.toJSDate(), isWeekend: isTodayWeekend, dt: now };
}
export function getCurrentTimeServer(): {
  date: Date;
  nowWeekday: number;
  dt: DateTime;
  dtUTC: DateTime;
} {
  // set date to 0 so that we can compare times
  const now = DateTime.utc()
    .setZone(NEWYORK_TIMEZONE)
    .set({ year: 1970, month: 1, day: 1 });
  const utcDate = DateTime.utc().set({
    year: 1970,
    month: 1,
    day: 1,
  });
  // console.log("getCurrentTimeServer", now.toISO(), utcDate.toISO());
  return {
    date: now.toJSDate(),
    nowWeekday: DateTime.utc().setZone(NEWYORK_TIMEZONE).weekday,
    dt: now,
    dtUTC: utcDate,
  };
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
  firstRouteIndex?: number,
): Status | undefined {
  const { dt: nowDT } = currentTime;

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
  const arriDT = DateTime.fromJSDate(arriTime, { zone: "utc" });
  const deptDT = DateTime.fromJSDate(route.deptTime, {
    zone: "utc",
  });

  const deptDiff: number = deptDT.diff(nowDT).toMillis();
  const arrDiff: number = arriDT.diff(nowDT).toMillis();

  const timezoneOffset = DateTime.local().offset / 60;

  // // I really don't know why this shit keeps breaking when timezone changes
  // // but heres is the result of all of these methods for converting timezone for future reference
  // // This may be the behavior on client side code, but I can not tell you why
  // console.log("this shit sucks", {
  //   route: route.index,
  //   nowDT: nowDT.toISO(), // utc
  //   arriDT: arriDT.toISO(), // utc
  //   deptDT: deptDT.toISO(), // utc these are fine its meant to be

  //   // and these are fucked
  //   arriDTNY: arriDT.setZone(NEWYORK_TIMEZONE).toISO(), // -5 with and without DST
  //   deptDTNY: deptDT.setZone(NEWYORK_TIMEZONE).toISO(), // -5 with and without DST
  //   arriDTLocal: arriDT.toLocal().toISO(), // -5 with and without DST
  //   deptDTLocal: deptDT.toLocal().toISO(), // -5 with and without DST

  //   // This is what I roll currently since it works but only tested during the summer time
  //   timezoneOffset: DateTime.local().offset / 60, // -5 during winter(correct) -4 during summer(correct)
  //   arriDTOffset: arriDT.plus({ hours: timezoneOffset }).toISO(), // -5 during winter? -4 during summer(correct)
  //   deptDTOffset: deptDT.plus({ hours: timezoneOffset }).toISO(), // -5 during winter? -4 during summer(correct)
  // });

  if (
    route.index === (firstRouteIndex ?? 0) &&
    arrDiff >= 10 * 60 * 1000 // 10 minutes(600000 milsec)
  ) {
    return {
      statusMessage: `Out of service • Starting at ${arriDT
        .plus({ hours: timezoneOffset }) // offset to local time
        .toFormat("h:mm a")}`,
      location: route,
      isMoving: "starting",
      index: route.index - 0.5,
      nextUpdate: 5 * 60 * 1000,
    };
  }

  // moving
  if (arrDiff > 0) {
    const offsetTime = arriDT.toRelative({ base: nowDT });
    return {
      statusMessage: `Arriving ${offsetTime} • ${arriDT.plus({ hours: timezoneOffset }).toFormat("h:mm a")}`,
      location: route,
      isMoving: "moving",
      index: route.index - 0.5,
      nextUpdate: getTimeToUpdateNext(offsetTime ?? "minutes"),
    };
  }

  // stopped
  if (arrDiff <= 0 && deptDiff > 0) {
    const offsetTime = deptDT.toRelative({ base: nowDT });
    return {
      statusMessage: `Departing ${offsetTime} • ${deptDT.plus({ hours: timezoneOffset }).toFormat("h:mm a")}`,
      location: route,
      isMoving: "stopped",
      index: route.index,
      nextUpdate: getTimeToUpdateNext(offsetTime ?? "minutes"),
    };
  }
}

type SplitResult = { text: string; bus?: Bus };
const normalize = (str: string) => str.normalize("NFKD");

/**
 * This function is used for splitting the serviceinfo paragraph into parts based on bus names
 */
export function splitByKeywords(
  content: string,
  keywords: string[],
  buses: Bus[],
): SplitResult[] {
  const baseString = normalize(content);
  if (_.isEmpty(keywords)) return [{ text: baseString }];

  // Sort keywords by length in descending order to prioritize superstrings
  const sortedKeywords = _.orderBy(keywords, [(k) => k.length], ["desc"]);
  const regex = new RegExp(
    `(${sortedKeywords.map((o) => _.escapeRegExp(o)).join("|")})`,
    "g",
  );

  let lastIndex = 0;

  return _.reduce(
    [...baseString.matchAll(regex)],
    (parts, match) => {
      const offset = match.index ?? 0;

      if (offset > lastIndex)
        parts.push({
          text: baseString.slice(lastIndex, offset),
        });
      const matchedBus = buses.find((bus) =>
        match[0].toLowerCase().includes(bus.name.toLowerCase()),
      );
      parts.push({ text: match[0], bus: matchedBus });
      lastIndex = offset + match[0].length;

      return parts;
    },
    [] as SplitResult[],
  ).concat(
    lastIndex < baseString.length
      ? [{ text: baseString.slice(lastIndex) }]
      : [],
  );
}
