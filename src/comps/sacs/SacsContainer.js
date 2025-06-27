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

export default function SacsContainer({
  trans,
  onAddTrans,
  stock,
  onResetStock,
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
  const date =
    trans.length > 0
      ? trans[0].date_time
      : new Date().toISOString().slice(0, 16);
  const d = {
    y: date.split("T")[0].split("-")[0],
    m: date.split("T")[0].split("-")[1],
  };
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

  function repeatChar(char = "*", count = 15) {
    return [...Array(count)].map((c, i) => char).join("");
  }

  function print(loads) {
    //console.log(loads);
    //return;
    console.log("loads => ", loads);
    loads = transformDataForPrint(loads);
    console.log("loads => ", loads);
    const doc = new jsPDF({ orientation: "landscape" });
    const FONT_SIZE = 9;
    const PW = 297;
    const PH = 210;
    let ty = -1;
    let tm = -1;

    doc.setFont("helvetica");
    doc.setFontSize(FONT_SIZE);

    let r = doc.addFont(
      "fonts/DroidSansFallback.ttf",
      "DroidSansFallback",
      "normal"
    );

    const body = loads;

    const defaultObject = {
      id: "18",
      created_at: "2025-04-09T08:07:50.009876+00:00",
      op: "in",
      s32: "0",
      s42: "100",
      team: "A",
      stock32: "0",
      stock42: "100",
      stockres: "false",
    };

    var headers = createHeaders(Object.keys(defaultObject));

    const tableConfig = {
      printHeaders: true,
      autoSize: true,
      margins: 0,
      fontSize: FONT_SIZE,
      padding: 2.5,
    };

    // body.push(def);

    doc.text(formatFrenchDate(new Date()), PW - 15, 10, { align: "right" });

    const doc_title = `SACS CONTAINER`;
    const file_name = `SACS_CONTAINER_${formatCreatedAt(
      new Date().toISOString()
    )}`;
    doc.text(doc_title, 105, 20, {
      align: "center",
    });

    doc.table(15, 25, body, headers, tableConfig);
    doc.save(file_name);
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
    <div>
      <Stock
        id={STOCK_TYPE.CONTAINER}
        stock={stock}
        label={GetRandomArray(LANG_TOKENS.CONTAINER_REST, user.lang)}
      />
      <div>
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
      <div className=" container  overflow-auto ">
        <div className=" text-center p-2 text-3xl   ">{title}</div>
        <table className=" table-auto w-full  ">
          <thead>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.TEAM, user.lang)}
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.DELIVERED_BAGS, user.lang) +
                " 32.5N"}
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.DELIVERED_BAGS, user.lang) +
                " 42.5N"}
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.STOCK, user.lang) + " 32.5N"}
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.STOCK, user.lang) + " 42.5N"}
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.PANDIAN, user.lang)}
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.DATE, user.lang) + " 32.5N"}
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.FUZEREN, user.lang) +
                " 32.5N"}
            </th>
          </thead>
          <tbody>
            {showInput && (
              <tr>
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
                  {" "}
                  <input
                    type="checkbox"
                    value={data.stockres}
                    onChange={(e) =>
                      setdata((old) => ({ ...old, stockres: e.target.checked }))
                    }
                  />{" "}
                </td>
                <td className="p1 border border-gray-900">
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
                <td className="p1 border border-gray-900">
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
                <tr key={i} className={`  ${showInput ? "opacity-20" : ""}   `}>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {t.team}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {t.s32}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {t.s42}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {t.stock32}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {t.stock42}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {t.stockres
                      ? GetTransForTokensArray(LANG_TOKENS.YES, user.lang)
                      : GetTransForTokensArray(LANG_TOKENS.NO, user.lang)}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {formatDateTime(t.date_time)}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
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
