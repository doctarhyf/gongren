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
  const [rld, setrld] = useState(curAgentRld);
  const [init_data, set_init_data] = useState([]);

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

  async function createTimetableData() {
    if (monthCode === undefined) {
      const msg = `monthCode is ${monthCode}`;
      console.log(msg);
      alert(msg);

      return;
    }

    const [, , year, month] = monthCode.split("_");
    //const d = new Date();

    let cur_month = Number(month); // d.getMonth() - 1 < 0 ? 11 : d.getMonth() - 1;
    let next_month = Number.parseInt(cur_month) + 1;
    next_month = next_month > 11 ? 0 : next_month;

    const days_in_cur_month = getDaysInMonth(year, cur_month);
    const days_in_next_month = getDaysInMonth(year, next_month);
    const rem_days_in_cur_months = days_in_cur_month - 20;
    const rld_data = [];
    let default_data = [];

    let idx = 21;
    rld.map((it, i) => {
      let d = idx;
      idx++;

      if (d === 31) {
        idx = 1;
      }
      console.log(`current d : ${d}`);
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

    set_init_data(data);
    //console.table(data);

    //return;
    setloading(true);
    let initData = {
      rl: default_data.join(""),
      month_code: monthCode,
    };
    const res = await SB.InsertItem(TABLES_NAMES.AGENTS_RLD, initData);

    if (res === null) {
      alert("Data created!");
    } else {
      console.log(res);
      alert(res.message);
    }

    onRoulementSaved();
    setloading(false);
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
              {error && (
                <div>
                  <button
                    onClick={(e) => createTimetableData()}
                    className={CLASS_BTN}
                  >
                    NEW TITMETABLE
                  </button>
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
                {i + 20 > 31 ? i : i + 20}
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
