import React, { useContext, useEffect, useRef, useState } from "react";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import useDataLoader from "../hooks/useDataLoader";
import { TABLES_NAMES } from "../helpers/sb.config";
import {
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  CLASS_TD,
  USER_LEVEL,
  dateFormatter,
} from "../helpers/flow";
import { UserContext } from "../App";
import ButtonPrint from "../comps/ButtonPrint";
import { _, createHeaders, formatFrenchDate } from "../helpers/func";
import * as SB from "../helpers/sb";
import Loading from "../comps/Loading";
import { doc } from "../helpers/funcs_print";
import TabCont from "../comps/TabCont";
import SacsCalc from "../comps/SacsCalc";

const SECTIONS = {
  CONTAINER: { label: "Sacs Container" },
  PRODUCTION: { label: "Sacs Production" },
  CALCULATOR: { label: "Sacs Calculator" },
};

function ContainerStock({ stock }) {
  return (
    <div className=" py-4 border rounded-md p-1 bg-slate-300/50 ">
      <div className=" font-bold  ">STOCK CONTAINER</div>

      <div className=" flex flex-col ">
        <div>
          {" "}
          Type 32.5 :<span className=" font-bold "> {stock.s32}</span>{" "}
        </div>
        <div>
          {" "}
          Type 42.5 : <span className=" font-bold ">{stock.s42}</span>{" "}
        </div>
      </div>
    </div>
  );
}

