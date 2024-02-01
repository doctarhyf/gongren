import { useEffect, useRef, useState } from "react";
import { CLASS_SELECT, CLASS_SELECT_TITLE, MONTHS } from "../helpers/flow";
import { getDaysInMonth } from "../helpers/func";

export default function DateSelector({
  onDateSelected,
  defaultDate,
  defaultDateType,
  hideSelectDateType,
  horizontal,
}) {
  const DATE_TYPE = { Y: "Year", M: "Month", D: "Day" };

  const [dateType, setDateType] = useState(defaultDateType || "D");

  const ref_year = useRef();
  const ref_month = useRef();
  const ref_day = useRef();
  const ref_dtype = useRef();

  function onDateChange(e) {
    const y = Number(_(ref_year));
    const m = Number(_(ref_month));
    const d = Number(_(ref_day));

    const daysInMonth = getDaysInMonth(y, m);

    // ref_day.current.

    const newOptions = []; /* [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ]; */

    for (let x = 0; x < daysInMonth; x++) {
      newOptions.push({ value: x + 1, label: x + 1 });
    }

    // Set the new options
    ref_day.current.options.length = 0; // Clear existing options
    newOptions.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option.value;
      optionElement.text = option.label;
      ref_day.current.add(optionElement);
    });

    let date = { y: y, m: m, d: d, type: _(ref_dtype) };

    ref_year.current.value = y;
    ref_month.current.value = m;
    ref_day.current.value = d;

    if (onDateSelected === undefined)
      console.error(`onDateSelected() is not defined!`);
    onDateSelected && onDateSelected(date);
  }

  function _(ref) {
    if (ref === undefined) return;
    return ref.current.value;
  }

  console.log("da def date => ", defaultDate);

  return (
    <div className={` flex `}>
      <div
        className={` w-fit bg-red-300 ${
          hideSelectDateType ? "hidden" : "block"
        } `}
      >
        <span className={CLASS_SELECT_TITLE}> Date Type: </span>
        <select
          className={CLASS_SELECT}
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

      <div className="w-fit">
        <span className={CLASS_SELECT_TITLE}>Year: </span>
        <select className={CLASS_SELECT} ref={ref_year} onChange={onDateChange}>
          {[...Array(10)].map((it, i) => (
            <option
              selected={
                defaultDate && defaultDate.y === new Date().getFullYear() + i
              }
            >
              {new Date().getFullYear() + i}
            </option>
          ))}
        </select>
        <div className={`${dateType !== "Y" ? "block" : "hidden"}`}>
          <span className={CLASS_SELECT_TITLE}> Month: </span>
          <select
            className={CLASS_SELECT}
            ref={ref_month}
            onChange={onDateChange}
          >
            {[...Array(12)].map((it, i) => (
              <option value={i} selected={defaultDate && defaultDate.m === i}>
                {MONTHS[i]}
              </option>
            ))}
          </select>
        </div>
        <div className={` ${dateType === "D" ? "block" : "hidden"} `}>
          <span className={CLASS_SELECT_TITLE}>Date: </span>
          <select
            className={CLASS_SELECT}
            ref={ref_day}
            onChange={onDateChange}
          >
            {[...Array(31)].map((it, i) => (
              <option
                value={i + 1}
                selected={defaultDate && defaultDate.d === i + 1}
              >
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
