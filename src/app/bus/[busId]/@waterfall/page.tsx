import WaterfallBusTimeline from "@/waterfall-bus-timeline";
import { TRPCClientError } from "@trpc/client";
import _ from "lodash";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { api } from "t/server";

async function page({ params }: { params: { busId: string } }) {
  const busId = parseInt(params.busId);
  if (_.isNaN(busId)) {
    throw TRPCClientError.from(
      Error(`Bus not found (bus id: ${params.busId})`),
    );
  }
  const bus = await api.bus.getByID.query({ id: busId });
  if (!bus) {
    throw TRPCClientError.from(Error(`Bus not found (bus id: ${busId})`));
  }
  const routes = await api.routes.getAllByBusId.query({ busId });
  const stops = await api.stops.getStopsByBusID.query({ busId });
  return (
    <WaterfallBusTimeline
      routes={routes}
      stops={stops}
      bus={bus}
      upIcon={
        <div style={{ backgroundColor: bus.color ?? "white" }}>
          <div className=" translate-y-[-2px]">
            <IoIosArrowUp size={48} />
          </div>
        </div>
      }
      downIcon={
        <div
          style={{ backgroundColor: bus.color ?? "white" }}
          className=" h-full w-full"
        >
          <div className=" translate-y-[2px]">
            <IoIosArrowDown size={48} />
          </div>
        </div>
      }
    />
  );
}

export default page;
