import { useEffect, useRef, useState } from "react";
import {
  SACS_CONTAINER_OPERATION_TYPE,
  STOCK_TYPE,
  TRANSACTION_TYPE,
} from "../../helpers/flow";
import Stock from "./Stock";
import ButtonPrint from "../ButtonPrint";
import {
  formatCreatedAt,
  formatDateForDatetimeLocal,
  formatDateTime,
  formatFrenchDate,
  printPDF1,
} from "../../helpers/func";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";

export default function SacsProduction({
  trans,
  onAddTrans,
  stock,
  onResetStock,
}) {
  const [adjust, set_adjust] = useState(0);
  const [showAdjust, setShowAdjust] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [data, setdata] = useState({
    team: "A",
    sortis32: 0,
    tonnage32: 0,
    sortis42: 0,
    tonnage42: 0,
    dechires32: 0,
    dechires42: 0,
    utilises32: 0,
    utilises42: 0,
    date_time: formatDateForDatetimeLocal(new Date()),
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

  function repeatChar(char = "*", count = 15) {
    return [...Array(count)].map((c, i) => char).join("");
  }

  function createHeaders(keys) {
    var result = [];
    for (var i = 0; i < keys.length; i += 1) {
      result.push({
        id: keys[i],
        name: keys[i],
        prompt: keys[i],
        width: 80,
        align: "center",
        padding: 0,
      });
    }
    return result;
  }

  function transformData(dataArray) {
    return dataArray.map((obj) => {
      // Destructure to remove adj32 and adj42
      const { adj32, adj42, ...rest } = obj;

      // Convert all remaining values to strings
      const stringified = {};
      for (let key in rest) {
        if (key === "created_at") {
          stringified[key] = formatCreatedAt(rest[key]);
        } else {
          stringified[key] = String(rest[key]);
        }
      }

      return stringified;
    });
  }

  function print(loads) {
    console.log("loads => ", loads);
    loads = transformData(loads);
    console.log("loads => ", loads);
    const doc = new jsPDF({ orientation: "landscape" });
    const FONT_SIZE = 9;
    const PW = 297;
    let ty = -1;
    let tm = -1;

    doc.setFont("helvetica");
    doc.setFontSize(FONT_SIZE);

    let r = doc.addFont(
      "fonts/DroidSansFallback.ttf",
      "DroidSansFallback",
      "normal"
    );

    //console.log(r);

    const body = loads;

    const def = {
      id: "6",
      created_at: "2025-04-09T08:08:40",
      team: "A",
      sortis32: "0",
      tonnage32: "0",
      sortis42: "40",
      tonnage42: "0",
      dechires32: "0",
      dechires42: "20",
      utilises32: "0",
      utilises42: "0",
      restants32: "0",
      restants42: "20",
    };

    var headers = createHeaders(Object.keys(def));

    const tableConfig = {
      printHeaders: true,
      autoSize: true,
      margins: 0,
      fontSize: FONT_SIZE,
      padding: 2.5,
    };

    doc.text(formatFrenchDate(new Date()), PW - 15, 10, { align: "right" });

    const doc_title = `SACS PRODUCTION`;
    const file_name = `SACS_PRODUCTION_${formatCreatedAt(
      new Date().toISOString()
    )}`;
    doc.text(doc_title, 105, 20, {
      align: "center",
    });

    doc.table(15, 25, body, headers, tableConfig);
    doc.save(file_name);
  }

  return (
    <div>
      <Stock
        id={STOCK_TYPE.PRODUCTION}
        stock={stock}
        label={"PRODUCTION (RESTANTS)"}
        onResetStock={onResetStock}
      />
      <div>
        {!showInput && (
          <div className=" flex my-2 ">
            <button
              onClick={(e) => setShowInput(true)}
              className=" p-1 text-green-500 border rounded-md border-green-500 hover:text-white hover:bg-green-500 "
            >
              INSERT
            </button>
            <ButtonPrint onClick={(e) => print(trans)} />
          </div>
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
        <table className="table-auto w-full ">
          <thead>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              id
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Equipe
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Date
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Sacs Sortis{" "}
              <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
                32.5n
              </span>
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Tonnage{" "}
              <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
                32.5n
              </span>
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Sacs Sortis{" "}
              <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
                42.5n
              </span>
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Tonnage{" "}
              <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
                42.5n
              </span>
            </th>

            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Sacs Dechires{" "}
              <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
                32.5n
              </span>
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Sacs Dechires{" "}
              <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
                42.5n
              </span>
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Sacs Utilises{" "}
              <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
                32.5n
              </span>
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Sacs Utilises{" "}
              <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
                42.5n
              </span>
            </th>

            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Sacs Restants{" "}
              <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
                32.5n
              </span>
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Sacs Restants{" "}
              <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
                42.5
              </span>
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Ajust (Sacs Perdus )
            </th>
          </thead>
          <tbody>
            {showInput && (
              <tr>
                <td className="p1 border border-gray-900 dark:border-white p-1 ">
                  {-1}
                </td>

                <td className="p1 border border-gray-900 dark:border-white p-1 ">
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

                <td className="p1 border border-gray-900 dark:border-white p-1 ">
                  <input
                    type="datetime-local"
                    value={data.date_time}
                    onChange={(e) => {
                      let selDate = new Date(e.target.value);
                      selDate = formatDateForDatetimeLocal(selDate);
                      setdata((old) => ({
                        ...old,
                        date_time: selDate,
                      }));
                    }}
                  />
                </td>

                <td className="p1 border border-gray-900 dark:border-white p-1 ">
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

                <td className="p1 border border-gray-900 dark:border-white p-1 ">
                  {data.utilises32 / 20 || 0}
                </td>

                <td className="p1 border border-gray-900 dark:border-white p-1 ">
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

                <td className="p1 border border-gray-900 dark:border-white p-1 ">
                  {data.utilises42 / 20 || 0}
                </td>

                <td className="p1 border border-gray-900 dark:border-white p-1 ">
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

                <td className="p1 border border-gray-900 dark:border-white p-1 ">
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

                <td className="p1 border border-gray-900 dark:border-white p-1 ">
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

                <td className="p1 border border-gray-900 dark:border-white p-1 ">
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

                <td className="p1 border border-gray-900 dark:border-white p-1 ">
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

                <td className="p1 border border-gray-900 dark:border-white p-1 ">
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

                <td className="p1 border border-gray-900 dark:border-white p-1 "></td>
              </tr>
            )}

            {!showInput &&
              trans.map((t, i) => (
                <tr
                  className={`  ${
                    showInput ? "opacity-20" : ""
                  } cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700
                  
                  ${
                    (t.adj32 || 0) !== 0 || (t.adj42 || 0) !== 0
                      ? "border-red-500 bg-red-100 border-2"
                      : ""
                  } 
                  
                  `}
                >
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {i}
                  </td>

                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {t.team}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {formatDateTime(t.date_time)}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {t.sortis32}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {t.tonnage32} T.
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {t.sortis42}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {t.tonnage42} T.
                  </td>

                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {t.dechires32}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {t.dechires42}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {t.utilises32}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {t.utilises42}
                  </td>

                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    <div>{t.restants32}</div>
                    {(t.adj32 || 0) !== 0 && (
                      <div className=" bg-red-500 text-xs p-1 w-min  m-1 rounded-md text-white ">
                        {" "}
                        {t.restants32 - t.adj32}{" "}
                      </div>
                    )}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    <div>{t.restants42}</div>
                    {(t.adj42 || 0) !== 0 && (
                      <div className=" bg-red-500 text-xs p-1 w-min m-1 rounded-md text-white ">
                        {" "}
                        {t.restants42 - t.adj42}{" "}
                      </div>
                    )}
                  </td>
                  <td className="p-1 border border-gray-900 dark:border-white p-1  font-bold text-xs  ">
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
