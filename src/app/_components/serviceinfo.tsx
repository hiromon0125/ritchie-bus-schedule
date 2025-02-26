"use client";
import Image from "next/image";
import {
  type ButtonHTMLAttributes,
  createContext,
  useContext,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { api } from "../../trpc/react";

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
  const { data, isLoading } = api.serviceinfo.getAll.useQuery();
  console.log(data);

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
        <DialogContent className=" rounded-3xl border-4 border-orange-500 bg-white">
          <div>
            <DialogHeader>
              <div className=" relative flex h-[180px] w-full flex-col items-center justify-center bg-gradient-to-b from-orange-500/40 to-white">
                <Image
                  className=" h-[100px] object-contain"
                  src="/service-info-icon.png"
                  alt="alert"
                  height={100}
                  width={100}
                />
                <DialogTitle className=" text-center text-2xl">
                  Service Alert!
                </DialogTitle>
              </div>
            </DialogHeader>
          </div>
          {isLoading ? (
            <div className=" text-center text-base">
              Loading alert for today...
            </div>
          ) : !data || data.length == 0 ? (
            <div className=" text-center text-base">
              No alert for today! Have a nice day.
            </div>
          ) : (
            <div className=" flex flex-col gap-2 p-2">
              {data.map((alert) => {
                return (
                  <div key={alert.hash} className=" text-base">
                    {alert.content}
                  </div>
                );
              })}
            </div>
          )}
          <div className=" flex flex-col gap-4 p-4 pt-0">
            <DialogFooter>footer</DialogFooter>
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