function SacsContainer({ trans, onAddTrans }) {
  const [showInput, setShowInput] = useState(false);
  const [data, setdata] = useState({
    id: trans.length,
    s32: 0,
    s42: 0,
  });

  function onSaveTrans() {
    if (data.s32 === undefined || data.s42 === undefined) {
      alert("Please input sacs amount!");
      return;
    }

    setShowInput(false);
    onAddTrans("cont", data);
    setdata({});
  }

  return (
    <div>
      <div>
        {!showInput && (
          <button
            onClick={(e) => setShowInput(true)}
            className=" p-1 text-green-500 border rounded-md border-green-500 hover:text-white hover:bg-green-500 "
          >
            INSERT
          </button>
        )}

        {showInput && (
          <button
            onClick={onSaveTrans}
            className=" p-1 text-sky-500 border rounded-md border-sky-500 hover:text-white hover:bg-sky-500 "
          >
            SAVE
          </button>
        )}

        <button
          onClick={(e) => setShowInput(false)}
          className=" p-1 text-red-500 border rounded-md border-red-500 hover:text-white hover:bg-red-500 "
        >
          CANCEL
        </button>
      </div>
      <div className=" container  ">
        <table>
          <thead>
            <th className="p1 border border-gray-900">id</th>
            <th className="p1 border border-gray-900">Equipe</th>
            <th className="p1 border border-gray-900">32.5</th>
            <th className="p1 border border-gray-900">42.5</th>
            <th className="p1 border border-gray-900">Date</th>
          </thead>
          <tbody>
            {showInput && (
              <tr>
                <td className="p1 border border-gray-900">{-1}</td>
                <td className="p1 border border-gray-900">
                  <select
                    className=" border p-1 "
                    value={data.team}
                    onChange={(e) =>
                      setdata((old) => ({ ...old, team: e.target.value }))
                    }
                  >
                    {["A", "B", "C", "D"].map((eq) => (
                      <option value={eq}>{eq}</option>
                    ))}
                  </select>
                </td>
                <td className="p1 border border-gray-900">
                  <input
                    className=" w-16 "
                    value={data.s32}
                    onChange={(e) =>
                      setdata((old) => ({
                        ...old,
                        s32:
                          e.target.value === "" ? 0 : parseInt(e.target.value),
                      }))
                    }
                  />
                </td>
                <td className="p1 border border-gray-900">
                  <input
                    className=" w-16"
                    value={data.s42}
                    onChange={(e) =>
                      setdata((old) => ({
                        ...old,
                        s42:
                          e.target.value === "" ? 0 : parseInt(e.target.value),
                      }))
                    }
                  />
                </td>
                <td className="p1 border border-gray-900">
                  {new Date().toDateString()}
                </td>
              </tr>
            )}
            {trans.map((t, i) => (
              <tr className={`  ${showInput ? "opacity-20" : ""}  `}>
                <td className="p1 border border-gray-900">{i}</td>
                <td className="p1 border border-gray-900">{t.team}</td>
                <td className="p1 border border-gray-900">{t.s32}</td>
                <td className="p1 border border-gray-900">{t.s42}</td>
                <td className="p1 border border-gray-900">
                  {new Date().toDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SacsProduction({ trans, onAddTrans }) {
  const [showInput, setShowInput] = useState(false);
  const [data, setdata] = useState({
    id: trans.length,
    team: "A",
    sortis32: 0,
    tonnage32: 0,
    sortis42: 0,
    tonnage42: 0,
    dechires32: 0,
    dechires42: 0,
    utilises32: 0,
    utilises42: 0,
  });

  const [restants, set_restants] = useState({ s32: 10, s42: 20 });

  useEffect(() => {
    const isFirstRec = trans.length === 0;
    let trouves32 = 0;
    let trouves42 = 0;
    let prev_rec;

    if (!isFirstRec) {
      prev_rec = { restants32: 0, restants42: 0 }; //trans[trans.length - 2];
      trouves32 = prev_rec.restants32;
      trouves42 = prev_rec.restants42;
    }

    const newr32 =
      data.sortis32 + trouves32 - data.utilises32 - data.dechires32;
    const newr42 =
      data.sortis42 + trouves42 - data.utilises42 - data.dechires42;

    /*  const t32 = data.utilises32 / 20
      const t42 = data.utilises32 / 20; */

    set_restants({ s32: newr32, s42: newr42 });
  }, [data]);

  function onSaveTrans() {
    console.log(data);

    setShowInput(false);
    onAddTrans("prod", {
      ...data,
      date: new Date().toISOString(),
      restants32: restants.s32,
      restants42: restants.s42,
    });
    setdata({});
  }

  return (
    <div>
      <div>
        {!showInput && (
          <button
            onClick={(e) => setShowInput(true)}
            className=" p-1 text-green-500 border rounded-md border-green-500 hover:text-white hover:bg-green-500 "
          >
            INSERT
          </button>
        )}

        {showInput && (
          <button
            onClick={onSaveTrans}
            className=" p-1 text-sky-500 border rounded-md border-sky-500 hover:text-white hover:bg-sky-500 "
          >
            SAVE
          </button>
        )}

        <button
          onClick={(e) => setShowInput(false)}
          className=" p-1 text-red-500 border rounded-md border-red-500 hover:text-white hover:bg-red-500 "
        >
          CANCEL
        </button>
      </div>
      <div className=" container  ">
        <table>
          <thead>
            <th className="p1 border border-gray-900">id</th>
            <th className="p1 border border-gray-900">Equipe</th>
            <th className="p1 border border-gray-900">Date</th>
            <th className="p1 border border-gray-900">Sacs Sortis (32.5)</th>
            <th className="p1 border border-gray-900">Tonnage (32.5)</th>
            <th className="p1 border border-gray-900">Sacs Sortis (42.5)</th>
            <th className="p1 border border-gray-900">Tonnage (42.5)</th>

            <th className="p1 border border-gray-900">Sacs Dechires (32.5)</th>
            <th className="p1 border border-gray-900">Sacs Dechires (42.5)</th>
            <th className="p1 border border-gray-900">Sacs Utilises (32.5)</th>
            <th className="p1 border border-gray-900">Sacs Utilises (42.5)</th>

            <th className="p1 border border-gray-900">Sacs Restants (32.5)</th>
            <th className="p1 border border-gray-900">Sacs Restants (42.5)</th>
          </thead>
          <tbody>
            {showInput && (
              <tr>
                <td className="p1 border border-gray-900">{-1}</td>

                <td className="p1 border border-gray-900">
                  <select
                    className=" border p-1 "
                    value={data.team}
                    onChange={(e) =>
                      setdata((old) => ({ ...old, team: e.target.value }))
                    }
                  >
                    {["A", "B", "C", "D"].map((eq) => (
                      <option value={eq}>{eq}</option>
                    ))}
                  </select>
                </td>

                <td className="p1 border border-gray-900">
                  {new Date().toDateString()}
                </td>

                <td className="p1 border border-gray-900">
                  <input
                    className=" w-16 "
                    value={data.sortis32}
                    onChange={(e) =>
                      setdata((old) => ({
                        ...old,
                        sortis32:
                          e.target.value === "" ? 0 : parseInt(e.target.value),
                      }))
                    }
                  />
                </td>

                <td className="p1 border border-gray-900">
                  {data.utilises32 / 20 || 0}
                  {/* <input
                    className=" w-16 "
                    value={data.tonnage32}
                    onChange={(e) =>
                      setdata((old) => ({
                        ...old,
                        tonnage32:
                          e.target.value === "" ? 0 : parseInt(e.target.value),
                      }))
                    }
                  /> */}
                </td>

                <td className="p1 border border-gray-900">
                  <input
                    className=" w-16 "
                    value={data.sortis42}
                    onChange={(e) =>
                      setdata((old) => ({
                        ...old,
                        sortis42:
                          e.target.value === "" ? 0 : parseInt(e.target.value),
                      }))
                    }
                  />
                </td>

                <td className="p1 border border-gray-900">
                  {data.utilises42 / 20 || 0}
                  {/* <input
                    className=" w-16 "
                    value={data.tonnage42}
                    onChange={(e) =>
                      setdata((old) => ({
                        ...old,
                        tonnage42:
                          e.target.value === "" ? 0 : parseInt(e.target.value),
                      }))
                    }
                  /> */}
                </td>

                <td className="p1 border border-gray-900">
                  <input
                    className=" w-16 "
                    value={data.dechires32}
                    onChange={(e) =>
                      setdata((old) => ({
                        ...old,
                        dechires32:
                          e.target.value === "" ? 0 : parseInt(e.target.value),
                      }))
                    }
                  />
                </td>

                <td className="p1 border border-gray-900">
                  <input
                    className=" w-16 "
                    value={data.dechires42}
                    onChange={(e) =>
                      setdata((old) => ({
                        ...old,
                        dechires42:
                          e.target.value === "" ? 0 : parseInt(e.target.value),
                      }))
                    }
                  />
                </td>

                <td className="p1 border border-gray-900">
                  <input
                    className=" w-16 "
                    value={data.utilises32}
                    onChange={(e) =>
                      setdata((old) => ({
                        ...old,
                        utilises32:
                          e.target.value === "" ? 0 : parseInt(e.target.value),
                      }))
                    }
                  />
                </td>

                <td className="p1 border border-gray-900">
                  <input
                    className=" w-16 "
                    value={data.utilises42}
                    onChange={(e) =>
                      setdata((old) => ({
                        ...old,
                        utilises42:
                          e.target.value === "" ? 0 : parseInt(e.target.value),
                      }))
                    }
                  />
                </td>

                <td className="p1 border border-gray-900">
                  {restants.s32 || 0}
                  {/*  <input
                    className=" w-16 "
                    value={data.restants32}
                    onChange={(e) =>
                      setdata((old) => ({
                        ...old,
                        restants32: e.target.value === "" ? 0 : parseInt(e.target.value),
                      }))
                    }
                  /> */}
                </td>

                <td className="p1 border border-gray-900">
                  {restants.s42 || 0}
                  {/*  <input
                    className=" w-16 "
                    value={data.restants42}
                    onChange={(e) =>
                      setdata((old) => ({
                        ...old,
                        restants42: e.target.value === "" ? 0 : parseInt(e.target.value),
                      }))
                    }
                  /> */}
                </td>
              </tr>
            )}

            {trans.map((t, i) => (
              <tr className={`  ${showInput ? "opacity-20" : ""}  `}>
                <td className="p1 border border-gray-900">{t.id}</td>

                <td className="p1 border border-gray-900">{t.team}</td>
                <td className="p1 border border-gray-900">{t.date}</td>
                <td className="p1 border border-gray-900">{t.sortis32}</td>
                <td className="p1 border border-gray-900">{t.tonnage32}</td>
                <td className="p1 border border-gray-900">{t.sortis42}</td>
                <td className="p1 border border-gray-900">{t.tonnage42}</td>

                <td className="p1 border border-gray-900">{t.dechires32}</td>
                <td className="p1 border border-gray-900">{t.dechires42}</td>
                <td className="p1 border border-gray-900">{t.utilises32}</td>
                <td className="p1 border border-gray-900">{t.utilises42}</td>

                <td className="p1 border border-gray-900">{t.restants32}</td>
                <td className="p1 border border-gray-900">{t.restants42}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Sacs() {
  const [curtab, setcurtab] = useState();
  const [trans_cont, set_trans_cont] = useState([]);
  const [trans_prod, set_trans_prod] = useState([]);
  const [stock_cont, set_stock_cont] = useState({ s32: 0, s42: 0 });

  function onSelectTab(t) {
    //console.log(t);
    setcurtab(t);
  }

  useEffect(() => {
    const isFirstRec = trans_cont.length === 1;

    if (isFirstRec) {
      set_stock_cont({ s32: trans_cont[0].s32, s42: trans_cont[0].s42 });
      //console.log("first rec", trans_cont);
    } else {
      const last_rec = { s32: 0, s42: 0 }; //trans_cont[trans_cont.length - 1];
      const { s32, s42 } = stock_cont;
      const news32 = parseInt(s32) + parseInt(last_rec.s32);
      const news42 = parseInt(s42) + parseInt(last_rec.s42);

      set_stock_cont({ s32: news32, s42: news42 });
    }
  }, [trans_cont]);

  function onAddTrans(type, data) {
    if (type === "cont") {
      set_trans_cont((old) => [...old, data]);
    } else {
      set_trans_prod((old) => [...old, data]);
    }
  }

  return (
    <div>
      <ContainerStock stock={stock_cont} />

      <TabCont tabs={SECTIONS} onSelectTab={onSelectTab} />
      {curtab && (
        <>
          {SECTIONS.PRODUCTION.label === curtab[1].label && (
            <SacsProduction trans={trans_prod} onAddTrans={onAddTrans} />
          )}
          {SECTIONS.CONTAINER.label === curtab[1].label && (
            <SacsContainer trans={trans_cont} onAddTrans={onAddTrans} />
          )}
          {SECTIONS.CALCULATOR.label === curtab[1].label && <SacsCalc />}
        </>
      )}
    </div>
  );
}
