import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import ActionButton from "../comps/ActionButton";
import DateSelector from "../comps/DateSelector";
import Loading from "../comps/Loading";
import gck from "../img/gck.png";
import copy from "../img/copy.png";
import wechat from "../img/wechat.png";
import { LOG_OPERATION, SHIFT_HOURS_ZH, SUPERVISORS } from "../helpers/flow";
import {
  AddLeadingZero,
  customSortShifts,
  GetDateParts,
  UpdateOperationsLogs,
} from "../helpers/func";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import multiply from "../img/multiply.png";
import plus from "../img/plus.png";
import save from "../img/save.png";
import pdf from "../img/pdf.png";
import reload from "../img/reload.png";

const TEAMS = ["A", "B", "C", "D"];

function FormAddLoad({ onDataUpdate }) {
  const [, , user, setuser] = useContext(UserContext);
  const [date, setdate] = useState(GetDateParts("input"));
  const [team, setteam] = useState(
    TEAMS.includes(user.equipe) ? user.equipe : "A"
  );
  const [shift, setshift] = useState("M");
  const [sacs, setsacs] = useState(0);
  const [camions, setcamions] = useState(0);
  const [dechires, setdechires] = useState(0);

  //alert(user.equipe);

  useEffect(() => {
    prepData(date, team, shift, sacs);
  }, []);

  useEffect(() => {
    prepData(date, team, shift, sacs, camions, dechires);
  }, [date, team, shift, sacs, camions, dechires]);

  function prepData(date, team, shift, sacs, camions, dechires) {
    const parts = GetDateParts("input", new Date(date));
    const [year, month, day] = parts.split("-");
    const code = `${team}_${shift}_${year}_${parseInt(month) - 1}_${parseInt(
      day
    )}`; //"A_M_2024_7_1",

    const load = {
      sacs: sacs,
      retours: 0,
      ajouts: 0,
      code: code,
      prob_machine: null,
      prob_courant: null,
      autre: null,
      camions: camions,
      dechires: dechires,
      sacs_adj: 0,
    };

    console.log("load", load);
    onDataUpdate(load);
  }

  return (
    <tr className="  ">
      <td className="  border border-slate-500 p-1 text-end ">
        <input
          defaultValue={GetDateParts("input")}
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
              {shift[3]}/{shift[2]}
            </option>
          ))}
        </select>
      </td>
      <td className="  border border-slate-500 p-1 text-end ">
        <input
          className="border-2 max-w-16 border-yellow-500 rounded-md"
          type="number"
          value={sacs}
          onChange={(e) => setsacs(parseInt(e.target.value))}
        />
      </td>

      <td className="  border border-slate-500 p-1 text-end ">
        <input
          min={0}
          max={50}
          className="border-2 max-w-16 border-yellow-500 rounded-md"
          type="number"
          value={camions}
          onChange={(e) => setcamions(parseInt(e.target.value))}
        />
      </td>
      <td className="  border border-slate-500 p-1 text-end ">
        <input
          className="border-2 max-w-16 border-yellow-500 rounded-md"
          type="number"
          value={dechires}
          onChange={(e) => setdechires(parseInt(e.target.value))}
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
  const [team, setteam] = useState("ALL");
  const [bonustot, setbonustot] = useState(0);
  const [adding, setadding] = useState(false);
  const [newdata, setnewdata] = useState();

  /*return `•EMBALLAGE CIMENT水泥包装
${y}年${Number(m) + 1}月${d}日
Équipe班：${team}
Superviseur班长: @${nom} ${zh} 
     •${shift_data}
装车${camions}辆/Camions Chargés 
袋子用${sacs}个/Sacs Utilisés 
共计${tonnage.toFixed(2)}吨/Tonne 
撕裂的袋子${dechires}个/Sacs déchirés`;
  } */

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
    setloads([]);
    setloadsf([]);
    const data = await SB.LoadAllItems(TABLES_NAMES.LOADS, "created_at", true);
    console.log(data[0]);
    setloads(data);
    setloadsf(filterLoads(data, mcode, team));
    console.log(data);
    setloading(false);
  }

  function filterLoads(loads, mcode, team) {
    setbonustot(0);
    let tot = 0;
    let finalfilteredloadsgroupnyday = {};

    if (!mcode) {
      console.error(
        `mcode is undefined, cant filter with undefined month code! ${mcode}`
      );

      return loads;
    }
    if (loads.length === 0) return [];
    let filteredloads = loads.filter((ld) =>
      ld.code.includes(mcode) && ["A", "B", "C", "D"].includes(team)
        ? ld.code[0] === team
        : ld.code.includes(mcode)
    );

    //df = df.sort(customSortShifts);

    filteredloads = filteredloads.map((filterloaditem) => {
      const [t, s, y, m, d] = filterloaditem.code.split("_");
      //console.log("dfi", dfi);
      filterloaditem.meta = {
        date: `${AddLeadingZero(d)}/${AddLeadingZero(m)}/${y}`,
        shift: `${s} : ${SHIFT_HOURS_ZH[s][2]}`,
        team: t,

        bonus:
          filterloaditem.sacs / 20 - 600 > 0
            ? filterloaditem.sacs / 20 - 600
            : 0,
      };

      tot += filterloaditem.meta.bonus;

      if (finalfilteredloadsgroupnyday[d] === undefined)
        finalfilteredloadsgroupnyday[d] = [];

      finalfilteredloadsgroupnyday[d].push(filterloaditem);

      return filterloaditem;
    });

    finalfilteredloadsgroupnyday = Object.values(
      finalfilteredloadsgroupnyday
    ).map((dayd) => dayd.sort(customSortShifts));

    const fin = finalfilteredloadsgroupnyday.flat();

    setbonustot(tot);
    return fin;
  }

  function onDateSelected(date) {
    console.log(date);
    const { d, m, y } = date;
    const code = `${y}_${m}`;
    setmcode(code);
  }

  async function saveLoad(load) {
    setloading(true);
    const r = await SB.InsertItem(TABLES_NAMES.LOADS, load);
    console.log(r);
    if (r === null) {
      alert("Donnee ajoutees avec success");
      loadData();
      const l = await UpdateOperationsLogs(
        SB,
        user,
        LOG_OPERATION.LOGIN,
        JSON.stringify(load)
      );
      console.log(l);
      setadding(false);
    } else {
      alert("Erreur ajout donnees\n" + JSON.stringify(r));
    }

    setloading(false);
  }

  function onClick(e) {
    //setadding(!adding);

    if (adding) {
      console.log("will save data ...", newdata);

      saveLoad(newdata);
    } else {
      console.log("will toggle adding to yes");

      setadding(true);
    }
  }

  const [repportdata, setrepportdata] = useState({});
  function onDataUpdate(nd) {
    console.log("nd", nd);
    /* {
    "sacs": 0,
    "retours": 0,
    "ajouts": 0,
    "code": "A_M_2024_8_26",
    "prob_machine": null,
    "prob_courant": null,
    "autre": null,
    "camions": 0,
    "dechires": 0,
    "sacs_adj": 0
} */
    const [team, shift, y, m, d] = nd.code.split("_");
    const sup = SUPERVISORS[team];

    const { camions, sacs, dechires } = nd;
    const t = parseFloat(sacs) / 20;
    const rep = {
      team: team,
      y: parseInt(y),
      m: parseInt(m) + 1,
      d: parseInt(d),
      sup: sup,
      shift: `${SHIFT_HOURS_ZH[shift][0]} - ${SHIFT_HOURS_ZH[shift][1]} - ${SHIFT_HOURS_ZH[shift][2]}`,
      s: shift,
      camions: camions,
      sacs: sacs,
      t: t,
      dechires: dechires,
    };

    console.log("rep", rep);
    setrepportdata(rep);
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
      <div className="  flex items-center gap-2 align-middle ">
        <DateSelector onDateSelected={onDateSelected} />
        <div className="flex gap-2 align-middle items-center">
          <div className=" font-bold">EQUIPE</div>
          <select onChange={(e) => setteam(e.target.value)}>
            {["A", "B", "C", "D", "ALL"].map((op) => (
              <option selected={op === team} value={op}>
                {op}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className=" md:flex ">
        <ActionButton
          icon={adding ? save : plus}
          title={adding ? "Save" : "Nouveau Rapport"}
          onClick={onClick}
        />

        {adding ? (
          <ActionButton
            icon={multiply}
            title={"Cancel"}
            onClick={(e) => setadding(false)}
          />
        ) : (
          <ActionButton
            icon={reload}
            title={"Refresh"}
            onClick={(e) => loadData()}
          />
        )}
      </div>
      <div>
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

        <table class="table-auto">
          <thead>
            <tr>
              <th className="border border-slate-500 p-1">Date</th>
              <th className="border border-slate-500 p-1">EQ.</th>
              <th className="border border-slate-500 p-1">Shift</th>
              <th className="border border-slate-500 p-1">Sacs</th>
              {adding && (
                <>
                  <th className="border border-slate-500 p-1">Camions</th>
                  <th className="border border-slate-500 p-1">Dechires</th>
                </>
              )}
              <th className="border border-slate-500 p-1">T</th>
              <th className="border border-slate-500 p-1">BNS</th>
            </tr>
          </thead>
          {adding ? (
            <tbody>
              <FormAddLoad onDataUpdate={onDataUpdate} />
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
          <div>
            <div className=" md:flex w-fit justify-between my-2 ">
              <span className=" font-bold underline italic font-serif ">
                RAPPORT CHARGEMENT
              </span>
              <ActionButton
                icon={pdf}
                title={"Print"}
                onClick={(e) => alert("printing ...")}
              />
              <ActionButton
                icon={wechat}
                title={"Copier pour Wechat"}
                onClick={(e) => alert("Copy ...")}
              />
            </div>
            <div className="  border dark:bg-white dark:text-black border-slate-600 shadow-lg dark:shadow-white/20 shadow-slate-400 max-w-[18rem] p-2 ">
              <div className="  text-end ">
                <span className=" font-bold underline">{repportdata.y}</span>年
                <span className=" font-bold underline">{repportdata.m}</span>月
                <span className=" font-bold underline">{repportdata.d}</span>日
              </div>
              <div className=" w-32 h-fit  ">
                <img src={gck} />
              </div>
              <div className="  text-center underline font-bold ">
                •EMBALLAGE CIMENT水泥包装{" "}
              </div>
              <div>•Équipe班:{repportdata.team}</div>
              <div>
                •Superviseur班长: @
                <span className=" font-bold underline ">
                  {" "}
                  {`${repportdata.sup?.nom} - ${repportdata.sup?.zh}`}{" "}
                </span>
              </div>
              <div>
                •
                <span className=" font-bold underline ">
                  {repportdata.shift}
                </span>
              </div>
              <div>
                •装车
                <span className=" font-bold underline ">
                  {repportdata.camions}
                </span>
                辆/Camions Chargés
              </div>
              <div>
                •袋子用
                <span className=" font-bold underline ">
                  {repportdata.sacs}
                </span>
                个/Sacs Utilisés
              </div>
              <div>
                •共计
                <span className=" font-bold underline ">{repportdata.t}</span>
                吨/Tonne
              </div>
              <div>
                •撕裂的袋子
                <span className=" font-bold underline ">
                  {repportdata.dechires}
                </span>
                个/Sacs déchirés`;
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
