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

function FormAddingRow({ onDataUpdate }) {
  const [date, setdate] = useState();
  const [team, setteam] = useState("A");
  const [shift, setshift] = useState("M");
  const [sacs, setsacs] = useState(0);
  const [, , user, setuser] = useContext(UserContext);

  useEffect(() => {
    const data = {
      date: date,
      team: team,
      shift: shift,
      sacs: sacs,
    };

    onDataUpdate(data);
  }, [date, team, shift, sacs]);
  return (
    <tr>
      <td className="  border border-slate-500 p-1 text-end ">
        <input
          type="date"
          value={date}
          onChange={(e) => setdate(e.target.value)}
        />
      </td>
      <td className="  border border-slate-500 p-1 text-end ">
        {["A", "B", "C", "D"].includes(user.equipe) ? (
          user.equipe
        ) : (
          <select onChange={(e) => setteam(e.target.value)}>
            {["A", "B", "C", "D"].map((op) => (
              <option selected={op === team} value={op}>
                {op}
              </option>
            ))}
          </select>
        )}
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
          className="border border-purple-700 rounded-md"
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
  const [newdata, setnewdata] = useState();

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
      console.log("will save data ...", newdata);
    } else {
      console.log("will toggle adding to yes");
    }
  }

  function onDataUpdate(nd) {
    console.log("nd", nd);
    setnewdata(nd);
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
              <FormAddingRow onDataUpdate={onDataUpdate} />
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

        {adding && (
          <div role="alert" className="alert my-4 alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>
              Veuillez insert toutes donnees sans aucune erreur svp! votre prime
              en depend!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
