import { useEffect, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "./Loading";
import { CLASS_BTN, CLASS_TD, MONTHS } from "../helpers/flow";
import { getDaysInMonth } from "../helpers/func";

const init = [...Array(31).fill("-")];

export default function TableRLD({
  curAgent,
  curAgentRld,
  monthCode,
  error,
  onRoulementSaved,
}) {
  const [editing, setediting] = useState(false);
  const [loading, setloading] = useState(false);
  const [roulementData, setRoulementData] = useState(curAgentRld);
  const [init_data, set_init_data] = useState([]);
  const [showHeader, setShowHeader] = useState(true);
  const [showDates, setShowDates] = useState(true);

  if (error) curAgentRld = init;

  useEffect(() => {
    if (error) {
      //    setRoulementData(init);
      //  console.log("curAgentRld => ", curAgentRld);
      //console.log("init => ", init);
    }
  }, []);

  function onUpdateRLD(idx, val) {
    let upd = curAgentRld;
    upd[idx] = val;
    setRoulementData(upd);
  }

  async function saveRLD() {
    setloading(true);

    if (error) {
      const res = await SB.InsertItem(TABLES_NAMES.AGENTS_RLD, {
        rl: roulementData.join(""),
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
      roulementData.join(""),
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
        {showHeader && (
          <thead>
            <tr>
              <td
                colSpan={curAgentRld.length + 3}
                className={CLASS_TD}
                /*  align="center" */
              >
                HORAIRE - {monthCode && MONTHS[monthCode.split("_")[3]]} /{" "}
                {monthCode && monthCode.split("_")[2]}
                {!error && !editing && (
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
                {/* {error && (
                <div>
                  <button
                    onClick={(e) => createTimetableData()}
                    className={CLASS_BTN}
                  >
                    NEW TITMETABLE
                  </button>
                </div>
              )} */}
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
        )}

        <tbody>
          {showDates && (
            <tr>
              <td className={CLASS_TD}>Num序号</td>
              <td className={CLASS_TD}>Nom</td>
              <td className={CLASS_TD}>Mat.工号</td>
              {[...Array(curAgentRld.length)].map((d, i) => (
                <td key={i} className={CLASS_TD}>
                  {i + 20 > 31 ? i : i + 20}
                </td>
              ))}
            </tr>
          )}

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
          <td className="">
            <div>
              {" "}
              Nb. Abs.:<b>0</b>
            </div>
            <div>
              {" "}
              Nb. Mal.:<b>0</b>
            </div>
          </td>
        </tbody>
      </table>
    </div>
  );
}
