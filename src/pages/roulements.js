import React, { useEffect, useRef, useState } from "react";
import AgentsList from "../comps/AgentsList";
import { CLASS_BTN, CLASS_TD, MONTHS } from "../helpers/flow";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "../comps/Loading";

const init = [...Array(31).fill("-")];

function TableRLD({
  curAgent,
  curAgentRld,
  monthCode,
  error,
  onRoulementSaved,
}) {
  const [editing, setediting] = useState(false);
  const [loading, setloading] = useState(false);
  const [rld, setrld] = useState(curAgentRld);

  if (error) curAgentRld = init;

  useEffect(() => {
    if (error) {
      setrld(init);
    }
  }, []);

  function onUpdateRLD(idx, val) {
    let upd = curAgentRld;
    upd[idx] = val;
    setrld(upd);

    // console.log(upd);
  }

  async function saveRLD() {
    setloading(true);

    if (error) {
      const res = await SB.InsertItem(TABLES_NAMES.AGENTS_RLD, {
        rl: rld.join(""),
        month_code: monthCode,
      });

      console.log("res => ", res);
      onRoulementSaved({ agent_id: curAgent.id, month_code: monthCode });
      setloading(false);
      setediting(false);
      return;
    }

    SB.UpdateRoulement2(
      monthCode,
      rld.join(""),
      (s) => {
        console.log(s);
        setloading(false);
        setediting(false);
      },
      (e) => {
        console.log(e);
        setloading(false);
        setediting(false);
      }
    );
  }

  return (
    <div>
      <Loading isLoading={loading} />
      <table className="m-1">
        <thead>
          <tr>
            <td
              colSpan={curAgentRld.length + 3}
              className={CLASS_TD}
              align="center"
            >
              HORAIRE - {monthCode && MONTHS[monthCode.split("_")[3]]} /{" "}
              {monthCode && monthCode.split("_")[2]}
              {!editing && (
                <div>
                  Edit
                  <input
                    type="checkbox"
                    className="toggle toggle-xs"
                    checked={editing}
                    onChange={(e) => setediting(e.target.checked)}
                  />
                </div>
              )}
              {editing && (
                <div>
                  {" "}
                  <button className={CLASS_BTN} onClick={(e) => saveRLD()}>
                    SAVE
                  </button>
                </div>
              )}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={CLASS_TD}>Num序号</td>
            <td className={CLASS_TD}>Nom</td>
            <td className={CLASS_TD}>Mat.工号</td>
            {[...Array(curAgentRld.length)].map((d, i) => (
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
            {curAgentRld.map((rld, i) => (
              <td className={CLASS_TD} key={i}>
                {!editing && rld}
                {editing && (
                  <select
                    onChange={(e) => onUpdateRLD(i, e.target.value)}
                    className="text-xs p-0"
                    defaultValue={rld}
                  >
                    {["J", "M", "P", "N", "R", "-"].map((it, i) => (
                      <option className="text-xs" key={i}>
                        {it}
                      </option>
                    ))}
                  </select>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

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
    console.log(d);
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
