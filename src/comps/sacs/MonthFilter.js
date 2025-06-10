import { useEffect, useState } from "react";
import { CLASS_SELECT, MONTHS } from "../../helpers/flow";

export const CONTAINER_IN_OUT = {
  CONTAINER_IN_OUT: "in/out",
  IN: "in",
  OUT: "out",
};

export const TEAMS = {
  ALL: "ALL",
  A: "A",
  B: "B",
  C: "C",
};

export default function MonthFilter({
  onMonthFiltered,
  isContainer,
  isProduction,
}) {
  const [y, sety] = useState(new Date().getFullYear());
  const [m, setm] = useState(new Date().getMonth());
  const [inOut, setInOut] = useState(CONTAINER_IN_OUT.CONTAINER_IN_OUT);
  const [team, setTeam] = useState(TEAMS.ALL);
  //const [data, setdata] = useState({ y: y, m: m });

  useEffect(() => {
    const data = {
      y: parseInt(y),
      m: parseInt(m),
      inOut: inOut,
      team: team,
    };

    console.log(data);
    onMonthFiltered(data);
  }, [y, m, inOut, team]);

  return (
    <div className=" flex gap-2 my-4 ">
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

      {isContainer && (
        <select
          className={` ${CLASS_SELECT} `}
          value={inOut}
          onChange={(e) => setInOut(e.target.value)}
        >
          {Object.values(CONTAINER_IN_OUT).map((it, idx) => (
            <option value={it}>{it}</option>
          ))}
        </select>
      )}

      {isProduction && (
        <select
          className={` ${CLASS_SELECT} `}
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        >
          {Object.values(TEAMS).map((it, idx) => (
            <option value={it}>{it}</option>
          ))}
        </select>
      )}
    </div>
  );
}
