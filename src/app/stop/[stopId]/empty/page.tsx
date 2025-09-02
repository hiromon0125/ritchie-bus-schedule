import CopyLink from "@/copyLink";
import { SpecificFavBtn } from "@/favBtn";
import { StopTag } from "@/tags";
import { TRPCClientError } from "@trpc/client";
import { type Metadata } from "next";
import { MdOutlineBusAlert } from "react-icons/md";
import { api } from "t/server";
import { BackBtn } from "~/app/_components/backBtn";
import { APPCONFIG } from "../../../../appconfig";

type Props = {
  params: Promise<{ stopId: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const stopId = parseInt(params.stopId);
  if (Number.isNaN(stopId)) {
    throw TRPCClientError.from(
      Error(`Stop not found (stop id: ${params.stopId})`),
    );
  }
  const stop = await api.stops.getOneByID({ id: stopId });
  if (!stop) {
    throw TRPCClientError.from(Error(`Stop not found (stop id: ${stopId})`));
  }
  return {
    title: `${stop.tag ?? stop.id} ${stop.name} | ${APPCONFIG.APP_TITLE}`,
    description: stop.description,
  };
}

export default async function Page(props: Props) {
  const params = await props.params;
  const stopId = Number(params.stopId);
  if (Number.isNaN(stopId)) {
    throw TRPCClientError.from(Error(`Invalid ID (stop id: ${params.stopId})`));
  }
  const currentStop = await api.stops.getOneByID({ id: stopId });
  if (!currentStop) {
    throw TRPCClientError.from(Error(`Stop not found (stop id: ${stopId})`));
  }

  return (
    <>
      <div className="bg-border-background xs:gap-3 xs:rounded-3xl xs:p-3 flex w-(--sm-max-w) flex-row flex-wrap gap-2 rounded-[20px] p-2 md:max-w-(--breakpoint-lg)">
        <div className="bg-item-background flex w-full flex-row gap-2 rounded-xl p-2">
          <div className="bg-foreground h-auto min-w-3 rounded-l-md" />
          <div className="flex flex-auto flex-col gap-2">
            <div className="xs:mt-3 flex flex-row items-center gap-2">
              <StopTag stop={currentStop} />
              <h1 className="my-1.5 text-2xl font-bold">{currentStop.name}</h1>
              <SpecificFavBtn stopId={currentStop.id} togglable />
            </div>
            <p className="mb-2 text-lg">{currentStop.description}</p>
          </div>
          <CopyLink link={`/stop/${currentStop.id}`} />
        </div>
      </div>
      <div className="xs:gap-3 xs:rounded-3xl xs:p-3 flex w-(--sm-max-w) flex-row flex-wrap gap-2 rounded-[20px] bg-orange-300 p-2 md:max-w-(--breakpoint-lg) dark:bg-orange-400/80">
        <div className="flex w-full flex-col items-start justify-between gap-4 rounded-xl bg-orange-100 p-3 pl-4 dark:bg-orange-900/80">
          <div className="mt-1 flex flex-row items-center gap-3">
            <MdOutlineBusAlert size={32} className="mb-1" />
            <h2 className="xs:text-2xl m-0 text-xl font-bold">Sorry</h2>
          </div>
          <p>
            This stop is no longer in service or is not scheduled to be served
            anytime soon.
          </p>
          <BackBtn className="border-foreground rounded-md border-2 p-2 px-4 hover:bg-amber-300/50">
            Go back
          </BackBtn>
        </div>
      </div>
    </>
  );
}
