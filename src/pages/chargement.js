import React, { useRef, useState } from "react";
import { MONTHS } from "../helpers/flow";

function DateSelector() {
  const DATE_TYPE = { Y: "Year", M: "Month", D: "Day" };

  const [dateType, setDateType] = useState("M");

  const ref_year = useRef();
  const ref_month = useRef();
  const ref_day = useRef();

  function onDateChange(e) {
    const y = _(ref_year);
    const m = _(ref_month);
    const d = Number(_(ref_day)) + 1;

    console.log(y, m, d);
  }

  function _(ref) {
    if (ref === undefined) return;
    return ref.current.value;
  }
  return (
    <div>
      Date Type:{" "}
      <select value={dateType} onChange={(e) => setDateType(e.target.value)}>
        {["Y", "M", "D"].map((t, i) => (
          <option value={t}>{DATE_TYPE[t]}</option>
        ))}
      </select>
      <div>
        Year:{" "}
        <select ref={ref_year} onChange={onDateChange}>
          {[...Array(10)].map((it, i) => (
            <option>{2023 + i}</option>
          ))}
        </select>
        {dateType !== "Y" && (
          <>
            Month:{" "}
            <select ref={ref_month} onChange={onDateChange}>
              {[...Array(10)].map((it, i) => (
                <option value={i}>{MONTHS[i]}</option>
              ))}
            </select>
          </>
        )}
        {dateType === "D" && (
          <>
            Days:{" "}
            <select ref={ref_day} onChange={onDateChange}>
              {[...Array(31)].map((it, i) => (
                <option value={i + 1}>{i + 1}</option>
              ))}
            </select>{" "}
          </>
        )}
      </div>
    </div>
  );
}

export default function Chargement() {
  return (
    <div>
      <div>Chargement</div>
      <div>
        <DateSelector />
      </div>
    </div>
  );
}
