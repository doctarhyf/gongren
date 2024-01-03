import React, { useEffect, useRef, useState } from "react";
import AgentsList from "../comps/AgentsList";
import { CLASS_BTN, CLASS_TD, MONTHS } from "../helpers/flow";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "../comps/Loading";
import TableRLD from "../comps/TableRLD";

export default function Roulements() {
  const [curAgent, setCurAgent] = useState({ id: -1 });
  const [roulement_data, set_roulement_data] = useState([]);
  const [curAgentRld, setCurAgentRld] = useState([]);
  const [monthCode, setMonthCode] = useState();
  const [error, seterror] = useState(false);
  const [rdk, setrdk] = useState(Math.random());

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
  }

  function onAgentClick(agent_data) {
    setCurAgent(agent_data);
    onDateChange(agent_data.id);
    setrdk(Math.random());
  }

  function ParseRLD(rld) {
    return rld.rl && rld.rl.split("");
  }

  function onDateChange(id = -1) {
    seterror(undefined);
    setCurAgentRld([]);
    const y = ref_y.current.value;
    const m = ref_m.current.value;

    const mc = `mc_${id}_${y}_${MONTHS.indexOf(m)}`;
    setMonthCode(mc);

    const data = roulement_data.find((it, i) => it.month_code === mc);

    console.log(data, mc);

    if (data === undefined) {
      seterror(`Data for "${mc}" does not exist!`);
      return;
    }
    const rl = ParseRLD(data);
    setCurAgentRld(rl);

    console.log(rl);
  }

  return (
    <div className="flex">
      <AgentsList onAgentClick={onAgentClick} curAgent={curAgent} />
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
          key={rdk}
          curAgent={curAgent}
          curAgentRld={curAgentRld}
          monthCode={monthCode}
        />
        {error && (
          <div className="bg-red-500 text-white px-1 rounded-full text-xs text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
