import { useContext, useRef, useState } from "react";
import { CLASS_SELECT, CLASS_SELECT_TITLE, MONTHS } from "../helpers/flow";
import { getDaysInMonth, ParseDate } from "../helpers/func";
import { UserContext } from "../App";
import { GetTransForToken, LANG_TOKENS } from "../helpers/lang_strings";

export default function DateSelector({
  onDateSelected,
  defaultDate = new Date(),
  defaultDateType = "M",
  hideSelectDateType = true,
  horizontal,
}) {
  if (defaultDate && defaultDate.getDay) {
    defaultDate = ParseDate(defaultDate, false); //
    //alert(JSON.stringify(defaultDate));
  }

  const DATE_TYPE = { Y: "Year", M: "Month", D: "Day" };

  const [dateType, setDateType] = useState(defaultDateType || "D");
  const [, , user, setuser] = useContext(UserContext);

  const ref_year = useRef();
  const ref_month = useRef();
  const ref_day = useRef();
  const ref_dtype = useRef();

  function onDateChange(e) {
    const y = Number(_(ref_year));
    const m = Number(_(ref_month));
    const d = Number(_(ref_day));

    const daysInMonth = getDaysInMonth(y, m);

    const newOptions = [];

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

  return (
    <div className={` flex `}>
      <div className={` w-fit  ${hideSelectDateType ? "hidden" : "block"} `}>
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

      <div className="w-fit md:flex">
        <div>
          <span className={CLASS_SELECT_TITLE}>
            {GetTransForToken(LANG_TOKENS.YEAR, user.lang)}:
          </span>
          <select
            className={CLASS_SELECT}
            ref={ref_year}
            onChange={onDateChange}
          >
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
        </div>

        <div className={`${dateType !== "Y" ? "block" : "hidden"}`}>
          <span className={CLASS_SELECT_TITLE}>
            {GetTransForToken(LANG_TOKENS.MONTH, user.lang)}:
          </span>
          <select
            className={CLASS_SELECT}
            ref={ref_month}
            onChange={onDateChange}
          >
            {[...Array(12)].map((it, i) => (
              <option
                value={i}
                selected={defaultDate && parseInt(defaultDate.m) === i}
              >
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
