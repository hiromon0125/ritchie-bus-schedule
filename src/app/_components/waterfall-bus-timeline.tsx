"use client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import style from "~/styles/bus.module.css";
import { type RouterOutputs } from "../../trpc/shared";
import { type BusRoute } from "./types";
import { getArriTime, getNowInUTC, getStopStatus } from "./util";

type BusStop = RouterOutputs["stops"]["getOneByID"];

interface Props {
  routes: RouterOutputs["routes"]["getAllByBusId"];
  stops: RouterOutputs["stops"]["getOneByID"][];
  status: ReturnType<typeof getStopStatus>;
  upIcon: React.ReactNode;
  downIcon: React.ReactNode;
}

function WaterfallBusTimeline(props: Props) {
  const { routes, stops, status, upIcon, downIcon } = props;
  const firstBusIndex = Math.ceil(status.index);
  const [stopIndex, setStopIndex] = useState(
    firstBusIndex > 0 ? firstBusIndex : 0,
  );
  const [busStatus, setBusStatus] = useState(status);

  useEffect(() => {
    const nextUpdate = setTimeout(() => {
      const newStatus = getStopStatus(routes, getNowInUTC());
      setBusStatus(newStatus);
    }, busStatus.nextUpdate);
    return () => clearTimeout(nextUpdate);
  }, [busStatus]);

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
      <li className=" absolute top-[-70px] flex w-full flex-row justify-center">
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
      {routes.slice(stopIndex, stopIndex + stops.length).map((route, i) => (
        <li key={route.id} className=" p-3">
          <Route
            status={status}
            route={route}
            prevRoute={routes[stopIndex + i - 1]}
            stop={stops.find((stop) => stop?.id === route.stopId)}
          />
        </li>
      ))}
      <li className=" absolute bottom-[-70px] flex w-full flex-row justify-center">
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
  status: ReturnType<typeof getStopStatus>;
  prevRoute?: BusRoute;
  route: BusRoute;
  stop: BusStop | undefined;
}) {
  const {
    status: { index },
    route: routeToShow,
    prevRoute,
    stop,
  } = prop;
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
        {DateTime.fromJSDate(arriTime).toUTC().toFormat("h:mm a")} -{" "}
        {DateTime.fromJSDate(routeToShow.deptTime).toUTC().toFormat("h:mm a")}
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
