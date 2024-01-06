import { TRPCClientError } from "@trpc/client";
import _ from "lodash";
import { api } from "../../../trpc/server";
import { BusStatusBig } from "../../_components/bus-status-string";
import { getNowInUTC, getStopStatus } from "../../_components/util";
import WaterfallBusTimeline from "../../_components/waterfall-bus-timeline";

export default async function Page({ params }: { params: { busId: string } }) {
  const busId = parseInt(params.busId);
  const bus = await api.bus.getByID.query({ id: busId });
  if (!bus) {
    throw TRPCClientError.from(Error(`Bus not found (bus id: ${busId})`));
  }
  const routes = await api.routes.getAllByBusId.query({ busId });
  const uniqueStops = _.uniqBy(routes, "stopId");
  const stops = await Promise.all(
    uniqueStops.map((route) =>
      api.stops.getOneByID.query({ id: route.stopId }),
    ),
  );
  const busColor = (bus.color?.toLowerCase() as `#${string}`) ?? "#000000";
  const status = getStopStatus(routes, getNowInUTC());
  return (
    <div className=" relative">
      <div className=" max-w-full overflow-scroll">
        <h1 className=" whitespace-nowrap pl-4 text-4xl font-extrabold">
          {bus.name}
        </h1>
      </div>
      <div className=" flex flex-row-reverse flex-wrap justify-end">
        <div className=" min-w-[360px] max-w-2xl flex-1">
          <div
            className=" h-4 w-4 rounded-tr-full border-r-[64px] border-t-[64px] p-4"
            style={{ borderColor: busColor }}
          />
          <ol
            className=" relative ml-8 border-l-[64px]"
            style={{ borderColor: busColor }}
          >
            <WaterfallBusTimeline
              routes={routes}
              stops={stops}
              status={status}
              busColor={busColor}
            />
          </ol>
          <div className=" z-0 mb-[-64px] bg-white">
            <div
              className=" ml-8 rounded-bl-full border-b-[64px] border-l-[64px]  p-12"
              style={{ borderColor: busColor }}
            />
          </div>
        </div>
        <div
          className=" flex-2 -z-10 min-w-96 border-t-[64px] p-4"
          style={{ borderColor: busColor }}
        >
          <BusStatusBig routes={routes} stops={stops} />
          <h2 className=" mb-2 text-4xl font-bold">Description</h2>
          <p className=" mb-8 text-xl">{bus.description}</p>
        </div>
      </div>
      <div className=" h-16" />
    </div>
  );
}
