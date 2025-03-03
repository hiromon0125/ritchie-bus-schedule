"use client";

import type { Bus } from "@prisma/client";
import _ from "lodash";
import { useEffect, useState } from "react";
import { api } from "t/react";
import type { BusRoute } from "./types";
import { evalStatusFromRoute, getCurrentTime } from "./util";

const OUT_OF_SERVICE_STATUS = {
  statusMessage: "Out of service",
  location: undefined,
  isMoving: "out-of-service",
  index: -2,
  nextUpdate: 5 * 60 * 1000,
} as const;
const LOADING_STATUS = {
  statusMessage: "Loading...",
  location: undefined,
  isMoving: "loading",
  index: -1,
  nextUpdate: 2000,
} as const;

function useRouteByBus(
  busId: number,
  stopId?: number,
  initialRouteId?: number,
) {
  return api.routes.getAllByBusIdPaginated.useInfiniteQuery(
    {
      busId,
      stopId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: initialRouteId,
    },
  );
}

export function useBusStatus(
  busId: Bus["id"],
  serverGuessedRoute?: BusRoute | null,
  stopId?: number,
) {
  const { data: isOperating, isPending } = api.routes.isBusOperating.useQuery(
    {
      busId,
    },
    {
      staleTime: 1000 * 60 * 30, // 30 minutes doesn't really need to refetch that often
    },
  );
  const { data: isRouteCompleted } = api.routes.isLastBusFinished.useQuery(
    {
      busId,
      stopId,
    },
    {
      staleTime: 1000 * 60 * 30, // 30 minutes doesn't really need to refetch that often
    },
  );
  const [index, setIndex] = useState(0);
  const {
    data: routes,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useRouteByBus(busId, stopId, serverGuessedRoute?.id);
  const fetchedRoutes = _.flatMap(routes?.pages, (page) => page.data);
  const nextRoute = fetchedRoutes[index];
  const status = useStatusFromRoute(nextRoute, isOperating, isRouteCompleted);
  useEffect(() => {
    if (!isOperating || isRouteCompleted) return;
    if (hasNextPage && !isFetching && index >= fetchedRoutes.length - 2) {
      fetchNextPage().catch((e) => console.error(e));
    }
    if (nextRoute) {
      const updateTime =
        nextRoute.deptTime.getTime() - getCurrentTime().date.getTime();
      const timeout = setTimeout(() => {
        setIndex((i) => i + 1);
      }, updateTime);
      return () => clearTimeout(timeout);
    }
  }, [
    isOperating,
    isRouteCompleted,
    hasNextPage,
    isFetching,
    nextRoute,
    fetchedRoutes,
    index,
    fetchNextPage,
  ]);
  return isPending ? LOADING_STATUS : (status ?? LOADING_STATUS);
}

function useStatusFromRoute(
  nextRoute: BusRoute | null | undefined,
  isOperating?: boolean,
  isRouteCompleted?: boolean,
) {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const status = evalStatusFromRoute(nextRoute, currentTime);
  useEffect(() => {
    if (!isOperating || isRouteCompleted) return;
    const interval = setTimeout(() => {
      setCurrentTime(getCurrentTime());
    }, status?.nextUpdate ?? 2000);
    return () => clearTimeout(interval);
  }, [status, isOperating, isRouteCompleted]);
  return isOperating && !isRouteCompleted ? status : OUT_OF_SERVICE_STATUS;
}

/**
 * This function is used for checking if the server's computed result is correct on
 * the client side. This is from an issue caused by the server where the server is
 * sometimes seen to be on a completely different timezones than the client which
 * should never be a problem but it seems to be that some server just can not keep
 * track of utc time.
 * I also hate dealing with times so there might actually be a bug somewhere in the
 * system that causes the initial problem, but I am just going to put this function
 * in for now as a temporary solution until further investigation.
 */
// function check(
//   offset: number,
//   index: number,
//   data: BusRoute[],
//   fetchedRoute: { serverGuess: BusRoute | null; lastRoute: BusRoute | null },
//   bus: Bus,
//   nextRoute: BusRoute | undefined,
// ) {
//   const { date, isWeekend } = getCurrentTime();
//   if (bus.isWeekend != isWeekend || nextRoute == undefined || data == undefined)
//     return;
//   const deptTime = nextRoute?.deptTime;
//   if (
//     deptTime.getTime() < date.getTime() &&
//     (!fetchedRoute?.lastRoute ||
//       fetchedRoute.lastRoute.deptTime.getTime() > date.getTime())
//   ) {
//     let newIndex;
//     if (
//       fetchedRoute?.lastRoute &&
//       (fetchedRoute.lastRoute.deptTime.getTime() - date.getTime()) * 2 <
//         nextRoute.deptTime.getTime() - date.getTime()
//     ) {
//       newIndex = index + Math.floor((fetchedRoute.lastRoute.index - index) / 2);
//     } else {
//       const searchedIndex = _.findIndex(
//         data,
//         (route) => route?.deptTime > date,
//       );
//       newIndex = (searchedIndex ?? QUERY_SIZE) + offset;
//     }
//     return newIndex;
//   }
// }
