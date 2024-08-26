"use client";

import { Routes } from "@prisma/client";
import { useState } from "react";


export function StopListButton(params: { busIds: string[], values: Routes[][] }) {
    const { busIds, values } = params;

    const [selectedBus, setSelectedBus] = useState<string>();
    const selectedValues = selectedBus
        ? values[busIds.indexOf(selectedBus)]
        : [];

    return (
        <div className="flex">
            <div className="buttons">
                {busIds.map((busId, i) => (
                    <li className="w-full" key={i} style={{
                        backgroundColor: selectedBus === busId ? "lightgray" : "white",
                        border: "1px solid black"
                    }}>
                        <button
                            className="flex w-full flex-row items-center gap-4 p-2 text-left"
                            onClick={() => setSelectedBus(busId)}
                        >
                            <div
                                className="h-4 w-4 rounded-full border-2 border-black"
                                style={{
                                    backgroundColor:
                                        selectedBus === busId
                                            ? "red"
                                            : "white",
                                }}
                            />
                            Bus {busId}
                        </button>
                    </li>
                ))}
            </div>

            <div className="time">
                <ul className="mb-8 w-full text-xl ml-4" style={{backgroundColor: "lightgray", border: "1px solid black"}}>
                    {selectedValues?.map((value, i) => (
                            <li className="w-full" key={i}>
                                {JSON.stringify(value).replace(/[\[\]"]+/g, '')}
                            </li>
                    ))}
                </ul>

            </div>


        </div>

    );

}