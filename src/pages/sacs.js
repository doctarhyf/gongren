import React, { useContext, useEffect, useRef, useState } from "react";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import useDataLoader from "../hooks/useDataLoader";
import { TABLES_NAMES } from "../helpers/sb.config";
import {
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  CLASS_TD,
  STOCK_RESET_PWD,
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

const TRANSACTION_TYPE = {
  CONTAINER: "cont",
  PRODUCTION: "prod",
};

const SACS_CONTASINER_OPERATION_TYPE = {
  IN: "in",
  OUT: "out",
};

const SACS_SECTIONS = {
  CONTAINER: { label: "Sacs Container" },
  PRODUCTION: { label: "Sacs Production" },
  CALCULATOR: { label: "Sacs Calculator" },
};

function Stock({ stock, label, onResetStock }) {
  return (
    <div className=" py-4 border rounded-md p-1 bg-slate-300/50 ">
      <div className=" font-bold  ">STOCK {label}</div>

      <div className=" flex flex-col ">
        <div>
          {" "}
          <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
            32.5n
          </span>{" "}
          :<span className=" font-bold "> {stock.s32}</span>{" "}
        </div>
        <div>
          {" "}
          <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
            42.5n
          </span>{" "}
          : <span className=" font-bold ">{stock.s42}</span>{" "}
        </div>
      </div>

      {onResetStock && (
        <button
          onClick={(e) => {
            // Prompt the user to enter the password
            let password = prompt("Please enter your password before reset!");

            // Check if the password is correct
            if (password === STOCK_RESET_PWD) {
              // Execute the function if the password is correct
              onResetStock();
            } else {
              // Alert the user if the password is incorrect
              alert("Incorrect password. Please try again.");
            }
          }}
          className="p-1 text-sm hover:bg-sky-500 hover:text-white text-sky-500 rounded-md"
        >
          RESET
        </button>
      )}
    </div>
  );
}

function SacsContainer({ trans, onAddTrans, stock }) {
  const [showInput, setShowInput] = useState(false);
  const [data, setdata] = useState({
    id: 0,
    team: "A",
    op: SACS_CONTASINER_OPERATION_TYPE.IN,
    s32: 0,
    s42: 0,
  });

  function onSaveTrans() {
    if (data.s32 === undefined || data.s42 === undefined) {
      alert("Please input sacs amount!");
      return;
    }

    setShowInput(false);
    onAddTrans(TRANSACTION_TYPE.CONTAINER, data);
    setdata({
      id: 0,
      team: "A",
      op: SACS_CONTASINER_OPERATION_TYPE.IN,
      s32: 0,
      s42: 0,
    });
  }

  return (
    <div>
      {/*   <Stock stock={stock} label={"CONTAINER"} /> */}
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
          <>
            <button
              onClick={onSaveTrans}
              className=" p-1 text-sky-500 border rounded-md border-sky-500 hover:text-white hover:bg-sky-500 "
            >
              SAVE
            </button>
            <button
              onClick={(e) => setShowInput(false)}
              className=" p-1 text-red-500 border rounded-md border-red-500 hover:text-white hover:bg-red-500 "
            >
              CANCEL
            </button>
          </>
        )}
      </div>
      <div className=" container  ">
        <table>
          <thead>
            <th className="p1 border border-gray-900">id</th>
            <th className="p1 border border-gray-900">Operation</th>
            <th className="p1 border border-gray-900">Equipe</th>
            <th className="p1 border border-gray-900">32.5</th>
            <th className="p1 border border-gray-900">42.5</th>
            <th className="p1 border border-gray-900">Stock 32.5</th>
            <th className="p1 border border-gray-900">Stock 42.5</th>
            <th className="p1 border border-gray-900">Date</th>
          </thead>
          <tbody>
            {showInput && (
              <tr>
                <td className="p1 border border-gray-900">0</td>
                <td className="p1 border border-gray-900">in</td>
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
                <td className="p1 border border-gray-900"> - </td>
                <td className="p1 border border-gray-900"> - </td>
                <td className="p1 border border-gray-900">
                  {new Date().toDateString()}
                </td>
              </tr>
            )}
            {!showInput &&
              trans.map((t, i) => (
                <tr className={`  ${showInput ? "opacity-20" : ""}   `}>
                  <td className="p1 border border-gray-900">{i}</td>
                  <td className="p1 border border-gray-900">{t.op}</td>
                  <td className="p1 border border-gray-900">{t.team}</td>
                  <td className="p1 border border-gray-900">{t.s32}</td>
                  <td className="p1 border border-gray-900">{t.s42}</td>
                  <td className="p1 border border-gray-900">{t.stock32}</td>
                  <td className="p1 border border-gray-900">{t.stock42}</td>
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

function SacsProduction({ trans, onAddTrans, stock, setStock }) {
  const [adjust, set_adjust] = useState(0);
  const [showAdjust, setShowAdjust] = useState(false);
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

  const [restants, set_restants] = useState({ s32: 0, s42: 0 });

  useEffect(() => {
    const trouves32 = stock.s32;
    const trouves42 = stock.s42;

    const newr32 =
      data.sortis32 + trouves32 - data.utilises32 - data.dechires32;
    const newr42 =
      data.sortis42 + trouves42 - data.utilises42 - data.dechires42;

    const adj32 = showAdjust ? adjust.s32 : 0;
    const adj42 = showAdjust ? adjust.s42 : 0;

    set_restants({ s32: newr32 + adj32 || 0, s42: newr42 + adj42 || 0 });
  }, [data, adjust]);

  function onSaveTrans() {
    console.log(data);

    setShowInput(false);
    onAddTrans("prod", {
      ...data,
      date: new Date().toISOString(),
      tonnage32: data.utilises32 / 20 || 0,
      tonnage42: data.utilises42 / 20 || 0,
      restants32: restants.s32,
      restants42: restants.s42,
      adj32: adjust.s32,
      adj42: adjust.s42,
    });
    //reset

    setdata({
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
  }

  return (
    <div>
      <Stock
        stock={stock}
        label={"RESTANTS"}
        onResetStock={(e) => setStock({ s32: 0, s42: 0 })}
      />
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
          <>
            <button
              onClick={onSaveTrans}
              className=" p-1 text-sky-500 border rounded-md border-sky-500 hover:text-white hover:bg-sky-500 "
            >
              SAVE
            </button>
            <button
              onClick={(e) => setShowInput(false)}
              className=" p-1 text-red-500 border rounded-md border-red-500 hover:text-white hover:bg-red-500 "
            >
              CANCEL
            </button>
          </>
        )}
      </div>
      <div className=" container  ">
        <table>
          <thead>
            <th className="p1 border border-gray-900">id</th>
            <th className="p1 border border-gray-900">Equipe</th>
            <th className="p1 border border-gray-900">Date</th>
            <th className="p1 border border-gray-900">
              Sacs Sortis{" "}
              <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
                32.5n
              </span>
            </th>
            <th className="p1 border border-gray-900">
              Tonnage{" "}
              <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
                32.5n
              </span>
            </th>
            <th className="p1 border border-gray-900">
              Sacs Sortis{" "}
              <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
                42.5n
              </span>
            </th>
            <th className="p1 border border-gray-900">
              Tonnage{" "}
              <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
                42.5n
              </span>
            </th>

            <th className="p1 border border-gray-900">
              Sacs Dechires{" "}
              <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
                32.5n
              </span>
            </th>
            <th className="p1 border border-gray-900">
              Sacs Dechires{" "}
              <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
                42.5n
              </span>
            </th>
            <th className="p1 border border-gray-900">
              Sacs Utilises{" "}
              <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
                32.5n
              </span>
            </th>
            <th className="p1 border border-gray-900">
              Sacs Utilises{" "}
              <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
                42.5n
              </span>
            </th>

            <th className="p1 border border-gray-900">
              Sacs Restants{" "}
              <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
                32.5n
              </span>
            </th>
            <th className="p1 border border-gray-900">
              Sacs Restants{" "}
              <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
                42.5
              </span>
            </th>
            <th className="p1 border border-gray-900">Ajust (Sacs Perdus )</th>
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
                  <div>
                    <input
                      type="checkbox"
                      value={showAdjust}
                      onChange={(e) => setShowAdjust(e.target.checked)}
                    />
                    Adjust
                    {showAdjust && (
                      <input
                        type="text"
                        value={adjust.s32}
                        onChange={(e) =>
                          set_adjust((old) => ({
                            ...old,
                            s32: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
                    )}
                  </div>
                </td>

                <td className="p1 border border-gray-900">
                  {restants.s42 || 0}
                  <div>
                    <input
                      type="checkbox"
                      value={showAdjust}
                      onChange={(e) => setShowAdjust(e.target.checked)}
                    />
                    Adjust
                    {showAdjust && (
                      <input
                        type="text"
                        value={adjust.s42}
                        onChange={(e) =>
                          set_adjust((old) => ({
                            ...old,
                            s42: isNaN(parseInt(e.target.value))
                              ? 0
                              : parseInt(e.target.value),
                          }))
                        }
                      />
                    )}
                  </div>
                </td>

                <td className="p1 border border-gray-900"></td>
              </tr>
            )}

            {!showInput &&
              trans.map((t, i) => (
                <tr
                  className={`  ${
                    showInput ? "opacity-20" : ""
                  } cursor-pointer hover:bg-slate-300 
                  
                  ${
                    (t.adj32 || 0) !== 0 || (t.adj42 || 0) !== 0
                      ? "border-red-500 bg-red-100 border-2"
                      : ""
                  } 
                  
                  `}
                >
                  <td className="p1 border border-gray-900">{i}</td>

                  <td className="p1 border border-gray-900">{t.team}</td>
                  <td className="p1 border border-gray-900">{t.date}</td>
                  <td className="p1 border border-gray-900">{t.sortis32}</td>
                  <td className="p1 border border-gray-900">
                    {t.tonnage32} T.
                  </td>
                  <td className="p1 border border-gray-900">{t.sortis42}</td>
                  <td className="p1 border border-gray-900">
                    {t.tonnage42} T.
                  </td>

                  <td className="p1 border border-gray-900">{t.dechires32}</td>
                  <td className="p1 border border-gray-900">{t.dechires42}</td>
                  <td className="p1 border border-gray-900">{t.utilises32}</td>
                  <td className="p1 border border-gray-900">{t.utilises42}</td>

                  <td className="p1 border border-gray-900">
                    <div>{t.restants32}</div>
                    {(t.adj32 || 0) !== 0 && (
                      <div className=" bg-red-500 text-xs p-1 w-min  m-1 rounded-md text-white ">
                        {" "}
                        {t.restants32 - t.adj32}{" "}
                      </div>
                    )}
                  </td>
                  <td className="p1 border border-gray-900">
                    <div>{t.restants42}</div>
                    {(t.adj42 || 0) !== 0 && (
                      <div className=" bg-red-500 text-xs p-1 w-min m-1 rounded-md text-white ">
                        {" "}
                        {t.restants42 - t.adj42}{" "}
                      </div>
                    )}
                  </td>
                  <td className="p-1 border border-gray-900 font-bold text-xs  ">
                    {(t.adj42 || 0) !== 0 && (
                      <div className=" w-full text-center mx-1 bg-black text-white p-1 rounded-md ">
                        {(t.adj42 || 0) * -1} (42.5)
                      </div>
                    )}

                    {(t.adj32 || 0) !== 0 && (
                      <div className=" w-[80%] text-center mx-1 bg-green-500 text-white p-1 rounded-md ">
                        {(t.adj32 || 0) * -1} (32.5)
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Sacs() {
  const [curtab, setcurtab] = useState(Object.entries(SACS_SECTIONS)[0]);
  const [trans_cont, set_trans_cont] = useState([]);
  const [trans_prod, set_trans_prod] = useState([]);
  const [stock_cont, set_stock_cont] = useState({ s32: 0, s42: 0 });
  const [stock_prod, set_stock_prod] = useState({ s32: 0, s42: 0 });

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
    console.log(data);

    if (type === TRANSACTION_TYPE.CONTAINER) {
      const { s32, s42 } = stock_cont;

      const news32 =
        data.op === SACS_CONTASINER_OPERATION_TYPE.IN
          ? s32 + data.s32
          : s32 - data.s32;
      const news42 =
        data.op === SACS_CONTASINER_OPERATION_TYPE.IN
          ? s42 + data.s42
          : s42 - data.s42;

      set_trans_cont((old) => [
        ...old,
        { ...data, stock32: news32, stock42: news42 },
      ]);

      set_stock_cont({ s32: news32, s42: news42 });

      if (data.op === "out") {
        const { s32, s42 } = stock_prod;
        const ns32 = s32 + data.s32;
        const ns42 = s42 + data.s42;

        set_stock_prod({ s32: ns32, s42: ns42 });
      }
    } else {
      // production
      set_trans_prod((old) => [...old, data]);
      set_stock_prod({ s32: data.restants32, s42: data.restants42 });

      console.log("data", data);
      console.log("stock_cont", stock_cont);

      const { sortis32, sortis42 } = data;
      const { s32, s42 } = stock_cont;

      const newst = { s32: s32 - sortis32, s42: s42 - sortis42 };

      console.log("news", newst);

      set_stock_cont(newst);
    }
  }

  return (
    <div>
      <Stock
        stock={stock_cont}
        label={"CONTAINER"}
        onResetStock={(e) => set_stock_cont({ s32: 0, s42: 0 })}
      />
      <TabCont tabs={SACS_SECTIONS} onSelectTab={onSelectTab} />
      {curtab && (
        <>
          {SACS_SECTIONS.PRODUCTION.label === curtab[1].label && (
            <SacsProduction
              trans={trans_prod}
              onAddTrans={onAddTrans}
              stock={stock_prod}
              setStock={set_stock_prod}
            />
          )}
          {SACS_SECTIONS.CONTAINER.label === curtab[1].label && (
            <SacsContainer
              trans={trans_cont}
              onAddTrans={onAddTrans}
              stock={stock_cont}
            />
          )}
          {SACS_SECTIONS.CALCULATOR.label === curtab[1].label && <SacsCalc />}
        </>
      )}
    </div>
  );
}
