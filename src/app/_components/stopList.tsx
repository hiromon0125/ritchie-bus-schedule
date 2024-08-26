import { api } from "~/trpc/server";
import { BusRoute } from "./types";
import { StopListButton } from "./stopListButton";
import { Routes } from "@prisma/client";

export async function StopList(params: { stopId: number }) {
    const { stopId } = params;
    const routes = await api.routes.getAll.query() || [];

    type Fin = { [busId: number]: BusRoute[] };
    let dict: Fin = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 13: [], 16: [] };

    const selectedRoutes = routes.filter((route) => route.stopId === stopId).sort((a, b) => a.deptTime.getTime() - b.deptTime.getTime());
    for (let i = 0; i < selectedRoutes.length; i++) {
            // console.log("Adding route" + i + " " + selectedRoutes[i]);
            dict[selectedRoutes[i]?.busId]?.push(selectedRoutes[i]?.deptTime.toLocaleTimeString([], { timeStyle: 'short' }));
    }

    let filledDict: Fin = {};
    for (let key in dict) {
        if (dict[key].length > 0) {
            filledDict[key] = dict[key];
        }
    }

    
    const keys:string[] = Object.keys(filledDict);
    const values = Object.values(filledDict);
    
    const keysJson = JSON.stringify(keys);
    const valuesJson = JSON.stringify(values);
    

    return (
        <div className="flex-row">
            {/* <h2 className=" text-2xl font-bold sm:mb-2 sm:text-4xl flex justify-center">Stop Info</h2> */}
            <p className=" mb-2 text-lg flex justify-center">
                Select the bus to see the time of departure
            </p>
            <ul className="flex justify-center">
                <StopListButton busIds={keys} values={values}></StopListButton>
            </ul>
            <ul id="stopList" className=" mb-8 w-full text-xl">
            </ul>
        </div>
    );
}