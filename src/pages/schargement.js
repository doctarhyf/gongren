import { useContext, useEffect, useState } from "react";
import DateSelector from "../comps/DateSelector";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import { AddLeadingZero, GetDateParts } from "../helpers/func";
import { UserContext } from "../App";
import { ACCESS_CODES, SHIFT_HOURS_ZH, SHIFTS_ZH } from "../helpers/flow";
import Loading from "../comps/Loading";
import ActionButton from "../comps/ActionButton";
import plus from "../img/plus.png";
import save from "../img/save.png";

function FormAddingRow() {
  const [team, setteam] = useState("A");
  const [shift, setshift] = useState("M");
  const [sacs, setsacs] = useState(0);
  return (
    <tr>
      <td className="  border border-slate-500 p-1 text-end ">
        <input type="date" />
      </td>
      <td className="  border border-slate-500 p-1 text-end ">
        <select onChange={(e) => setteam(e.target.value)}>
          {["A", "B", "C", "D", "ALL"].map((op) => (
            <option selected={op === team} value={op}>
              {op}
            </option>
          ))}
        </select>
      </td>
      <td className="  border border-slate-500 p-1 text-end ">
        <select onChange={(e) => setshift(e.target.value)}>
          {Object.values(SHIFT_HOURS_ZH).map((shift) => (
            <option selected={shift[3] === shift} value={shift[3]}>
              {shift[3]} - {shift[2]}
            </option>
          ))}
        </select>
      </td>
      <td className="  border border-slate-500 p-1 text-end ">
        <input
          type="number"
          value={sacs}
          onChange={(e) => setsacs(parseInt(e.target.value))}
        />
      </td>
      <td className="  border border-slate-500 p-1 text-end ">{sacs / 20}</td>
      <td className="  border border-slate-500 p-1 text-end ">
        {sacs / 20 - 600 > 0 ? (sacs / 20 - 600).toFixed(2) : 0}
      </td>
    </tr>
  );
}

export default function SuiviChargement() {
  const [mcode, setmcode] = useState();
  const [loading, setloading] = useState(false);
  const [loads, setloads] = useState([]);
  const [loadsf, setloadsf] = useState([]);
  const [, , user, setuser] = useContext(UserContext);
  const [team, setteam] = useState("A");
  const [bonustot, setbonustot] = useState(0);
  const [adding, setadding] = useState(false);

  useEffect(() => {
    loadData();
    const parts = GetDateParts("all");
    console.log("parts", parts);
    const curmcode = `${parts.year}_${parts.month}`;
    console.log(curmcode);
    setmcode(curmcode);
  }, []);

  useEffect(() => {
    setloadsf(filterLoads(loads, mcode, team));
    console.log(user);
  }, [loads, mcode, team]);

  async function loadData() {
    setloading(true);
    const data = await SB.LoadAllItems(TABLES_NAMES.LOADS, "created_at", true);

    setloads(data);
    setloadsf(filterLoads(data, mcode, team));
    console.log(data);
    setloading(false);
  }

  function filterLoads(loads, mcode, team) {
    setbonustot(0);
    let tot = 0;
    if (!mcode) {
      console.error(
        `mcode is undefined, cant filter with undefined month code! ${mcode}`
      );

      return loads;
    }
    if (loads.length === 0) return [];
    let df = loads.filter((ld) =>
      ld.code.includes(mcode) && ["A", "B", "C", "D"].includes(team)
        ? ld.code[0] === team
        : ld.code.includes(mcode)
    );

    df = df.map((dfi) => {
      const [t, s, y, m, d] = dfi.code.split("_");
      console.log("dfi", dfi);
      dfi.meta = {
        date: `${AddLeadingZero(d)}/${AddLeadingZero(m)}/${y}`,
        shift: `${s} : ${SHIFT_HOURS_ZH[s][2]}`,
        team: t,

        bonus: dfi.sacs / 20 - 600 > 0 ? dfi.sacs / 20 - 600 : 0,
      };

      tot += dfi.meta.bonus;

      return dfi;
    });

    setbonustot(tot);

    console.log("filtered loads", df);
    return df;
  }

  function onDateSelected(date) {
    console.log(date);
    const { d, m, y } = date;
    const code = `${y}_${m}`;
    setmcode(code);
  }

  function onClick(e) {
    setadding(!adding);

    if (adding) {
      console.log("will save data ...");
    } else {
      console.log("will toggle adding to yes");
    }
  }

  return (
    <div className=" container  ">
      <div>
        Suivi Chargement{" "}
        <span>
          <Loading isLoading={loading} />
        </span>
      </div>
      <DateSelector onDateSelected={onDateSelected} />
      <div className="flex">
        <div className=" font-bold">EQUIPE</div>
        <select onChange={(e) => setteam(e.target.value)}>
          {["A", "B", "C", "D", "ALL"].map((op) => (
            <option selected={op === team} value={op}>
              {op}
            </option>
          ))}
        </select>
      </div>

      <ActionButton
        icon={adding ? save : plus}
        title={adding ? "Save" : "Nouveau Rapport"}
        onClick={onClick}
      />

      <div>
        <table class="table-auto">
          <thead>
            <tr>
              <th className="border border-slate-500 p-1">Date</th>
              <th className="border border-slate-500 p-1">EQ.</th>
              <th className="border border-slate-500 p-1">Shift</th>
              <th className="border border-slate-500 p-1">Scs</th>
              <th className="border border-slate-500 p-1">T</th>
              <th className="border border-slate-500 p-1">BNS</th>
            </tr>
          </thead>
          {adding ? (
            <tbody>
              <FormAddingRow />
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td className="  border border-slate-500 p-1 text-end "></td>
                <td className="  border border-slate-500 p-1 text-end "></td>
                <td className="  border border-slate-500 p-1 text-end "></td>
                <td className="  border border-slate-500 p-1 text-end "></td>
                <td className="  border border-slate-500 p-1 text-end ">
                  T. Bonus
                </td>
                <td className="  border border-slate-500 p-1 text-end ">
                  {bonustot}
                </td>
              </tr>
              {loadsf.map((ld) => (
                <tr>
                  <td className="  border border-slate-500 p-1 text-end ">
                    {ld.meta?.date}
                  </td>
                  <td className="  border border-slate-500 p-1 text-end ">
                    {ld.meta?.team}
                  </td>
                  <td className="  border border-slate-500 p-1 text-end ">
                    {ld.meta?.shift}
                  </td>
                  <td className="  border border-slate-500 p-1 text-end ">
                    {ld.sacs}
                  </td>
                  <td className="  border border-slate-500 p-1 text-end ">
                    {parseFloat(ld.sacs) / 20}
                  </td>
                  <td className="  border border-slate-500 p-1 text-end ">
                    {parseFloat(ld.sacs) / 20 > 600 ? (
                      <span className=" font-serif text-sky-700 font-bold ">
                        {parseFloat(ld.sacs) / 20 - 600}
                      </span>
                    ) : (
                      0
                    )}
                  </td>
                </tr>
              ))}{" "}
              <tr>
                <td className="  border border-slate-500 p-1 text-end "></td>
                <td className="  border border-slate-500 p-1 text-end "></td>
                <td className="  border border-slate-500 p-1 text-end "></td>
                <td className="  border border-slate-500 p-1 text-end "></td>
                <td className="  border border-slate-500 p-1 text-end ">
                  T. Bonus
                </td>
                <td className="  border border-slate-500 p-1 text-end ">
                  {bonustot}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
