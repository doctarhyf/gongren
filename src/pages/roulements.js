import React, { useContext, useEffect, useRef, useState } from "react";
import AgentsList from "../comps/AgentsList";
import {
  ACCESS_CODES,
  CLASS_INPUT_TEXT,
  CLASS_SELECT,
  CLASS_SELECT_TITLE,
  CLASS_TD,
  MONTHS,
} from "../helpers/flow";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";

import TableRLD from "../comps/TableRLD";
import {
  GenCurrentMonthCode,
  getDaysInMonth,
  getRouelemtDaysLetters,
  UserHasAccessCode,
} from "../helpers/func";
import ItemNotSelected from "../comps/ItemNotSelected";
import DateSelector from "../comps/DateSelector";
import GetRoulemenDaysData from "../helpers/GetRoulemenDaysData.mjs";
import TableRoulement from "../comps/TableRoulement";
import { UserContext } from "../App";

export default function Roulements() {
  const [curAgent, setCurAgent] = useState();
  const [agentsRoulementData, setAgentsRoulementData] = useState([]);
  const [curAgentRld, setCurAgentRld] = useState([]);
  const [monthCode, setMonthCode] = useState();
  const [error, seterror] = useState(false);
  const [rdk, setrdk] = useState(Math.random());
  const [lastDayDate, setLastDayDate] = useState(31);
  const [daysLetters, setDaysLetters] = useState([]);
  const [, , user] = useContext(UserContext);

  const ref_m = useRef();
  const ref_y = useRef();

  useEffect(() => {
    //set_roulement_data([...Array(curRld)].fill("M"));
    loadRoulement(user);
  }, [user]);

  function onRoulementSaved(d) {
    console.log("onRoulementSaved =>", d);
    seterror(false);
    setrdk(Math.random());
    loadRoulement();
  }

  async function loadRoulement(user) {
    let data = await SB.LoadAllItems(TABLES_NAMES.AGENTS_RLD);

    setAgentsRoulementData(data);
    setrdk(Math.random());
    setCurAgentRld([]);
  }

  function onAgentClick(agent_data) {
    setCurAgent(agent_data);
  }

  function onTeamClick(agents_data) {
    console.log(agents_data);
  }

  function ParseRLD(rld) {
    return rld.rl && rld.rl.split("");
  }

  async function onDateChange(id = -1) {
    seterror(undefined);
    setCurAgentRld([]);

    const y = Number(ref_y.current?.value) || new Date().getFullYear();
    const m_name = ref_m.current?.value || MONTHS[new Date().getMonth()];
    const m = MONTHS.indexOf(m_name);

    const mc = `mc_${id}_${y}_${m}`;
    setMonthCode(mc);

    const data = agentsRoulementData.find((it, i) => it.month_code === mc);

    //const init_data = GetInitRLD(mc);

    if (data === undefined) {
      seterror(`Data for "${mc}" does not exist!New Data created`);

      const init_data = await GetInitRLD(mc);

      setCurAgentRld({ rl: init_data, agent_id: id });
      await loadRoulement();
      seterror(null);
      setrdk(Math.random());

      setLastDayDate(getDaysInMonth(Number(y), Number(MONTHS.indexOf(m_name))));
      const dl = getRouelemtDaysLetters(y, m + 1);

      setDaysLetters(dl);

      return;
    }
    const rl = ParseRLD(data);
    setCurAgentRld(rl);

    setLastDayDate(getDaysInMonth(Number(y), Number(MONTHS.indexOf(m_name))));
    const dl = getRouelemtDaysLetters(y, m + 1);

    setDaysLetters(dl);
  }

  async function GetInitRLD(monthCode) {
    if (monthCode === undefined) {
      const msg = `monthCode is ${monthCode}`;
      console.log(msg);
      alert(msg);

      return;
    }

    const [mc, id, year, month] = monthCode.split("_");
    //const d = new Date();

    let cur_month = Number(month); // d.getMonth() - 1 < 0 ? 11 : d.getMonth() - 1;
    let next_month = Number.parseInt(cur_month) + 1;
    next_month = next_month > 11 ? 0 : next_month;

    const days_in_cur_month = getDaysInMonth(year, cur_month);
    const days_in_next_month = getDaysInMonth(year, next_month);
    const rem_days_in_cur_months = days_in_cur_month - 20;
    const days_tot = rem_days_in_cur_months + 20;
    const rld = [...Array(days_tot).fill("-")];
    const rld_data = [];
    let default_data = [];

    let daysCountInMonth = getDaysInMonth(year, month);
    setLastDayDate(daysCountInMonth);
    let idx = 21;
    rld.map((it, i) => {
      let d = idx;

      if (d === daysCountInMonth) {
        idx = 1;
      }
      // console.log(`current d : ${d}`);
      rld_data.push({ id: i, date: d, data: "-" });
      default_data.push("-");
    });

    const data = {
      cur_month: cur_month,
      next_month: next_month,
      days_in_cur_month: days_in_cur_month,
      days_in_next_month: days_in_next_month,
      rem_days_in_cur_months: rem_days_in_cur_months,
      rld_data: rld_data,
    };

    const rl = default_data.join("");
    console.log(rld_data);
    let initData = {
      rl: rl,
      month_code: monthCode,
      agent_id: id,
    };
    const res = await SB.InsertItem(TABLES_NAMES.AGENTS_RLD, initData);

    if (res === null) {
      alert("Data created!");
      loadRoulement();
    } else {
      console.log(res);
      alert(res.message);
    }

    return rl;
  }

  const userIsRoot = UserHasAccessCode(user, ACCESS_CODES.ROOT);
  const userCanEditAllRoulement = UserHasAccessCode(
    user,
    ACCESS_CODES.CAN_EDIT_ALL_ROULEMENT
  );
  let { matricule } = user;

  matricule = !userIsRoot || !userCanEditAllRoulement ? matricule : undefined;

  return (
    <div className="flex">
      <AgentsList
        key={rdk}
        onAgentClick={onAgentClick}
        onTeamClick={onTeamClick}
        curAgent={curAgent}
        onlyShowCurrentAgent={matricule}
      />
      <div id="sc" className=" bg-black/50 p-4 overflow-scroll  ">
        <TableRoulement agentData={curAgent} />
      </div>
    </div>
  );
}
