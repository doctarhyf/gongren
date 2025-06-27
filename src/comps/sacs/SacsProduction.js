import { useContext, useEffect, useRef, useState } from "react";
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
  GenerateExcelData,
  printPDF1,
} from "../../helpers/func";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import {
  GetTransForTokensArray,
  LANG_TOKENS,
} from "../../helpers/lang_strings";
import { UserContext } from "../../App";
import add from "../../img/add.png";
import save from "../../img/save.png";
import cancel from "../../img/eraser.png";
import Excelexport from "../Excelexport";

export default function SacsProduction({
  trans,
  onAddTrans,
  stock,
  onResetStock,
}) {
  const [, , user] = useContext(UserContext);
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

  const date =
    trans.length > 0
      ? trans[0].date_time
      : new Date().toISOString().slice(0, 16);
  const d = {
    y: date.split("T")[0].split("-")[0],
    m: date.split("T")[0].split("-")[1],
  };
  const title = GetTransForTokensArray(
    LANG_TOKENS.RECORDS_TITLE_PROD,
    user.lang,
    {
      y: d.y,
      m: d.m,
    }
  );

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

  function TranslateColsTitles(data) {
    const date_time = GetTransForTokensArray(LANG_TOKENS.DATE, user.lang);
    const team = GetTransForTokensArray(LANG_TOKENS.TEAM, user.lang);
    const sortis32 = GetTransForTokensArray(LANG_TOKENS.BAGS_USED, user.lang, {
      b: "32.5N",
    });
    const sortis42 = GetTransForTokensArray(LANG_TOKENS.BAGS_USED, user.lang, {
      b: "42.5N",
    });
    const t32 = GetTransForTokensArray(LANG_TOKENS.T) + " 32.5N";
    const t42 = GetTransForTokensArray(LANG_TOKENS.T) + " 42.5N";
    const dechires32 =
      GetTransForTokensArray(LANG_TOKENS.TORN_BAGS, user.lang) + " 32.5N";
    const dechires42 =
      GetTransForTokensArray(LANG_TOKENS.TORN_BAGS, user.lang) + " 42.5N";
    const utilises32 = GetTransForTokensArray(
      LANG_TOKENS.BAGS_USED,
      user.lang,
      { b: " 32.5N" }
    );
    const utilises42 = GetTransForTokensArray(
      LANG_TOKENS.BAGS_USED,
      user.lang,
      { b: " 42.5N" }
    );
    const restants32 = GetTransForTokensArray(
      LANG_TOKENS.BAGS_REMAINING,
      user.lang,
      { b: " 32.5N" }
    );
    const restants42 = GetTransForTokensArray(
      LANG_TOKENS.BAGS_REMAINING,
      user.lang,
      { b: " 42.5N" }
    );

    const finalData = data.map((it) => {
      const item = {
        [team]: it.team,
        [date_time]: it.date_time,
        [sortis32]: it.sortis32,
        [t32]: it.tonnage32,
        [sortis42]: it.sortis42,
        [t42]: it.tonnage42,
        [dechires32]: it.dechires32,
        [dechires42]: it.dechires42,
        [utilises32]: it.utilises32,
        [utilises42]: it.utilises42,
        [restants32]: it.restants32,
        [restants42]: it.restants42,
        fuzeren: "",
      };

      return item;
    });

    console.log("fd : ", finalData);

    return finalData;
  }

  return (
    <div>
      <Stock
        id={STOCK_TYPE.PRODUCTION}
        stock={stock}
        label={GetTransForTokensArray(LANG_TOKENS.PROD_REST, user.lang)}
        onResetStock={onResetStock}
      />
      <div>
        {!showInput && (
          <div className=" flex  flex-col items-center md:flex-row md:justify-center  ">
            <ButtonPrint
              title={GetTransForTokensArray(
                LANG_TOKENS.DELIVER_BAGS,
                user.lang
              )}
              onClick={(e) => setShowInput(true)}
              icon={add}
            />
            {/*  <ButtonPrint onClick={(e) => print(trans)} /> */}
            <Excelexport
              excelData={GenerateExcelData(TranslateColsTitles(trans))}
              fileName={GetTransForTokensArray(
                LANG_TOKENS.PRODUCTION_BAGS_MANAGEMENT,
                user.lang
              )}
            />
          </div>
        )}

        {showInput && (
          <div className=" flex  flex-col items-center md:flex-row md:justify-center ">
            <ButtonPrint
              onClick={onSaveTrans}
              title={GetTransForTokensArray(LANG_TOKENS.SAVE, user.lang)}
              icon={save}
            />

            <ButtonPrint
              onClick={(e) => setShowInput(false)}
              icon={cancel}
              title={GetTransForTokensArray(LANG_TOKENS.CANCEL, user.lang)}
            />
          </div>
        )}
      </div>
      <div className=" container  overflow-auto ">
        <div className=" text-center p-2 text-3xl m-4   ">{title}</div>
        <table className="table-auto w-full ">
          <thead>
            {/*  <th className="p1 border border-gray-900 dark:border-white p-1 ">
              id
            </th> */}
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.TEAM, user.lang)}
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.DATE, user.lang)}
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.DELIVERED_BAGS, user.lang)}
              <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
                32.5N
              </span>
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.T, user.lang)}
              <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
                32.5N
              </span>
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.DELIVERED_BAGS, user.lang)}
              <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
                42.5N
              </span>
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.T, user.lang)}
              <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
                42.5N
              </span>
            </th>

            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.TORN_BAGS, user.lang)}
              <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
                32.5N
              </span>
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.TORN_BAGS, user.lang)}
              <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
                42.5N
              </span>
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.BAGS_USED, user.lang)}
              <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
                32.5N
              </span>
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.BAGS_USED, user.lang)}
              <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
                42.5N
              </span>
            </th>

            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.BAGS_REMAINING, user.lang)}
              <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
                32.5N
              </span>
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.BAGS_REMAINING, user.lang)}
              <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
                42.5N
              </span>
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.PANDIAN, user.lang)}
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
                  {/*  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {i}
                  </td> */}

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
                  <td className=" border border-gray-900 dark:border-white p-1  font-bold text-xs  ">
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
