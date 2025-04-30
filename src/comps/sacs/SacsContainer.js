import { useState } from "react";
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
} from "../../helpers/func";
import jsPDF from "jspdf";

export default function SacsContainer({
  trans,
  onAddTrans,
  stock,
  onResetStock,
}) {
  const [showInput, setShowInput] = useState(false);
  const [data, setdata] = useState({
    //id: 0,
    team: "A",
    op: SACS_CONTAINER_OPERATION_TYPE.IN,
    s32: 0,
    s42: 0,
    stockres: false,
    date_time: formatDateForDatetimeLocal(new Date()),
    fuzeren: "",
  });

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
      const { adj1, adj2, ...rest } = obj;

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
    //console.log(loads);
    //return;
    console.log("loads => ", loads);
    loads = transformData(loads);
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

  return (
    <div>
      <Stock id={STOCK_TYPE.CONTAINER} stock={stock} label={"CONTAINER"} />
      <div>
        {!showInput && (
          <div className=" flex ">
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
        <table>
          <thead>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              id
            </th>
            {/*   <th className="p1 border border-gray-900">Operation</th> */}
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Equipe
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              32.5
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              42.5
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Stock 32.5
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Stock 42.5
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Stock Reset
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Date
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Fuzeren
            </th>
          </thead>
          <tbody>
            {showInput && (
              <tr>
                <td className="p1 border border-gray-900">0</td>
                {/*   <td className="p1 border border-gray-900">in</td> */}
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
                  {/* new Date().toDateString() */}
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
                    {i}
                  </td>
                  {/*  <td className="p1 border border-gray-900">{t.op}</td> */}
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
                    {t.stockres ? "yes" : "no"}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {formatDateTime(t.date_time)}
                  </td>
                  <td className="p1 border border-gray-900 dark:border-white p-1 ">
                    {t.fuzeren}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
