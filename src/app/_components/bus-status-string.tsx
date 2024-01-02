"use client";
import { TRPCError } from "@trpc/server";
import _ from "lodash";
import moment from "moment";
import Image from "next/image";
import { useEffect, useState } from "react";
import iconStyles from "~/styles/animated-icon.module.css";
import { api } from "../../trpc/react";
import { type RouterOutputs } from "../../trpc/shared";

export default function BusStatusString({
  routes,
}: {
  routes: RouterOutputs["routes"]["getAllByBusId"];
}) {
  const currentLocation = getCurrentLocation(routes);
  const { isMoving, status } = useBusStatus(currentLocation);
  const { data: stop } = api.stops.getOneByID.useQuery({
    id: currentLocation?.stopId ?? 0,
  });
  const level = isMoving ? 1 : isMoving == false ? 2 : 3;
  return (
    <div className=" relative flex h-20 min-h-max flex-row items-center overflow-hidden pr-3">
      <div className=" relative flex h-24 w-24 justify-center">
        <Image
          src={
            level === 1
              ? "/icons/Moving-icon.png"
              : level === 2
                ? "/icons/Stopped-icon.png"
                : "/icons/Out-of-service-icon.png"
          }
          alt={"Bus " + (isMoving ? "moving" : "stopped")}
          width={96}
          height={96}
          className={
            level === 1
              ? iconStyles.moving
              : level === 2
                ? iconStyles.stopped
                : iconStyles.out
          }
        />
        {level === 3 && <div className={iconStyles.outAfter} />}
      </div>
      <div className=" flex h-full flex-col justify-center">
        <h3 className=" my-1 text-lg font-medium">
          {status ?? "Out of service"}
        </h3>
        {!!stop?.name && <p>{stop?.name}</p>}
      </div>
    </div>
  );
}

function useBusStatus(currentLocation: ReturnType<typeof getCurrentLocation>) {
  const [status, setStatus] = useState<string | null>(
    currentLocation ? getStopStatus(currentLocation) : null,
  );
  const isMoving = status?.startsWith("Arriving");
  useEffect(() => {
    if (!currentLocation) {
      setStatus(null);
      return;
    }
    const interval = setInterval(() => {
      setStatus(getStopStatus(currentLocation));
    }, getTimeToUpdateNext(status));
    return () => clearInterval(interval);
  }, [currentLocation, status]);
  return { isMoving, status };
}

/**
 * updates every 5 minutes, unless it's seconds or minutes away, then it updates every second or minute
 */
function getTimeToUpdateNext(status: string | null) {
  if (!status) return 5 * 60 * 1000;
  if (status.endsWith("seconds")) {
    return 1000;
  } else if (status.endsWith("minutes")) {
    return 60 * 1000;
  }
  return 5 * 60 * 1000;
}

function getCurrentLocation(route: RouterOutputs["routes"]["getAllByBusId"]) {
  const now = new Date();
  // check if it's both a weekday or both a weekend
  const isWknd = isWeekend(now);
  if (isWeekend(route[0]?.deptTime) != isWknd) {
    return undefined;
  }
  const stops = route.map((route) => {
    const copy = { ...route };
    if (copy.arriTime) {
      copy.arriTime = new Date(copy.arriTime);
      copy.arriTime.setFullYear(now.getFullYear());
      copy.arriTime.setMonth(now.getMonth());
      copy.arriTime.setDate(now.getDate());
    }
    if (copy.deptTime) {
      copy.deptTime = new Date(copy.deptTime);
      copy.deptTime.setFullYear(now.getFullYear());
      copy.deptTime.setMonth(now.getMonth());
      copy.deptTime.setDate(now.getDate());
    }
    return copy;
  });
  const nowMoment = moment();
  const relStops = route.filter((route) => {
    return (
      (route.arriTime && moment(route.arriTime).isAfter(nowMoment)) ??
      (route.deptTime && moment(route.deptTime).isAfter(nowMoment))
    );
  });
  if (relStops.length === 0) {
    return undefined;
  }
  return _.minBy(stops, "index");
}

function isWeekend(date?: Date | null) {
  if (!date) return undefined;
  return [0, 6].includes(date.getDay());
}

const stopBuffer = 5 * 60 * 1000; // 5 minutes

function getStopStatus(stop: RouterOutputs["routes"]["getAllByBusId"][0]) {
  if (!stop.arriTime && !stop.deptTime) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "both depture and arrival was null",
    });
  }
  const arriMoment = moment(stop.arriTime ?? stop.deptTime).subtract(
    stopBuffer,
  );
  if (arriMoment.isBefore(moment())) {
    return `Arriving ${arriMoment.toNow()}`;
  }
  return `Departing ${moment(stop.deptTime).toNow()}`;
}
