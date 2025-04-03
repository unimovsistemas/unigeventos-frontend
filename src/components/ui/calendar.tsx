/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface CalendarPropsSingle {
  mode: "single";
  selected?: Date;
  onSelect: (date?: Date) => void;
}

interface CalendarPropsMultiple {
  mode: "multiple";
  selected?: Date[];
  onSelect: (dates?: Date[]) => void;
}

interface CalendarPropsRange {
  mode: "range";
  selected?: { from: Date; to?: Date };
  onSelect: (range?: { from: Date; to?: Date }) => void;
  required?: boolean;
}

type CalendarProps = CalendarPropsSingle | CalendarPropsMultiple | CalendarPropsRange;

export function Calendar(props: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState(props.selected);

  const handleSelect = (date: any) => {
    setSelectedDate(date);
    props.onSelect(date);
  };

  return (
    <>
      {props.mode === "single" && (
        <DayPicker
          mode="single"
          selected={selectedDate as Date}
          onSelect={handleSelect}
          className="p-2 bg-white rounded-lg shadow-md border border-gray-300"
        />
      )}

      {props.mode === "multiple" && (
        <DayPicker
          mode="multiple"
          selected={selectedDate as Date[]}
          onSelect={handleSelect}
          className="p-2 bg-white rounded-lg shadow-md border border-gray-300"
        />
      )}

      {props.mode === "range" && (
        <DayPicker
          mode="range"
          selected={selectedDate as { from: Date; to?: Date }}
          onSelect={handleSelect}
          className="p-2 bg-white rounded-lg shadow-md border border-gray-300"
          required
        />
      )}
    </>
  );
}
