"use client";

import type { BusOperatingDay } from "@prisma/client";
import _ from "lodash";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "../../../lib/utils";

type EditedOperatingDay = Partial<BusOperatingDay> &
  Pick<BusOperatingDay, "day" | "isWeekly">;

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
        days={days.weekly.map((d) => d.day.getUTCDay())}
        onChange={(weeklyDays) => {
          const newWeeklyDays = weeklyDays.map((day) => {
            // Start from Sunday, Jan 4, 1970 (first Sunday in the epoch)
            // Create the base date in the New York time zone
            const baseSunday = DateTime.fromObject(
              { year: 1970, month: 1, day: 4 },
              { zone: "America/New_York" },
            );
            // Add the offset, ensuring the resulting date is still in New York time zone
            const dayOfWeek = baseSunday.plus({ days: day % 7 });
            return {
              day: dayOfWeek.toUTC().toJSDate(),
              isWeekly: true,
            };
          });
          handleChange(newWeeklyDays, true);
        }}
      />
      <NonWeeklyPicker
        selectedDays={days.nonWeekly.map((d) => d.day)}
        onChange={(d) => {
          const sanitizedDays = d.map((inputDate) => ({
            day: inputDate,
            isWeekly: false,
          }));
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
    <div className="border-primary flex flex-col gap-2 rounded-md border-2 p-2">
      <p>Operating Weekly on</p>
      <div className="flex flex-row gap-1">
        {DAY_NAMES.map((dayName, index) => (
          <button
            key={dayName}
            className={cn(
              selectedDays.includes(index)
                ? "bg-primary text-primary-foreground"
                : "opacity-50",
              "border-primary aspect-square min-w-11 rounded-full border-2 py-1",
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
  const defaultClassNames = getDefaultClassNames();
  const [inputDays, setInputDays] = useState<Date[]>(() => selectedDays);
  return (
    <div className="border-primary flex flex-col gap-2 rounded-md border-2 p-2">
      <p>Operating Specifically on</p>
      <div className="bg-item-background w-min rounded-sm p-2">
        <DayPicker
          animate
          mode="multiple"
          selected={inputDays}
          onSelect={(d) => {
            setInputDays(d ?? []);
            onChange(d ?? []);
          }}
          required={false}
          classNames={{
            today: `${defaultClassNames.today} !text-accent`,
            chevron: `${defaultClassNames.chevron} !fill-accent`,
          }}
        />
        <button
          onClick={() => {
            setInputDays([]);
            onChange([]);
          }}
          className="rounded-sm border-2 border-red-500 px-2 py-1 text-red-500 hover:bg-red-300"
        >
          Clear Dates
        </button>
      </div>
    </div>
  );
}
