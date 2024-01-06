import Link from "next/link";
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
  const color = (busObj.color?.toLowerCase() as `#${string}`) ?? "#000000";
  return (
    <Link href={`/bus/${busObj.id}`}>
      <div className="relative pl-3">
        <div
          className=" absolute left-0 top-0 h-full w-3 rounded-bl-full rounded-tr-full"
          style={{ backgroundColor: color }}
        />
        <div className=" relative flex w-full flex-row flex-wrap justify-between">
          <div className=" mr-1 flex w-full min-w-56 flex-1 flex-row items-center p-4">
            <h2 className=" w-full overflow-hidden text-ellipsis text-nowrap text-xl font-bold">
              {busObj?.name}
            </h2>
          </div>
          <BusStatusString routes={routes} />
        </div>
      </div>
    </Link>
  );
}

export default BusInfo;
