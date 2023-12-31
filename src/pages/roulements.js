import React, { useEffect, useRef, useState } from "react";
import AgentsList from "../comps/AgentsList";
import { CLASS_TD, MONTHS } from "../helpers/flow";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";

export default function Roulements() {
  const [curAgent, setCurAgent] = useState({ id: -1 });
  const [roulement_data, set_roulement_data] = useState([]);
  const [curRld, setCurRld] = useState([]);
  const [monthCode, setMonthCode] = useState();

  const ref_m = useRef();
  const ref_y = useRef();

  useEffect(() => {
    //set_roulement_data([...Array(curRld)].fill("M"));
    loadRoulement();
  }, []);

  async function loadRoulement() {
    let data = await SB.LoadAllItems(TABLES_NAMES.AGENTS_RLD);
    set_roulement_data(data);
  }

  function onAgentClick(agent_data) {
    setCurAgent(agent_data);
    onDateChange(agent_data.id);
  }

  function ParseRLD(rld) {
    return rld.rl && rld.rl.split("");
  }

  function onDateChange(id = -1) {
    setCurRld([]);
    const y = ref_y.current.value;
    const m = ref_m.current.value;

    const mc = `mc_${id}_${y}_${MONTHS.indexOf(m)}`;
    setMonthCode(mc);

    const data = roulement_data.find((it, i) => it.month_code === mc);

    if (data === undefined) return;

    const rl = ParseRLD(data);
    setCurRld(rl);
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
                <option>{MONTHS[i]}</option>
              ))}
            </select>
          </div>
          <div>
            Annee{" "}
            <select ref={ref_y} onChange={(e) => onDateChange(curAgent.id)}>
              {[...Array(10)].map((annee, i) => (
                <option>{new Date().getFullYear() + i}</option>
              ))}
            </select>
          </div>

          <div className="bg-slate-500 text-white rounded-full px-2 text-sm w-fit">
            {monthCode}
          </div>
        </div>

        <table className="m-1">
          <thead>
            <tr>
              <td
                colSpan={curRld.length + 3}
                className={CLASS_TD}
                align="center"
              >
                HORAIRE - {monthCode && MONTHS[monthCode.split("_")[3]]} /{" "}
                {monthCode && monthCode.split("_")[2]}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={CLASS_TD}>Num序号</td>
              <td className={CLASS_TD}>Nom</td>
              <td className={CLASS_TD}>Mat.工号</td>
              {[...Array(curRld.length)].map((d, i) => (
                <td key={i} className={CLASS_TD}>
                  {i + 20}
                </td>
              ))}
            </tr>
            <tr>
              <td className={CLASS_TD}>{curAgent.id}</td>
              <td className={CLASS_TD}>
                {curAgent && curAgent.nom} - {curAgent && curAgent.postnom}
              </td>
              <td className={CLASS_TD}>{curAgent && curAgent.matricule}</td>
              {curRld.map((rld, i) => (
                <td className={CLASS_TD} key={i}>
                  {rld}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
