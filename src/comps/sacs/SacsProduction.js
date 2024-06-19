import { useEffect, useState } from "react";
import {
  SACS_CONTAINER_OPERATION_TYPE,
  TRANSACTION_TYPE,
} from "../../helpers/flow";
import Stock from "./Stock";

export default function SacsProduction({ trans, onAddTrans, stock, setStock }) {
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
