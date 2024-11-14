import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import ActionButton from "../comps/ActionButton";
import DateSelector from "../comps/DateSelector";
import Loading from "../comps/Loading";

import Boazhuang2 from "../comps/sacs/Baozhuang2";
import {
  ACCESS_CODES,
  CLASS_SELECT,
  LOG_OPERATION,
  SHIFT_HOURS_ZH,
} from "../helpers/flow";
import {
  AddLeadingZero,
  customSortShifts,
  formatFrenchDate,
  GetDateParts,
  ParseBaozhuang,
  UpdateOperationsLogs,
  UserHasAccessCode,
} from "../helpers/func";
import { printDailyRepport, printTable } from "../helpers/print";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import check from "../img/check.svg";
import del from "../img/delete.png";
import pdf from "../img/pdf.png";
import plus from "../img/plus.png";
import reload from "../img/reload.png";
import {
  GetLangCodeByIndex,
  GetLangIndexByLangCode,
  GetTransForToken,
  LANG_TOKENS,
} from "../helpers/lang_strings";

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

    //console.log("load", load);
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

export default function RapportChargement() {
  const [mcode, setmcode] = useState();
  const [loading, setloading] = useState(false);
  const [loads, setloads] = useState([]);
  const [loadsf, setloadsf] = useState([]);
  const [, , user, setuser] = useContext(UserContext);
  const [team, setteam] = useState("ALL");
  const [bonustot, setbonustot] = useState(0);
  const [tot, settot] = useState(0);
  const [adding, setadding] = useState(false);
  const [newdata, setnewdata] = useState();

  useEffect(() => {
    loadData();
    const parts = GetDateParts("all");
    //console.log("parts", parts);
    const curmcode = `${parts.year}_${parts.month}`;
    //console.log(curmcode);
    setmcode(curmcode);
  }, []);

  useEffect(() => {
    setloadsf(filterLoads(loads, mcode, team));
    //console.log(user);

    if (user.is_exp === "OUI") {
      setteam(user.equipe);
    }
  }, [loads, mcode, team]);

  async function loadData() {
    setloading(true);
    setloads([]);
    setloadsf([]);
    const data = await SB.LoadAllItems(TABLES_NAMES.LOADS, "created_at", true);
    //console.log(data[0]);
    setloads(data);
    setloadsf(filterLoads(data, mcode, team));
    //console.log(data);
    setloading(false);
  }

  function filterLoads(loads, mcode, team) {
    setbonustot(0);
    let btot = 0;
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

    filteredloads = filteredloads.map((filterloaditem, i) => {
      const [t, s, y, m, d] = filterloaditem.code.split("_");
      ////console.log("dfi", dfi);
      filterloaditem.meta = {
        date: `${AddLeadingZero(d)}/${AddLeadingZero(m)}/${y}`,
        shift: `${s} : ${SHIFT_HOURS_ZH[s][2]}`,
        team: t,

        bonus:
          filterloaditem.sacs / 20 - 600 > 0
            ? filterloaditem.sacs / 20 - 600
            : 0,
      };

      btot += filterloaditem.meta.bonus;
      tot += filterloaditem.sacs;
      console.log("meta => ", filterloaditem.meta);

      if (finalfilteredloadsgroupnyday[d] === undefined)
        finalfilteredloadsgroupnyday[d] = [];

      finalfilteredloadsgroupnyday[d].push(filterloaditem);

      return filterloaditem;
    });

    finalfilteredloadsgroupnyday = Object.values(
      finalfilteredloadsgroupnyday
    ).map((dayd) => dayd.sort(customSortShifts));

    const fin = finalfilteredloadsgroupnyday.flat();
    ///console.log("fin", fin);
    setbonustot(btot);
    settot(tot);
    return fin;
  }

  function onDateSelected(date) {
    //console.log(date);
    const { d, m, y } = date;
    const code = `${y}_${m}`;
    setmcode(code);
  }

  async function saveLoad(load) {
    setloading(true);

    const r = await SB.InsertItem(TABLES_NAMES.LOADS, load);
    //console.log(r);
    if (r === null) {
      alert("Donnee ajoutees avec success");
      loadData();
      const l = await UpdateOperationsLogs(
        SB,
        user,
        LOG_OPERATION.LOGIN,
        JSON.stringify(load)
      );
      // //console.log(l);
      setadding(false);
    } else {
      alert("Erreur ajout donnees\n" + JSON.stringify(r));
    }

    setloading(false);
  }

  function onAddNewLoad(e) {
    //setadding(!adding);
    //setviewload(false);

    if (adding) {
      //console.log("will save data ...", newdata);

      saveLoad(newdata);
    } else {
      //console.log("will toggle adding to yes");

      setadding(true);
    }
  }

  const [repportdata, setrepportdata] = useState({});
  function onDataUpdate(nd) {
    const rep = ParseBaozhuang(nd);

    //console.log(rep);
    setrepportdata(rep);
    setnewdata(nd);
  }

  const [baozhuangrep, setbaozhuangrep] = useState();
  function onClickLoad(load) {
    //console.log(load);
    const bz = ParseBaozhuang(load);
    setbaozhuangrep(bz);
    //console.log(bz);
    //setviewload(true);
  }

  function onPrint(loads) {
    if (loads.length === 0) {
      alert("Cant print empty data!\nPlease select a month with load data!");
      return;
    }

    const tot = {
      sacs: 0,
      t: 0,
      bonus: 0,
    };
    let finaldate;
    const headers = [["DATE", "EQ.", "SHIFT", "SACS", "T", "BONUS"]];
    const data = loads
      .map((item) => {
        const meta = {
          ...item.meta,
          sacs: parseInt(item.sacs),
          t: parseFloat((parseFloat(item.sacs) / 20).toFixed(2)),
        };

        tot.sacs += meta.sacs;
        tot.t += meta.t;
        tot.bonus += parseFloat(meta.bonus);
        return meta;
      })
      .map((item) => {
        const { date, team, shift, sacs, t, bonus } = item;
        const [d, m, y] = date.split("/");
        const month = AddLeadingZero(parseInt(m) + 1);

        finaldate = `${y}.${month}.${d}`;

        const finalitem = [finaldate, team, shift, sacs, t, bonus];
        ////console.log("finalitem => ", finalitem);
        return finalitem; //[date, team, shift, sacs, t, bonus];
      });

    let [year, month, day] = finaldate.split(".");

    const title = `CHARGEMENT CIMENT ${year}.${month}`;
    const filename = title.replaceAll(" ", "_") + ".pdf";

    const totrow = [
      ,
      ,
      "TOTAL",
      tot.sacs,
      tot.t.toFixed(2),
      tot.bonus.toFixed(2),
    ];
    data.push(totrow);
    printTable(data, title, headers, filename);
  }

  function onBaozhuangSave(nd) {
    setbaozhuangrep(undefined);
    setadding(false);
    loadData();
  }

  function onBaozhuangCancel() {
    setbaozhuangrep(undefined);
    setadding(false);
  }

  function onPrintDailyRepport(loads_array, cur_load, idx) {
    const [t, s, y, m, d] = cur_load.code.split("_");

    const filter = `${y}_${m}_${d}`;

    let filteredloads = [cur_load]; //loads_array.filter((it) => it.code.includes(filter));

    ["M", "P", "N"].forEach((shift) => {
      if (s !== shift) {
        const pload = loads_array.find((it) =>
          it.code.includes(`_${shift}_${filter}`)
        );
        if (pload) filteredloads.push(pload);
      }
    });

    filteredloads.sort(customSortShifts);

    let datestr = AddOneMonth(filter.replaceAll("_", "/"));

    const date = new Date(datestr);
    const frenchdate = formatFrenchDate(date);
    const filename = `PRIME_DU_${frenchdate}.pdf`;

    console.log("print cur_load: \n", cur_load);

    printDailyRepport(filteredloads, date, filename);
  }

  async function onDeleteLoad(ld) {
    if (window.confirm(`Are you sure you wanna delete " ${ld.code} "`)) {
      const error = await SB.DeleteItem(TABLES_NAMES.LOADS, ld);

      if (null === error) {
        alert(`Item " ${ld.code} " delete successfully!`);
        loadData();
      } else {
        alert(`Error\n${JSON.stringify(error)}`);
      }
    }
  }

  function AddOneMonth(date) {
    //console.log("AddOneMonth ", date);
    if (!date) return;
    const date_fix = date.split("/");
    date_fix[1] = AddLeadingZero(parseInt(date_fix[1]) + 1);
    return date_fix.join("/");
  }

  return (
    <div className=" container  ">
      <div>
        {LANG_TOKENS.LOADING_TRACKING[GetLangIndexByLangCode(user.lang)]}
        <span>
          <Loading isLoading={loading} />
        </span>
      </div>

      {!baozhuangrep && (
        <>
          <div className=" md:flex items-center md:justify-center  ">
            <DateSelector onDateSelected={onDateSelected} />
            <div className="flex md:-mt-3 items-center gap-2  w-fit ml-11 ">
              <div className=" text-sm font-bold">
                {" "}
                {LANG_TOKENS.TEAM[GetLangIndexByLangCode(user.lang)]} :{" "}
              </div>

              {user.is_exp === "OUI" ? (
                <span> {user.equipe} </span>
              ) : (
                <select
                  className={CLASS_SELECT}
                  onChange={(e) => setteam(e.target.value)}
                >
                  {["A", "B", "C", "D", "ALL"].map((op) => (
                    <option selected={op === team} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className=" flex justify-between  sm:justify-center  gap-2 my-2   ">
            {!adding && UserHasAccessCode(user, ACCESS_CODES.ADD_NEW_LOAD) && (
              <ActionButton
                icon={plus}
                title={LANG_TOKENS.NEW[GetLangIndexByLangCode(user.lang)]}
                onClick={onAddNewLoad}
              />
            )}

            {!adding && (
              <ActionButton
                icon={reload}
                title={GetTransForToken(LANG_TOKENS.REFRESH, user.lang)} //{LANG_TOKENS.REFRESH[GetLangIndexByLangCode(user.lang)]}
                onClick={(e) => loadData()}
              />
            )}
          </div>
        </>
      )}

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
              {GetTransForToken(LANG_TOKENS.MSG_INSERT_NEW_DATA, user.lang)}
            </span>
          </div>
        )}

        {baozhuangrep ? (
          <div>
            <Boazhuang2
              repportdata={baozhuangrep}
              onBaozhuangSave={onBaozhuangSave}
            />
            <div className="flex">
              <ActionButton
                icon={check}
                title={"OK"}
                onClick={(e) => setbaozhuangrep(undefined)}
              />
            </div>
          </div>
        ) : (
          <>
            {adding ? (
              <Boazhuang2
                onBaozhuangSave={onBaozhuangSave}
                editmode={true}
                onBaozhuangCancel={onBaozhuangCancel}
              />
            ) : (
              <>
                <div className=" flex justify-center py-2  ">
                  <ActionButton
                    icon={pdf}
                    title={
                      LANG_TOKENS.PRINT_REPPORT[
                        GetLangIndexByLangCode(user.lang)
                      ]
                    }
                    onClick={(e) => onPrint(loadsf)}
                  />
                </div>
                <table class="table-auto mx-auto">
                  <thead>
                    <tr>
                      <th className="border border-slate-500 p-1">
                        {GetTransForToken(LANG_TOKENS.DATE, user.lang)}
                      </th>
                      <th className="border border-slate-500 p-1">
                        {GetTransForToken(LANG_TOKENS.EQ, user.lang)}
                      </th>
                      <th className="border border-slate-500 p-1">
                        {GetTransForToken(LANG_TOKENS.SHIFT, user.lang)}
                      </th>
                      <th className="border border-slate-500 p-1">
                        {GetTransForToken(LANG_TOKENS.BAGS, user.lang)}
                      </th>
                      <th className="border border-slate-500 p-1 hidden sm:table-cell">
                        {LANG_TOKENS.TRUCK[GetLangIndexByLangCode(user.lang)]}
                      </th>
                      <th className="border border-slate-500 p-1 hidden sm:table-cell">
                        {GetTransForToken(LANG_TOKENS.TORN_BAGS, user.lang)}
                      </th>
                      <th className="border border-slate-500 p-1">
                        {GetTransForToken(LANG_TOKENS.T, user.lang)}
                      </th>
                      <th className="border border-slate-500 p-1">BNS</th>
                      <th className="border border-slate-500 p-1">ACT</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="  border border-slate-500 p-1 text-end "></td>
                      <td className="  border border-slate-500 p-1 text-end "></td>
                      <td className="  border border-slate-500 p-1 text-end "></td>
                      <td className="  border border-slate-500 p-1 text-end ">
                        {tot}
                      </td>
                      <td className="  border border-slate-500 p-1 text-end hidden sm:table-cell"></td>
                      <td className="  border border-slate-500 p-1 text-end hidden sm:table-cell"></td>
                      <td className="  border border-slate-500 p-1 text-end ">
                        {(parseFloat(tot) / 20).toFixed(2)}
                      </td>
                      <td className="  border border-slate-500 p-1 text-end ">
                        {bonustot}
                      </td>
                      <td className="  border border-slate-500 p-1 text-end "></td>
                    </tr>
                    {loadsf.map((ld, i) => (
                      <tr
                        className={` hover:bg-slate-400 dark:hover:bg-black/50 cursor-pointer  ${
                          ld.code[2] === "M" &&
                          " bg-slate-100 dark:bg-slate-700  "
                        }  `}
                        onClick={(e) => onClickLoad(ld)}
                      >
                        <td className="  border border-slate-500 p-1 text-end ">
                          <span className=" md:hidden  ">
                            {AddOneMonth(ld.meta?.date.split("/202")[0])}
                          </span>
                          <span className=" hidden md:block ">
                            {AddOneMonth(ld.meta?.date)}
                          </span>
                        </td>
                        <td className="  border border-slate-500 p-1 text-end ">
                          {ld.meta?.team}
                        </td>
                        <td className="  border border-slate-500 p-1 text-end ">
                          <span className=" md:hidden ">
                            {ld.meta?.shift.split(" - ")[0].split(" : ")[1]}
                          </span>
                          <span className=" hidden md:block  ">
                            {ld.meta?.shift}
                          </span>
                        </td>
                        <td className="  border border-slate-500 p-1 text-end ">
                          {ld.sacs}
                        </td>
                        <td className="  border border-slate-500 p-1 text-end hidden sm:table-cell ">
                          {ld.camions}
                        </td>
                        <td className="  border border-slate-500 p-1 text-end hidden sm:table-cell ">
                          {ld.dechires}
                        </td>

                        <td className="  border border-slate-500 p-1 text-end ">
                          {parseFloat(ld.sacs) / 20}
                        </td>
                        <td className="  border border-slate-500 p-1 text-end ">
                          {parseFloat(ld.sacs) / 20 > 600 ? (
                            <span className=" font-serif text-sky-700 font-bold ">
                              {(parseFloat(ld.sacs) / 20 - 600).toFixed(2)}
                            </span>
                          ) : (
                            0
                          )}
                        </td>
                        <td className="  border border-slate-500 p-1 text-end ">
                          {ld.code[2] === "M" &&
                            UserHasAccessCode(
                              user,
                              ACCESS_CODES.PRINT_DAILY_REPPORT
                            ) && (
                              <ActionButton
                                icon={pdf}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPrintDailyRepport(loads, ld, i);
                                }}
                              />
                            )}

                          {UserHasAccessCode(
                            user,
                            ACCESS_CODES.DELETE_LOAD
                          ) && (
                            <ActionButton
                              icon={del}
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteLoad(ld);
                              }}
                            />
                          )}
                        </td>
                      </tr>
                    ))}{" "}
                    <tr>
                      <td className="  border border-slate-500 p-1 text-end "></td>
                      <td className="  border border-slate-500 p-1 text-end "></td>
                      <td className="  border border-slate-500 p-1 text-end "></td>
                      <td className="  border border-slate-500 p-1 text-end ">
                        {tot}
                      </td>
                      <td className="  border border-slate-500 p-1 text-end hidden sm:table-cell"></td>
                      <td className="  border border-slate-500 p-1 text-end hidden sm:table-cell"></td>
                      <td className="  border border-slate-500 p-1 text-end ">
                        {(parseFloat(tot) / 20).toFixed(2)}
                      </td>
                      <td className="  border border-slate-500 p-1 text-end ">
                        {bonustot}
                      </td>
                      <td className="  border border-slate-500 p-1 text-end "></td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
