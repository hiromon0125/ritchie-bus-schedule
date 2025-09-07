"use client";
import { DialogClose } from "@radix-ui/react-dialog";
import { DateTime } from "luxon";
import Image from "next/image";
import {
  type ButtonHTMLAttributes,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { api } from "t/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "../../components/ui/button";
import { BusTag } from "./tags";
import { splitByKeywords } from "./util";

export const ServiceInfoContext = createContext({
  state: false,
  setState: (state: boolean) => {
    console.log("setState is not implemented: " + state);
  },
});
export function ServiceInfoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState(false);
  const { data, isLoading } = api.serviceinfo.getAll.useQuery({
    includeRelatedBus: true,
  });
  return (
    <>
      <ServiceInfoContext.Provider
        value={{
          state: state,
          setState: setState,
        }}
      >
        {children}
      </ServiceInfoContext.Provider>
      <Dialog open={state} onOpenChange={setState}>
        <DialogContent className="bg-background rounded-3xl border-4 border-orange-500">
          <DialogHeader>
            <div className="to-background relative flex h-[140px] w-full flex-col items-center justify-center bg-linear-to-b from-orange-500/40">
              <Image
                className="mt-2 h-[100px] object-contain"
                src="/service-info-icon.png"
                alt="alert"
                height={100}
                width={100}
              />
              <DialogTitle className="text-center text-2xl">
                Service Alert!
              </DialogTitle>
            </div>
          </DialogHeader>
          {isLoading ? (
            <div className="text-center text-base">
              Loading alert for today...
            </div>
          ) : !data || data.length == 0 ? (
            <div className="py-12 text-center text-base">
              No alert for today! <br />
              Have a nice day.
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-3 pb-0">
              {data.map((alert, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-lg font-semibold">{alert.title}</p>
                    <p className="text-sm font-semibold text-gray-500">
                      {DateTime.fromJSDate(alert.createdAt).toFormat("LLL dd")}
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    {alert.buses && alert.buses.length > 0 && (
                      <div className="flex max-h-14 max-w-14 flex-row flex-wrap items-center gap-2">
                        {alert.buses.map((bus) => (
                          <div key={bus.id}>
                            <BusTag
                              bus={bus}
                              size={alert.busIds.length > 1 ? "sm" : "md"}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-base font-semibold">
                      {alert.buses?.map((bus) => bus.name).join(", ")}
                    </p>
                  </div>
                  <div className="text-base">
                    <ServiceInfoContentDecorator content={alert.content} />
                  </div>
                  <div className="h-[2px] w-full rounded-full bg-slate-600 dark:bg-slate-300" />
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-4 p-3 pt-0">
            <DialogFooter>
              <p className="mr-2 text-right text-sm text-gray-600 italic dark:text-slate-300">
                Experimental<br></br> Visit{" "}
                <a
                  className="underline"
                  href="https://www.rit.edu/parking/campus-shuttles"
                >
                  RIT's site
                </a>{" "}
                for accurate information
              </p>
              <DialogClose asChild>
                <Button className="border-2 border-black bg-gray-600 dark:border-slate-200 dark:bg-slate-300 dark:hover:bg-slate-200">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function ServiceInfoButton(
  prop: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">,
) {
  const { setState } = useContext(ServiceInfoContext);
  return (
    <button {...prop} onClick={() => setState(true)}>
      {prop.children}
    </button>
  );
}

export function ServiceInfoContentDecorator({ content }: { content: string }) {
  const { data: busNames } = api.bus.getAll.useQuery();
  const busNameList = useMemo(
    () =>
      busNames
        ?.map((bus) => [
          `${bus.tag ?? bus.id} ${bus.name} shuttle`,
          `${bus.tag ?? bus.id} ${bus.name}`,
          bus.name,
        ])
        .flat() ?? [],
    [busNames],
  );
  const contentWrapped = useMemo(
    () => splitByKeywords(content, busNameList ?? [], busNames ?? []),
    [content, busNameList, busNames],
  );
  return contentWrapped.map((item, index) =>
    item.bus ? (
      <b key={index} className="text-base">
        <a href={`/bus/${item.bus.id}`}>{item.text}</a>
      </b>
    ) : (
      <span key={index} className="text-base">
        {item.text}
      </span>
    ),
  );
}
