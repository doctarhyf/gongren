import React, { useEffect, useRef, useState } from "react";
import AgentsList from "../comps/AgentsList";
import { MONTHS } from "../helpers/flow";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";

import TableRLD from "../comps/TableRLD";
import { getDaysInMonth } from "../helpers/func";

export default function Roulements() {
  const [curAgent, setCurAgent] = useState({ id: -1 });
  const [roulement_data, set_roulement_data] = useState([]);
  const [curAgentRld, setCurAgentRld] = useState([]);
  const [monthCode, setMonthCode] = useState();
  const [error, seterror] = useState(false);
  const [rdk, setrdk] = useState(Math.random());
  const [lastDayDate, setLastDayDate] = useState(31);

  const ref_m = useRef();
  const ref_y = useRef();

  useEffect(() => {
    //set_roulement_data([...Array(curRld)].fill("M"));
    loadRoulement();
  }, []);

  function onRoulementSaved(d) {
    console.log("onRoulementSaved =>", d);
    seterror(false);
    setrdk(Math.random());
    loadRoulement();
  }

  async function loadRoulement() {
    let data = await SB.LoadAllItems(TABLES_NAMES.AGENTS_RLD);
    set_roulement_data(data);
    setrdk(Math.random());
    setCurAgentRld([]);
  }

  function onAgentClick(agent_data) {
    setCurAgent(agent_data);
    onDateChange(agent_data.id);
    // setrdk(Math.random());
  }

  function ParseRLD(rld) {
    return rld.rl && rld.rl.split("");
  }

  async function onDateChange(id = -1) {
    seterror(undefined);
    setCurAgentRld([]);
    const y = ref_y.current.value;
    const m = ref_m.current.value;

    const mc = `mc_${id}_${y}_${MONTHS.indexOf(m)}`;
    setMonthCode(mc);

    const data = roulement_data.find((it, i) => it.month_code === mc);

    //const init_data = GetInitRLD(mc);

    if (data === undefined) {
      seterror(`Data for "${mc}" does not exist!New Data created`);

      const init_data = await GetInitRLD(mc);
      console.log(init_data);
      setCurAgentRld({ rl: init_data, agent_id: id });
      await loadRoulement();
      seterror(null);
      setrdk(Math.random());
      return;
    }
    const rl = ParseRLD(data);
    setCurAgentRld(rl);

    setLastDayDate(getDaysInMonth(Number(y), Number(MONTHS.indexOf(m))));
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
    } else {
      console.log(res);
      alert(res.message);
    }

    return rl;
  }

  return (
    <div className="flex">
      <AgentsList key={rdk} onAgentClick={onAgentClick} curAgent={curAgent} />
      <div>
        <div>
          <div>
            Mois{" "}
            <select ref={ref_m} onChange={(e) => onDateChange(curAgent.id)}>
              {[...Array(12)].map((mois, i) => (
                <option key={i}>{MONTHS[i]}</option>
              ))}
            </select>
          </div>
          <div>
            Annee{" "}
            <select ref={ref_y} onChange={(e) => onDateChange(curAgent.id)}>
              {[...Array(10)].map((annee, i) => (
                <option key={i}>{new Date().getFullYear() + i}</option>
              ))}
            </select>
          </div>

          <div className="bg-slate-500 text-white rounded-full px-2 text-sm w-fit">
            {monthCode}
          </div>
        </div>

        <TableRLD
          onRoulementSaved={onRoulementSaved}
          error={error !== undefined}
          daysCount={lastDayDate}
          key={rdk}
          curAgent={curAgent}
          curAgentRld={curAgentRld}
          monthCode={monthCode}
        />
      </div>
    </div>
  );
}
