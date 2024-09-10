"use client";

import { type Bus } from "@prisma/client";

export function StopListButton(params: { buses: Bus[] }) {
  const { buses } = params;

  console.log(buses);

  return (
    <div>
      {buses.map((bus, i) => (
        <button
          key={i}
          className="flex w-full flex-row items-center gap-4 p-2 text-left"
        >
          Bus {bus.id}
        </button>
      ))}
    </div>
  );

  // const [selectedBus, setSelectedBus] = useState<string>();
  // const selectedValues = selectedBus ? values[busIds.indexOf(selectedBus)] : [];

  // return (
  //   <div className="flex">
  //     <div className="buttons">
  //       {busIds.map((busId, i) => (
  //         <li
  //           className="w-full"
  //           key={i}
  //           style={{
  //             backgroundColor: selectedBus === busId ? "lightgray" : "white",
  //             border: "1px solid black",
  //           }}
  //         >
  //           <button
  //             className="flex w-full flex-row items-center gap-4 p-2 text-left"
  //             onClick={() => setSelectedBus(busId)}
  //           >
  //             <div
  //               className="h-4 w-4 rounded-full border-2 border-black"
  //               style={{
  //                 backgroundColor: selectedBus === busId ? "red" : "white",
  //               }}
  //             />
  //             Bus {busId}
  //           </button>
  //         </li>
  //       ))}
  //     </div>

  //     <div className="time">
  //       <ul
  //         className="mb-8 ml-4 w-full text-xl"
  //         style={{ backgroundColor: "lightgray", border: "1px solid black" }}
  //       >
  //         {selectedValues?.map((value, i) => (
  //           <li className="w-full" key={i}>
  //             {JSON.stringify(value).replace(/[\[\]"]+/g, "")}
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   </div>
  // );
}