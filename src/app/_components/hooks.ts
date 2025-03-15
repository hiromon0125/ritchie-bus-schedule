"use client";

import type { Bus } from "@prisma/client";
import _ from "lodash";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { api, type RouterOutputs } from "t/react";
import { useDebounceCallback } from "usehooks-ts";
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
  initialRoute?: RouterOutputs["routes"]["getCurrentRouteOfBus"],
) {
  return api.routes.getAllByBusIdPaginated.useInfiniteQuery(
    {
      busId,
      stopId,
    },
    {
      getNextPageParam: (lastPage) =>
        (lastPage.nextCursor?.index ?? 0) > (initialRoute?.index ?? 0)
          ? lastPage.nextCursor
          : initialRoute != null
            ? { id: initialRoute.id, index: initialRoute.index }
            : lastPage.nextCursor,
      initialCursor:
        initialRoute != null
          ? { id: initialRoute.id, index: initialRoute.index }
          : undefined,
    },
  );
}

export function useBusStatus(
  busId: Bus["id"],
  serverGuessedRoute?: BusRoute | null,
  stopId?: number,
  isVisible?: boolean,
) {
  // Cache call for 30 minutes doesn't really need to refetch that often
  const { data: isOperating } = api.routes.isBusOperating.useQuery(
    { busId, isVisible: isVisible ?? true },
    { staleTime: 1000 * 60 * 30 },
  );
  const { data: isRouteCompleted } = api.routes.isLastBusFinished.useQuery(
    { busId, stopId },
    { staleTime: 1000 * 60 * 30 },
  );
  const { data: firstRouteIndex } = api.routes.getFirstRouteIndex.useQuery(
    { busId, stopId },
    {
      enabled: !!stopId,
      staleTime: 1000 * 60 * 30,
    },
  );
  const [index, setIndex] = useState(0);
  const {
    data: routes,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useRouteByBus(busId, stopId, serverGuessedRoute);
  const fetchedRoutes = _.flatMap(routes?.pages, (page) => page.data);
  const nextRoute = fetchedRoutes[index] ?? serverGuessedRoute;
  const status = useStatusFromRoute(
    nextRoute,
    isOperating,
    isRouteCompleted,
    stopId != undefined ? firstRouteIndex : undefined,
  );
  const debounceFetchNextPage = useDebounceCallback(fetchNextPage, 3000);
  useEffect(() => {
    if (!isOperating || isRouteCompleted) return;
    if (hasNextPage && !isFetching && index >= fetchedRoutes.length - 2) {
      debounceFetchNextPage()?.catch((e) => console.error(e));
    }
    if (nextRoute) {
      const now = getCurrentTime().dt;
      const dept = DateTime.fromJSDate(nextRoute.deptTime, {
        zone: "utc",
      });
      const updateTime = dept.diff(now);
      const timeout = setTimeout(() => {
        setIndex((i) => i + 1);
      }, updateTime.milliseconds);
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
    debounceFetchNextPage,
  ]);
  return status ?? LOADING_STATUS;
}

function useStatusFromRoute(
  nextRoute: BusRoute | null | undefined,
  isOperating?: boolean,
  isRouteCompleted?: boolean,
  firstRouteIndex?: number,
) {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const status = evalStatusFromRoute(nextRoute, currentTime, firstRouteIndex);
  useEffect(() => {
    if (!isOperating || isRouteCompleted) return;
    const interval = setTimeout(() => {
      setCurrentTime(getCurrentTime());
    }, status?.nextUpdate ?? 2000);
    return () => clearTimeout(interval);
  }, [status, isOperating, isRouteCompleted]);
  return isOperating && !isRouteCompleted ? status : OUT_OF_SERVICE_STATUS;
}
