"use client";
import type { Bus, Stops } from "@prisma/client";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useState } from "react";
import style from "~/styles/bus.module.css";
import { useBusStatus } from "./hooks";
import { type BusRoute, type BusStop } from "./types";
import { getArriTime, type getStopStatusPerf } from "./util";

interface Props {
  routes: BusRoute[];
  stops: Stops[];
  bus: Bus;
  upIcon: React.ReactNode; // serverside loaded buttons
  downIcon: React.ReactNode; // serverside loaded buttons
  fetchedRoute?: { serverGuess: BusRoute | null; lastRoute: BusRoute | null };
}

function WaterfallBusTimeline(props: Props) {
  const { routes, stops, bus, upIcon, downIcon, fetchedRoute } = props;
  const router = useRouter();
  const status = useBusStatus(bus, fetchedRoute);
  const [stopIndex, setStopIndex] = useState(status?.location?.index ?? 0);

  function goDown() {
    setStopIndex((i) => {
      if (i === routes.length - stops.length) return i;
      return i + 1;
    });
  }
  function goUp() {
    setStopIndex((i) => {
      if (i === 0) return i;
      return i - 1;
    });
  }
  return (
    <>
      <li className=" absolute top-[-35px] flex w-full scale-75 flex-row justify-center sm:top-[-70px] sm:scale-100">
        <button
          className={
            " overflow-hidden rounded-full border-[3px] border-black" +
            (stopIndex === 0 ? " opacity-25" : "")
          }
          onClick={goUp}
          disabled={stopIndex === 0}
        >
          {upIcon}
        </button>
      </li>
      {routes
        .slice(stopIndex - 1, stopIndex + stops.length - 1)
        .map((route, i) => (
          <li
            key={route.id}
            className=" p-3"
            onClick={() => router.push(`/stop/${route.stopId}`)}
          >
            <Route
              status={status}
              route={route}
              prevRoute={routes[stopIndex + i - 1]}
              stop={stops.find((stop) => stop?.id === route.stopId)}
            />
          </li>
        ))}
      <li className=" absolute bottom-[-35px] flex w-full scale-75 flex-row justify-center sm:bottom-[-70px] sm:scale-100">
        <button
          className={
            " relative overflow-hidden rounded-full border-[3px] border-black" +
            (stopIndex === routes.length - stops.length ? " opacity-25" : "")
          }
          onClick={goDown}
          disabled={stopIndex === routes.length - stops.length}
        >
          {downIcon}
        </button>
      </li>
    </>
  );
}

function Route(prop: {
  status: ReturnType<typeof getStopStatusPerf>;
  prevRoute?: BusRoute;
  route: BusRoute;
  stop: BusStop | undefined;
}) {
  const { status, route: routeToShow, prevRoute, stop } = prop;
  const index = status?.index ?? -2;
  const isArriving = index + 0.5 === routeToShow.index;
  const isDeparting = index === routeToShow.index;
  const arriTime = getArriTime(routeToShow, prevRoute);

  return (
    <div className=" relative">
      {isArriving && <DownArrow />}
      <div className={style.nodeWrapper}>
        <div className={isDeparting ? style.activeStopNode : style.stopNode} />
      </div>
      <p>
        <span className={routeToShow.arriTime == null ? " opacity-60" : ""}>
          {DateTime.fromJSDate(arriTime).toLocal().toFormat("h:mm a")}
        </span>{" "}
        -{" "}
        {DateTime.fromJSDate(routeToShow.deptTime).toLocal().toFormat("h:mm a")}
      </p>
      <p className=" text-xl">{stop?.name}</p>
    </div>
  );
}

function DownArrow() {
  return [1, 2, 3].map((i) => (
    <div key={i} className={style.downArrowWrapper}>
      <div className={style.downArrow} />
    </div>
  ));
}

export default WaterfallBusTimeline;
