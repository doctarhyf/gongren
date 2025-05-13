import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import DateSelector from "../comps/DateSelector";
import Loading from "../comps/Loading";
import {
  HUDAgents,
  HUDBonus,
  HUDCalculsBons,
  HUDGestionSacs,
  HUDGreetings,
  HUDMonthProgress,
  HUDMyTeam,
  HUDOpsLogs,
  HUDSacsCalc,
} from "../comps/home/HUDS";
import { ACCESS_CODES } from "../helpers/flow";
import { UserHasAccessCode } from "../helpers/func";

import { GetTransForTokensArray, LANG_TOKENS } from "../helpers/lang_strings";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";

export default function Home() {
  const [, , user] = useContext(UserContext);
  const [loading, setloading] = useState(false);
  const [loads, setloads] = useState([]);
  const [agents, setagents] = useState([]);
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDay();
  const [date, setdate] = useState({ y: y, m: m });

  const [agents_by_team, set_agents_by_team] = useState(undefined);

  useEffect(() => {
    loadData();
  }, []);

  function groupAgentsByTeam(agents) {
    let equipes = { A: 0, B: 0, C: 0, D: 0 };

    agents.forEach((cur_agent) => {
      const { equipe, active, section } = cur_agent;

      Object.keys(equipes).forEach((cur_equipe) => {
        if (
          equipe === cur_equipe &&
          active === "OUI" &&
          section === "ENSACHAGE"
        )
          equipes[cur_equipe]++;
      });
    });

    console.log("Equipes => ", equipes);

    return equipes;
  }

  function groupCurMonthLoadsByTeam(loads) {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const filter = `${y}_${m}`;
    const floads = loads.filter((it) => it.code.includes(filter));

    const totals_by_team = { A: 0, B: 0, C: 0, D: 0 };

    floads.forEach((it) => {
      const { code, sacs } = it;
      const team = code[0];
      totals_by_team[team] += sacs;
    });

    const values = Object.values(totals_by_team);
    const keys = Object.keys(totals_by_team);
    const max = Math.max(...values);
    const max_idx = values.findIndex((it) => it === max);
    const max_team = keys[max_idx];

    totals_by_team.MAX = { team: max_team, sacs: max };

    //console.log(totals_by_team);
    return totals_by_team;
  }

  async function loadData() {
    setloading(true);
    const loads = await SB.LoadAllItems(TABLES_NAMES.LOADS);
    let agents = await SB.LoadAllItems(TABLES_NAMES.AGENTS);
    setloads(loads);
    setagents(agents);
    setloading(false);

    const agents_by_team = groupAgentsByTeam(agents);
    const month_loads_by_team = groupCurMonthLoadsByTeam(loads);

    let acbt = {};
    Object.entries(agents_by_team).forEach((team) => {
      const [equipe, count] = team;
      const china = equipe === month_loads_by_team.MAX.team ? 2 : 1;

      //console.log("equipe ", equipe, " congo ", count, " china ", china);
      const data = { team: equipe, congo: count, china: china };

      acbt[equipe] = data;
    });

    set_agents_by_team(acbt);
  }

  function onDateSelected(d) {
    //console.log(d);
    const clamp = { y: 2024, m: 6 };
    if (d.m < clamp.m && d.y === clamp.y) d.m = clamp;
    setdate(d);
  }

  return (
    <div className=" container md:mx-auto ">
      <Loading isLoading={loading} />

      <HUDGreetings user={user} />

      <div className="p-2 text-cente mx-auto text-center text-lg font-thin px-2">
        {GetTransForTokensArray(LANG_TOKENS.MSG_SECTION, user.lang)}
      </div>

      <div className=" flex flex-col md:flex-row justify-center items-center  ">
        <div className=" text-center font-bold  ">
          {GetTransForTokensArray(LANG_TOKENS.MSG_SHOW_MONTH_DATA, user.lang)}:
        </div>
        <DateSelector
          onDateSelected={onDateSelected}
          defaultDate={new Date()}
          defaultDateType={"M"}
        />
      </div>

      <div className=" container flex gap-4 my-4 flex-col md:flex-row flex-wrap ">
        {(UserHasAccessCode(user, ACCESS_CODES.CAN_SEE_BONUS_TOTAL) ||
          user.poste === "SUP" ||
          user.poste === "DEQ" ||
          user.poste === "INT") && (
          <HUDBonus
            loads={loads}
            agents={agents}
            date={date}
            agents_by_team={agents_by_team}
          />
        )}
        <HUDMonthProgress loads={loads} date={date} />
        <HUDMyTeam user={user} />

        {/*  <HUDSacsCalc /> */}
        {/*  <HUDCalculsBons /> */}
        <HUDAgents />
        {false && <HUDGestionSacs />}
        {(UserHasAccessCode(user, ACCESS_CODES.ROOT) ||
          user.poste === "INT") && <HUDOpsLogs />}
      </div>

      <div className="text-sm text-center">
        Code & Design by{" "}
        <b>
          <a
            className="text-sky-500  italic"
            href="https://github.com/doctarhyf"
          >
            Ir. Franvale Mutunda K. (库齐) / @doctarhyf
          </a>
        </b>
      </div>
    </div>
  );
}
