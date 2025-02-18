import { api } from "~/trpc/server";
import { StopListButton } from "./stopListButton";

export async function StopList(params: { stopId: number }) {
  const { stopId } = params;
  const { buses } = (await api.bus.getAllByStopID({ stopId })) ?? {
    buses: [],
  };

  return (
    <div className="flex-row">
      {/* <h2 className=" text-2xl font-bold sm:mb-2 sm:text-4xl flex justify-center">Stop Info</h2> */}
      <p className=" mb-2 flex justify-start text-lg">
        Select the bus to see the time of departure
      </p>
      <StopListButton buses={buses} stopId={stopId} />
      <ul id="stopList" className=" mb-8 w-full text-xl"></ul>
    </div>
  );
}
