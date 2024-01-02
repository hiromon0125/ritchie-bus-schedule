import { api } from "../../trpc/server";
import { type RouterOutputs } from "../../trpc/shared";
import BusStatusString from "./bus-status-string";

type BusStatusProps =
  | {
      busID: RouterOutputs["bus"]["getAllID"][0];
      bus?: never;
    }
  | {
      bus: RouterOutputs["bus"]["getByID"];
      busID?: never;
    };

async function BusInfo({ busID, bus }: BusStatusProps) {
  const busObj = busID ? await api.bus.getByID.query(busID) : bus;
  if (!busObj) return null;
  const routes = await api.routes.getAllByBusId.query({ busId: busObj.id });
  return (
    <div className=" flex w-full flex-row flex-wrap justify-between gap-1">
      <div className=" flex w-full min-w-56 flex-1 flex-col justify-center">
        <h2 className=" w-full overflow-hidden text-ellipsis text-nowrap text-xl font-bold">
          {busObj?.name}
        </h2>
      </div>
      <BusStatusString routes={routes} />
    </div>
  );
}

export default BusInfo;
