"use client";

import type { BusOperatingDay } from "@prisma/client";
import _ from "lodash";
import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "../../../lib/utils";

type EditedOperatingDay = Partial<BusOperatingDay> &
  Pick<BusOperatingDay, "day" | "isWeekly">;

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIMEZONE = "America/New_York";
/**
 * There are also no debouncing in these components because the editBusDetail component will already have debouncing and we don't want to stack debounce.
 * @param param0 operatingDays: Array of BusOperatingDay objects stored in bus object
 */

export default function DayOfWeekSelector({
  operatingDays,
  onChange,
}: {
  operatingDays: BusOperatingDay[];
  onChange: (operatingDays: EditedOperatingDay[]) => void;
}) {
  const [weeklyDays, nonWeeklyDays] = _.partition(
    operatingDays,
    (day) => day.isWeekly,
  );
  const days = { weekly: weeklyDays, nonWeekly: nonWeeklyDays };
  const handleChange = (newDays: EditedOperatingDay[], isWeekly: boolean) => {
    if (isWeekly) {
      onChange([...newDays, ...nonWeeklyDays]);
    } else {
      onChange([...weeklyDays, ...newDays]);
    }
  };
  return (
    <>
      <WeeklyPicker
        days={days.weekly.map((d) => d.day.getDay())}
        onChange={(weeklyDays) => {
          const newWeeklyDays = weeklyDays.map((day) => {
            // Start from Sunday, Jan 4, 1970 (first Sunday in the epoch)
            const dayOfWeekUTC = new Date(Date.UTC(1970, 0, 4));

            // Shift to the correct day of the week
            dayOfWeekUTC.setUTCDate(
              dayOfWeekUTC.getUTCDate() +
                ((day + 7 - dayOfWeekUTC.getUTCDay()) % 7),
            );

            return {
              day: dayOfWeekUTC,
              isWeekly: true,
            };
          });
          handleChange(newWeeklyDays, true);
        }}
      />
      <NonWeeklyPicker
        selectedDays={days.nonWeekly.map((d) => d.day)}
        onChange={(d) => {
          const sanitizedDays = d.map((day) => {
            const utcDate = new Date(
              day.toLocaleString("en-US", { timeZone: TIMEZONE }),
            );
            return {
              day: new Date(
                Date.UTC(
                  utcDate.getFullYear(),
                  utcDate.getMonth(),
                  utcDate.getDate(),
                  utcDate.getHours(),
                  utcDate.getMinutes(),
                  utcDate.getSeconds(),
                  utcDate.getMilliseconds(),
                ),
              ),
              isWeekly: false,
            };
          });
          handleChange(sanitizedDays, false);
        }}
      />
    </>
  );
}

function WeeklyPicker({
  days,
  onChange,
}: {
  days: number[];
  onChange: (days: number[]) => void;
}) {
  const savedDays = useMemo(() => [...days].sort((a, b) => a - b), [days]);
  const [selectedDays, setSelectedDays] = useState<number[]>(() => savedDays);
  return (
    <div className=" flex flex-col gap-2 rounded-md border-2 border-black p-2">
      <p>Operating Weekly on</p>
      <div className=" flex flex-row gap-1">
        {DAY_NAMES.map((dayName, index) => (
          <button
            key={dayName}
            className={cn(
              selectedDays.includes(index)
                ? "bg-black text-white"
                : "bg-white text-black opacity-50",
              " aspect-square min-w-11 rounded-full border-2 border-black py-1",
            )}
            onClick={() => {
              const createNewList = (prev: number[]) =>
                prev.includes(index)
                  ? prev.filter((d) => d !== index)
                  : [...prev, index];
              setSelectedDays(createNewList);
              onChange(createNewList(selectedDays));
            }}
          >
            {dayName}
          </button>
        ))}
      </div>
    </div>
  );
}

function NonWeeklyPicker({
  selectedDays,
  onChange,
}: {
  selectedDays: Date[];
  onChange: (days: Date[]) => void;
}) {
  const [inputDays, setInputDays] = useState<Date[]>(() => selectedDays);
  return (
    <div className=" flex flex-col gap-2 rounded-md border-2 border-black p-2">
      <p>Operating Specifically on</p>
      <div className=" w-min rounded-sm bg-white p-2">
        <DayPicker
          mode="multiple"
          selected={inputDays}
          onSelect={(d) => {
            setInputDays(d ?? []);
            onChange(d ?? []);
          }}
          required={false}
        />
        <button
          onClick={() => {
            setInputDays([]);
            onChange([]);
          }}
          className=" rounded-sm border-2 border-red-500 px-2 py-1 text-red-500 hover:bg-red-300"
        >
          Clear Dates
        </button>
      </div>
    </div>
  );
}
