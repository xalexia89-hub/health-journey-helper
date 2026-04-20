import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateOfBirthInputProps {
  value: string | null | undefined; // ISO YYYY-MM-DD
  onChange: (value: string) => void;
  id?: string;
}

const MONTHS_EL = [
  "Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος",
  "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος",
];

export function DateOfBirthInput({ value, onChange, id }: DateOfBirthInputProps) {
  const parse = (v: string | null | undefined) => {
    if (!v) return { d: "", m: "", y: "" };
    const [y, m, d] = v.split("-");
    return { d: d ?? "", m: m ?? "", y: y ?? "" };
  };

  const initial = parse(value);
  const [day, setDay] = useState(initial.d);
  const [month, setMonth] = useState(initial.m);
  const [year, setYear] = useState(initial.y);

  useEffect(() => {
    const p = parse(value);
    setDay(p.d);
    setMonth(p.m);
    setYear(p.y);
  }, [value]);

  const emit = (d: string, m: string, y: string) => {
    if (d && m && y && y.length === 4) {
      const dd = d.padStart(2, "0");
      const mm = m.padStart(2, "0");
      onChange(`${y}-${mm}-${dd}`);
    } else {
      onChange("");
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="grid grid-cols-[1fr_1.6fr_1.2fr] gap-2" id={id}>
      <Input
        type="number"
        inputMode="numeric"
        placeholder="Ημέρα"
        min={1}
        max={31}
        value={day}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, "").slice(0, 2);
          setDay(v);
          emit(v, month, year);
        }}
        aria-label="Ημέρα"
      />
      <Select
        value={month}
        onValueChange={(v) => {
          setMonth(v);
          emit(day, v, year);
        }}
      >
        <SelectTrigger aria-label="Μήνας">
          <SelectValue placeholder="Μήνας" />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {MONTHS_EL.map((label, idx) => {
            const val = String(idx + 1).padStart(2, "0");
            return (
              <SelectItem key={val} value={val}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Input
        type="number"
        inputMode="numeric"
        placeholder="Έτος"
        min={1900}
        max={currentYear}
        value={year}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, "").slice(0, 4);
          setYear(v);
          emit(day, month, v);
        }}
        aria-label="Έτος"
      />
    </div>
  );
}
