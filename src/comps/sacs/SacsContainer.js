import { useContext, useState } from "react";
import {
  DAIZI_FUZEREN,
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
} from "../../helpers/func";
import jsPDF from "jspdf";
import {
  GetTransForTokensArray,
  LANG_TOKENS,
} from "../../helpers/lang_strings";
import {
  createHeaders,
  GetRandomArray,
  transformDataForPrint,
} from "../../helpers/funcs_print";
import { UserContext } from "../../App";
import save from "../../img/save.png";
import cancel from "../../img/eraser.png";
import Excelexport from "../Excelexport";
import add from "../../img/add.png";
import reload from "../../img/reload.png";

export default function SacsContainer({
  trans,
  onAddTrans,
  stock,
  onResetStock,
  onReload,
}) {
  const [, , user] = useContext(UserContext);
  const [showInput, setShowInput] = useState(false);
  const [data, setdata] = useState({
    //id: 0,
    team: "A",
    op: SACS_CONTAINER_OPERATION_TYPE.IN,
    s32: 0,
    s42: 0,
    stockres: false,
    date_time: formatDateForDatetimeLocal(new Date()),
    fuzeren: "谭义勇",
  });

  const dateFromRec = trans.length > 0;
  const date = dateFromRec
    ? trans[0].date_time
    : new Date().toISOString().slice(0, 16);
  const d = {
    y: date.split("T")[0].split("-")[0],
    m: date.split("T")[0].split("-")[1],
  };

  if (dateFromRec) {
    d.m = (parseInt(d.m) + 1).toString().padStart(2, "0");
  }

  const title = GetTransForTokensArray(
    LANG_TOKENS.RECORDS_TITLE_CONT,
    user.lang,
    {
      y: d.y,
      m: d.m,
    }
  );

  function onSaveTrans() {
    if (data.s32 === undefined || data.s42 === undefined) {
      alert("Please input sacs amount!");
      return;
    }

    setShowInput(false);
    onAddTrans(TRANSACTION_TYPE.CONTAINER, data);
    setdata({
      //id: 0,
      team: "A",
      op: SACS_CONTAINER_OPERATION_TYPE.IN,
      s32: 0,
      s42: 0,
    });
  }

  function TranslateColsData(data) {
    const stock32 = GetTransForTokensArray(LANG_TOKENS.STOCK_TOTAL, user.lang, {
      b: " 32.5N",
    });
    const stock42 = GetTransForTokensArray(LANG_TOKENS.STOCK_TOTAL, user.lang, {
      b: "42.5N",
    });
    const team = GetTransForTokensArray(LANG_TOKENS.TEAM, user.lang);
    const sortis32 = GetTransForTokensArray(LANG_TOKENS.BAGS_OUT, user.lang, {
      b: " 32.5N",
    });
    const sortis42 = GetTransForTokensArray(LANG_TOKENS.BAGS_OUT, user.lang, {
      b: " 42.5N",
    });
    const date_time = GetTransForTokensArray(LANG_TOKENS.DATE, user.lang);
    const fuzeren = GetTransForTokensArray(LANG_TOKENS.FUZEREN, user.lang);

    const fd = data.map((it) => {
      const item = {
        [stock32]: it.stock32,
        [stock42]: it.stock42,
        [team]: it.team,
        [sortis32]: it.s32,
        [sortis42]: it.s42,
        [date_time]: it.date_time,
        [fuzeren]: it.fuzeren,
      };

      return item;
    });

    return fd;
  }

  return (
    <div className=" pb-8    ">
      <Stock
        id={STOCK_TYPE.CONTAINER}
        stock={stock}
        label={GetTransForTokensArray(LANG_TOKENS.CONTAINER_REST, user.lang)}
      />
      <div>
        <div className=" text-center p-2 text-3xl my-4   ">{title}</div>
        {!showInput && (
          <div className=" flex  flex-col items-center md:flex-row md:justify-center  ">
            <ButtonPrint
              icon={add}
              title={GetTransForTokensArray(
                LANG_TOKENS.DELIVER_BAGS,
                user.lang
              )}
              onClick={(e) => setShowInput(true)}
            />

            <Excelexport
              excelData={GenerateExcelData(TranslateColsData(trans))}
            />

            <ButtonPrint
              icon={reload}
              title={GetTransForTokensArray(LANG_TOKENS.RELOAD, user.lang)}
              onClick={onReload}
            />
          </div>
        )}

        {showInput && (
          <div className=" flex  flex-col items-center md:flex-row md:justify-center   ">
            <ButtonPrint
              onClick={onSaveTrans}
              title={GetTransForTokensArray(LANG_TOKENS.SAVE, user.lang)}
              icon={save}
            />
            <ButtonPrint
              onClick={(e) => setShowInput(false)}
              title={GetTransForTokensArray(LANG_TOKENS.CANCEL, user.lang)}
              icon={cancel}
            />
          </div>
        )}
      </div>
      <div className=" container  overflow-auto  mx-auto ">
        <table className=" table-auto w-full  ">
          <thead>
            <th className=" border border-gray-900 dark:border-white p-2 ">
              {GetTransForTokensArray(LANG_TOKENS.TEAM, user.lang)}
            </th>
            <th className=" border border-gray-900 dark:border-white p-2 ">
              {GetTransForTokensArray(LANG_TOKENS.DELIVERED_BAGS, user.lang) +
                " 32.5N"}
            </th>
            <th className=" border border-gray-900 dark:border-white p-2 ">
              {GetTransForTokensArray(LANG_TOKENS.DELIVERED_BAGS, user.lang) +
                " 42.5N"}
            </th>
            <th className=" border border-gray-900 dark:border-white p-2 ">
              {GetTransForTokensArray(LANG_TOKENS.STOCK, user.lang) + " 32.5N"}
            </th>
            <th className=" border border-gray-900 dark:border-white p-2 ">
              {GetTransForTokensArray(LANG_TOKENS.STOCK, user.lang) + " 42.5N"}
            </th>
            <th className=" border border-gray-900 dark:border-white p-2 ">
              {GetTransForTokensArray(LANG_TOKENS.PANDIAN, user.lang)}
            </th>
            <th className=" border border-gray-900 dark:border-white p-2 ">
              {GetTransForTokensArray(LANG_TOKENS.DATE, user.lang) + " 32.5N"}
            </th>
            <th className=" border border-gray-900 dark:border-white p-2 ">
              {GetTransForTokensArray(LANG_TOKENS.FUZEREN, user.lang)}
            </th>
          </thead>
          <tbody>
            {showInput && (
              <tr>
                <td className=" border border-gray-900">
                  <select
                    className=" border p-2 "
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
                <td className=" border border-gray-900">
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
                <td className=" border border-gray-900">
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

                <td className=" border border-gray-900"> - </td>
                <td className=" border border-gray-900"> - </td>
                <td className=" border border-gray-900">
                  {" "}
                  <input
                    type="checkbox"
                    value={data.stockres}
                    onChange={(e) =>
                      setdata((old) => ({ ...old, stockres: e.target.checked }))
                    }
                  />{" "}
                </td>
                <td className=" border border-gray-900">
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
                <td className=" border border-gray-900">
                  {
                    <select
                      value={data.fuzeren}
                      onChange={(e) =>
                        setdata((old) => ({ ...old, fuzeren: e.target.value }))
                      }
                    >
                      {DAIZI_FUZEREN.map((eq) => (
                        <option value={eq}>{eq}</option>
                      ))}
                    </select>
                  }
                </td>
              </tr>
            )}
            {!showInput &&
              trans.map((t, i) => (
                <tr
                  key={i}
                  className={`  ${
                    showInput ? "opacity-20" : ""
                  } hover:bg-orange-900/20 cursor-pointer   `}
                >
                  <td className=" border border-gray-900 dark:border-white p-2 ">
                    {t.team}
                  </td>
                  <td className=" border border-gray-900 dark:border-white p-2 ">
                    {t.s32}
                  </td>
                  <td className=" border border-gray-900 dark:border-white p-2 ">
                    {t.s42}
                  </td>
                  <td className=" border border-gray-900 dark:border-white p-2 ">
                    {t.stock32}
                  </td>
                  <td className=" border border-gray-900 dark:border-white p-2 ">
                    {t.stock42}
                  </td>
                  <td className=" border border-gray-900 dark:border-white p-2 ">
                    {t.stockres
                      ? GetTransForTokensArray(LANG_TOKENS.YES, user.lang)
                      : GetTransForTokensArray(LANG_TOKENS.NO, user.lang)}
                  </td>
                  <td className=" border border-gray-900 dark:border-white p-2 ">
                    {formatDateTime(t.date_time)}
                  </td>
                  <td className=" border border-gray-900 dark:border-white p-2 ">
                    {GetTransForTokensArray(LANG_TOKENS.FUZEREN, user.lang)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
