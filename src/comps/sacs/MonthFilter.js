import { useEffect, useState } from "react";
import { CLASS_SELECT, MONTHS } from "../../helpers/flow";

export default function MonthFilter({ onMonthFiltered }) {
  const [y, sety] = useState(new Date().getFullYear());
  const [m, setm] = useState(new Date().getMonth());
  const [data, setdata] = useState({ y: y, m: m });

  useEffect(() => {
    onMonthFiltered({ y: parseInt(y), m: parseInt(m) });
  }, [y, m]);

  return (
    <div className=" flex gap-2 ">
      <select
        className={` ${CLASS_SELECT} `}
        value={y}
        onChange={(e) => sety(e.target.value)}
      >
        {new Array(5).fill(0).map((it, idx) => (
          <option value={new Date().getFullYear() + idx}>
            {new Date().getFullYear() + idx}
          </option>
        ))}
      </select>
      <select
        className={` ${CLASS_SELECT} `}
        value={m}
        onChange={(e) => setm(e.target.value)}
      >
        {new Array(12).fill(0).map((it, idx) => (
          <option value={idx + 1}>{MONTHS[idx]}</option>
        ))}
      </select>
    </div>
  );
}
