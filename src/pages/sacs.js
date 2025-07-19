import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../App";
import ButtonPrint from "../comps/ButtonPrint";
import { CLASS_INPUT_TEXT, CLASS_SELECT } from "../helpers/flow";
import {
  arrayToCSV,
  csvToArray,
  formatDateForDatetimeLocal,
  GetDefaultMonthFilter,
  GetNow,
} from "../helpers/func";
import { GetTransForTokensArray, LANG_TOKENS } from "../helpers/lang_strings";
import add from "../img/add.png";
import save from "../img/save.png";
import cancel from "../img/eraser.png";
import del from "../img/delete.png";
import Excelexport from "../comps/Excelexport";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "../comps/Loading";

const HEADERS = [
  "id",
  "team",
  "date",
  "sortis32",
  "prod32",
  "sortis42",
  "prod42",
  "dech32",
  "dech42",
  "ut32",
  "ut42",
  "res32",
  "res42",
  "paper32",
  "paper32",
  "diff32",
  "diff42",
  "gest",
  "act",
  // "key",
];

const def = {
  team: "A",
  date_time: new Date().toISOString(),
  sortis32: 0,
  sortis42: 0,
  ut32: 0,
  ut42: 0,
  dech32: 0,
  dech42: 0,
  gest: "tan",
  key: uuidv4(),
};

const TEST_TRANS = [
  /* {
    team: "A",
    date_time: "2025-05-14T00:52:10.000Z",
    sortis32: 0,
    sortis42: 10000,
    ut32: 0,
    ut42: 12235,
    dech32: 0,
    dech42: 92,
    gest: "tan",
    key: "5f725a08-09a0-4ac6-b55b-12494cbd3380",
    ts: 1752454330000,
    res32: 0,
    res42: 0,
  },
  {
    team: "C",
    date_time: "2025-05-14T00:52:41.000Z",
    sortis32: 0,
    sortis42: 16500,
    ut32: 0,
    ut42: 16150,
    dech32: 0,
    dech42: 45,
    gest: "tan",
    key: "88d3bd03-d2a7-4063-98fa-85e0498507b1",
    ts: 1752454361000,
    res32: 0,
    res42: 9908,
  },
  {
    team: "B",
    date_time: "2025-06-15T00:53:04.000Z",
    sortis32: 800,
    sortis42: 15500,
    ut32: 800,
    ut42: 16995,
    dech32: 0,
    dech42: 60,
    gest: "tan",
    key: "a7850ce9-1f6d-4f4c-a2fc-16703ab72f94",
    ts: 1752540784000,
    res32: 0,
    res42: 16455,
  },
  {
    team: "A",
    date_time: "2025-06-15T00:53:48.000Z",
    sortis32: 0,
    sortis42: 22375,
    ut32: 0,
    ut42: 21545,
    dech32: 0,
    dech42: 92,
    gest: "tan",
    key: "306133ae-0b3a-4c56-90aa-1c0ff41b0441",
    ts: 1752540828000,
    res32: 800,
    res42: 15440,
  },
  {
    team: "B",
    date_time: "2025-07-16T00:54:28.000Z",
    sortis32: 0,
    sortis42: 13500,
    ut32: 0,
    ut42: 13745,
    dech32: 0,
    dech42: 72,
    gest: "tan",
    key: "c8644150-241b-4dc8-aa3e-5683c757adc2",
    ts: 1752627268000,
    res32: 0,
    res42: 22283,
  }, */
];

