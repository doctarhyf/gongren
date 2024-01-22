import { useRef, useState } from "react";
import { MONTHS } from "../helpers/flow";

export default function DateSelector({ onDateSelected, defaultDate }) {
  const DATE_TYPE = { Y: "Year", M: "Month", D: "Day" };

  const [dateType, setDateType] = useState("D");

  const ref_year = useRef();
  const ref_month = useRef();
  const ref_day = useRef();
  const ref_dtype = useRef();

  function onDateChange(e) {
    const y = Number(_(ref_year));
    const m = Number(_(ref_month));
    const d = Number(_(ref_day));

    let date = { y: y, m: m, d: d, type: _(ref_dtype) };

    if (onDateSelected === undefined)
      console.error(`onDateSelected() is not defined!`);
    onDateSelected && onDateSelected(date);
  }

  function _(ref) {
    if (ref === undefined) return;
    return ref.current.value;
  }
  return (
    <div>
      <div>
        Date Type:{" "}
        <select
          ref={ref_dtype}
          value={dateType}
          onChange={(e) => {
            setDateType((old) => {
              onDateChange(e.target.value);

              return e.target.value;
            });
          }}
        >
          {["Y", "M", "D"].map((t, i) => (
            <option value={t}>{DATE_TYPE[t]}</option>
          ))}
        </select>
      </div>

      <div>
        Year:{" "}
        <select ref={ref_year} onChange={onDateChange}>
          {[...Array(10)].map((it, i) => (
            <option>{2023 + i}</option>
          ))}
        </select>
        <div className={`${dateType !== "Y" ? "block" : "hidden"}`}>
          Month:{" "}
          <select ref={ref_month} onChange={onDateChange}>
            {[...Array(12)].map((it, i) => (
              <option value={i}>{MONTHS[i]}</option>
            ))}
          </select>
        </div>
        <div className={` ${dateType === "D" ? "block" : "hidden"} `}>
          Days:{" "}
          <select ref={ref_day} onChange={onDateChange}>
            {[...Array(31)].map((it, i) => (
              <option value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
