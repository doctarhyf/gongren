import { useContext, useEffect, useState } from "react";
import { CLASS_SELECT, MONTHS } from "../../helpers/flow";
import { GetTransForTokenName } from "../../helpers/lang_strings";
import { UserContext } from "../../App";

export const FILTER_CONTAINER_IN_OUT = {
  ALL: "in/out",
  IN: "in",
  OUT: "out",
};

export const FILTER_TEAMS = {
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
  const [, , user] = useContext(UserContext);
  const [y, sety] = useState(new Date().getFullYear());
  const [m, setm] = useState(new Date().getMonth());
  const [inOut, setInOut] = useState(FILTER_CONTAINER_IN_OUT.ALL);
  const [team, setTeam] = useState(FILTER_TEAMS.ALL);

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
          {Object.values(FILTER_CONTAINER_IN_OUT).map((it, idx) => (
            <option value={it}>{GetTransForTokenName(it, user.lang)}</option>
          ))}
        </select>
      )}

      {(isProduction || isContainer) && (
        <select
          className={` ${CLASS_SELECT} `}
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        >
          {Object.values(FILTER_TEAMS).map((it, idx) => (
            <option value={it}>{it}</option>
          ))}
        </select>
      )}
    </div>
  );
}