function BagsManProduction() {
  const [insert, setinsert] = useState(false);
  const [trans, settrans] = useState([]); //...TEST_TRANS]);
  const [transf, settransf] = useState([]);
  const [, , user] = useContext(UserContext);
  const [newt, setnewt] = useState(def);
  const [loading, setloading] = useState(false);
  const [filter, setFilter] = useState(GetDefaultMonthFilter());
  const [pandian, setpandian] = useState({ s32: 0, s42: 2795 });
  const [papers32, setpapers32] = useState({});
  const [papers42, setpapers42] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    console.log("papers32 => ", papers32);
    console.log("papers42 => ", papers42);
  }, [papers32, papers42]);

  useEffect(() => {
    calculateTrans(transf, pandian.s32, pandian.s42);

    console.log("new pandian ", pandian);
  }, [pandian]);

  async function loadData() {
    setloading(true);
    const datacsv = await SB.LoadAllItems(TABLES_NAMES.BAGS_MAN_PROD);
    const dataobj = datacsv.map((it) => csvToArray(it.csv)).flat();

    settrans(dataobj);
    console.log("datacsv : ", datacsv);
    console.log("dataobj : ", dataobj);
    calculateTrans(dataobj, pandian.s32, pandian.s42);
    setloading(false);
  }

  useEffect(() => {
    if (trans.length === 0) return;
    const filtered = trans.filter((item) =>
      filter ? item.date_time.startsWith(filter) : true
    );

    calculateTrans(filtered, pandian.s32, pandian.s42);
  }, [filter]);

  function calculateTrans(trans, pandian32, pandian42) {
    const finaltrans = [];

    trans.forEach((it, i) => {
      const firstElement = i === 0;

      const prevItem = firstElement ? null : finaltrans[i - 1];

      const res32 = firstElement
        ? pandian32
        : prevItem.res32 + it.sortis32 - it.ut32 - it.dech32;

      const res42 = firstElement
        ? pandian42
        : prevItem.res42 + it.sortis42 - it.ut42 - it.dech42;

      const finalItem = {
        ...it,
        res32,
        res42,
        prod32: it.ut32 / 20,
        prod42: it.ut42 / 20,
      };

      finaltrans.push(finalItem);
    });

    settransf(finaltrans);
  }

  function onInsertTrans() {
    // console.log("ntrans \n", newt);
    let updatedTrans = [...trans];

    const nt = { ...newt, key: uuidv4() };
    nt.date_time = new Date(nt.date_time).toISOString();
    updatedTrans.push(nt);

    //////
    updatedTrans = updatedTrans.map((it) => ({
      ...it,
      ts: new Date(it.date_time).getTime(),
    }));

    updatedTrans.sort((a, b) => a.ts - b.ts);
    settrans(updatedTrans);
    calculateTrans(updatedTrans, pandian.s32, pandian.s42);
    setnewt(def);
    setinsert(false);
  }

  function onRemove(it) {
    if (window.confirm("Are you sure?")) {
      console.log("deleting", it);
      const t = trans.filter((curel) => curel.key !== it.key);
      calculateTrans(t, pandian.s32, pandian.s42);
    }
  }

  function prepareExecelData(data) {
    return data;
  }

  async function onSave(data) {
    setloading(true);

    const csv = arrayToCSV(data);
    const fdata = { csv, filter };

    if (!filter) {
      alert("Filter cant be empty!");
      setloading(false);
      return;
    }

    const r = await SB.UpsertItem(TABLES_NAMES.BAGS_MAN_PROD, fdata, "filter");
    console.log(filter, csv);
    console.log("res => ", r);

    if (!r.code) {
      alert("Data saved succsses!");
    } else {
      alert("ERROR: \n" + JSON.stringify(r));
    }

    setloading(false);
  }

  return (
    <div className="container text-center">
      <div className=" text-3xl text-orange-500">
        {GetTransForTokensArray(
          LANG_TOKENS.PRODUCTION_BAGS_MANAGEMENT,
          user.lang
        )}
      </div>

      <Loading isLoading={loading} />

      {!insert && (
        <div>
          <div className=" flex flex-col md:flex-row justify-center md:gap-4 ">
            <ButtonPrint
              icon={add}
              onClick={(e) => setinsert(true)}
              title={GetTransForTokensArray(LANG_TOKENS.NEW, user.lang)}
            />

            <Excelexport excelData={prepareExecelData(transf)} />
            <ButtonPrint
              icon={save}
              onClick={(e) => onSave(transf)}
              title={GetTransForTokensArray(LANG_TOKENS.SAVE, user.lang)}
            />
          </div>

          <div className=" flex gap-4 justify-center items-center   ">
            <div className=" my-4 ">
              <div>PANDIAN | {filter}</div>
              <div className="flex gap-4 justify-center">
                <div>
                  <div>s32</div>
                  <input
                    className={` w-16 ${CLASS_INPUT_TEXT} `}
                    type="number"
                    oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                    step={1}
                    min={0}
                    value={pandian.s32}
                    onChange={(e) =>
                      setpandian((old) => ({
                        ...old,
                        s32: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>

                <div>
                  <div>s32</div>
                  <input
                    className={` w-16 ${CLASS_INPUT_TEXT} `}
                    type="number"
                    step={1}
                    oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                    min={0}
                    value={pandian.s42}
                    onChange={(e) =>
                      setpandian((old) => ({
                        ...old,
                        s42: parseInt(e.target.value),
                      }))
                    }
                  />{" "}
                </div>
              </div>
            </div>

            <div className="   flex justify-between  flex-col   ">
              <div>Filter</div>

              <input
                type="month"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`${CLASS_INPUT_TEXT}   border rounded p-2 w-fit mb-4`}
              />
            </div>
          </div>
        </div>
      )}

      {/* RECORDS TABLE */}
      {!insert && (
        <div className=" overflow-auto ">
          <table className=" w-full mx-auto ">
            <thead>
              <tr>
                {HEADERS.map((it) => (
                  <td className="p-1 border">{it}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {transf.length > 0 ? (
                transf.map((r, i) => (
                  <tr
                    className={` ${
                      (r.res42 - papers42[r.key] > 0 ||
                        r.res42 - papers42[r.key] < 0) &&
                      "bg-red-900 text-red-300 font-bold border border-red-700"
                    } `}
                  >
                    <td className="p-1 border table-cell">{i + 1}</td>
                    <td className="p-1 border table-cell">{r.team}</td>
                    <td className="p-1 border table-cell">
                      {" "}
                      {formatDateForDatetimeLocal(r.date_time)}
                    </td>
                    <td className="p-1 border table-cell">{r.sortis32}</td>
                    <td className="p-1 border table-cell">{r.prod32}</td>
                    <td className="p-1 border table-cell">{r.sortis42}</td>
                    <td className="p-1 border table-cell"> {r.prod42}</td>
                    <td className="p-1 border table-cell">{r.dech32}</td>
                    <td className="p-1 border table-cell">{r.dech42}</td>
                    <td className="p-1 border table-cell">{r.ut32}</td>
                    <td className="p-1 border table-cell">{r.ut42}</td>
                    <td className="p-1 border table-cell">{r.res32}</td>
                    <td className="p-1 border table-cell">{r.res42}</td>
                    <td className="p-1 border table-cell">
                      <input
                        value={papers32[r.key] || 0}
                        onChange={(e) =>
                          setpapers32((old) => ({
                            ...old,
                            [r.key]: parseInt(e.target.value),
                          }))
                        }
                        type="number"
                        oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                        min={0}
                        className={` ${CLASS_INPUT_TEXT} w-16 `}
                      />
                    </td>
                    <td className="p-1 border table-cell">
                      <input
                        value={papers42[r.key] || 0}
                        onChange={(e) =>
                          setpapers42((old) => ({
                            ...old,
                            [r.key]: parseInt(e.target.value),
                          }))
                        }
                        type="number"
                        oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                        min={0}
                        className={` ${CLASS_INPUT_TEXT} w-16 `}
                      />
                    </td>
                    <td className="p-1 border table-cell">
                      {papers32[r.key] ? r.res32 - papers32[r.key] : -r.res32}
                    </td>
                    <td className="p-1 border table-cell">
                      {" "}
                      {papers42[r.key] ? r.res42 - papers42[r.key] : -r.res42}
                    </td>
                    <td className="p-1 border table-cell">{r.gest}</td>
                    <td className="p-1 border table-cell">
                      <ButtonPrint
                        onClick={(e) => onRemove(r)}
                        title={"DEL"}
                        icon={del}
                      />
                    </td>
                    {/*  <td className="p-1 border table-cell">{r.key}</td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className=" p-2 border   " colSpan={HEADERS.length}>
                    <span className="text-gray-500">No items for {filter}</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* SHOW INSERT FORM */}
      {insert && (
        <div className=" mx-auto shadow-lg bg-gradient-to-b from-slate-700 to-slate-800 flex gap-2 flex-col my-4 md:w-fit w-full p-4 rounded-lg ">
          <div className=" text-xl text-center my-4 border-b border-dashed border-slate-400 pb-4  ">
            Input New Data
          </div>

          <div className=" flex  justify-between ">
            <span>team</span>
            <select
              className={` ${CLASS_SELECT}  `}
              value={newt.team}
              onChange={(e) =>
                setnewt((old) => ({
                  ...old,
                  team: e.target.value,
                }))
              }
            >
              {["A", "B", "C"].map((it) => (
                <option value={it}>{it}</option>
              ))}
            </select>
          </div>

          <div className=" flex  justify-between ">
            <span>date-time</span>
            <input
              className={` ${CLASS_SELECT}  `}
              //defaultValue={GetNow()}
              value={
                new Date(newt.date_time).toISOString().split(".")[0] || GetNow()
              }
              onChange={(e) =>
                setnewt((old) => ({
                  ...old,
                  date_time: e.target.value,
                }))
              }
              step="1"
              type="datetime-local"
            />
          </div>

          <div className=" flex  justify-between ">
            <span>sortis32</span>
            <input
              className={` ${CLASS_INPUT_TEXT} `}
              value={newt.sortis32}
              onChange={(e) =>
                setnewt((old) => ({
                  ...old,
                  sortis32: parseInt(e.target.value),
                }))
              }
              step="1"
              oninput="this.value = this.value.replace(/[^0-9]/g, '')"
              type="number"
            />
          </div>

          <div className=" flex  justify-between ">
            <span>sortis42</span>
            <input
              className={` ${CLASS_INPUT_TEXT} `}
              value={newt.sortis42}
              onChange={(e) =>
                setnewt((old) => ({
                  ...old,
                  sortis42: parseInt(e.target.value),
                }))
              }
              step="1"
              oninput="this.value = this.value.replace(/[^0-9]/g, '')"
              type="number"
            />
          </div>

          <div className=" flex  justify-between ">
            <span>dech32</span>
            <input
              className={` ${CLASS_INPUT_TEXT} `}
              value={newt.dech32}
              onChange={(e) =>
                setnewt((old) => ({
                  ...old,
                  dech32: parseInt(e.target.value),
                }))
              }
              step="1"
              oninput="this.value = this.value.replace(/[^0-9]/g, '')"
              type="number"
            />
          </div>

          <div className=" flex  justify-between ">
            <span>dech42</span>
            <input
              className={` ${CLASS_INPUT_TEXT} `}
              value={newt.dech42}
              onChange={(e) =>
                setnewt((old) => ({
                  ...old,
                  dech42: parseInt(e.target.value),
                }))
              }
              step="1"
              oninput="this.value = this.value.replace(/[^0-9]/g, '')"
              type="number"
            />
          </div>

          <div className=" flex  justify-between ">
            <span>ut32</span>
            <input
              className={` ${CLASS_INPUT_TEXT} `}
              value={newt.ut32}
              onChange={(e) =>
                setnewt((old) => ({
                  ...old,
                  ut32: parseInt(e.target.value),
                }))
              }
              step="1"
              oninput="this.value = this.value.replace(/[^0-9]/g, '')"
              type="number"
            />
          </div>

          <div className=" flex  justify-between ">
            <span>ut42</span>
            <input
              className={` ${CLASS_INPUT_TEXT} `}
              value={newt.ut42}
              onChange={(e) =>
                setnewt((old) => ({
                  ...old,
                  ut42: parseInt(e.target.value),
                }))
              }
              step="1"
              oninput="this.value = this.value.replace(/[^0-9]/g, '')"
              type="number"
            />
          </div>

          <div className=" flex  justify-between ">
            <span>team</span>
            <select
              className={` ${CLASS_SELECT}  `}
              value={newt.gest}
              onChange={(e) =>
                setnewt((old) => ({
                  ...old,
                  gest: e.target.value,
                }))
              }
            >
              {["tan", "zhao", "wang gang"].map((it) => (
                <option value={it}>{it}</option>
              ))}
            </select>
          </div>

          <div className=" border-dashed border-slate-400 border-t pt-4 mt-4 flex  justify-between flex-col md:flex-row ">
            <ButtonPrint
              icon={save}
              onClick={onInsertTrans}
              title={GetTransForTokensArray(LANG_TOKENS.SAVE, user.lang)}
            />

            <ButtonPrint
              icon={cancel}
              onClick={(e) => setinsert(false)}
              title={GetTransForTokensArray(LANG_TOKENS.CANCEL, user.lang)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sacs() {
  return (
    <div>
      <div>
        <BagsManProduction />
      </div>
    </div>
  );
}
