import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import * as SB from "../../helpers/sb";
import { TABLES_NAMES } from "../../helpers/sb.config";
import {
  formatCreatedAt,
  formatDateForDatetimeLocal,
  formatFrenchDate,
} from "../../helpers/func";
import { CLASS_SELECT, DAIZI_FUZEREN, MONTHS } from "../../helpers/flow";
import ButtonPrint from "../ButtonPrint";
import {
  GetTransForTokensArray,
  LANG_TOKENS,
} from "../../helpers/lang_strings";
import jsPDF from "jspdf";
import {
  createHeaders,
  transformDataForPrint,
} from "../../helpers/funcs_print";
import Loading from "../Loading";
import ContainerStock from "./ContainerStock";
import MonthFilter from "./MonthFilter";

function TableContainer({ trans, onAdd }) {
  const [, , user] = useContext(UserContext);

  function onPrint(loads) {
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

    /*

{
    "id": 16,
    "created_at": "2025-05-29T13:02:46.659377+00:00",
    "date_time": "2025-05-29 15:02",
    "operation": "out",
    "s32": 0,
    "s42": 4500,
    "stock32": 30000,
    "stock42": 45500,
    "fuzeren": "谭义勇",
    "team": "A",
    "stockRes": false,
    "key": "811dfeef-fc8d-428f-a899-9245926b2401"
}
      */

    const defaultObject = {
      id: 16,
      created_at: "2025-05-29T13:02:46.659377+00:00",
      date_time: "2025-05-29 15:02",
      operation: "out",
      s32: 0,
      s42: 4500,
      stock32: 30000,
      stock42: 45500,
      fuzeren: "谭义勇",
      team: "A",
      stockRes: false,
      key: "811dfeef-fc8d-428f-a899-9245926b2401",
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
      <div>CONTAINER</div>
      <div>
        <button className="btn btn-primary" onClick={onAdd}>
          Add
        </button>
        <ButtonPrint
          title={GetTransForTokensArray(LANG_TOKENS.PRINT, user.lang)}
          onClick={(e) => onPrint(trans)}
        />
      </div>
      {trans.length > 0 ? (
        <table class="table-auto">
          <thead className="p1 border border-gray-900 dark:border-white p-1 ">
            <tr>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                ID
              </th>
              {/*  <th className="p1 border border-gray-900 dark:border-white p-1 ">
        created
      </th> */}
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                DATE TIME
              </th>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                OP
              </th>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                s32
              </th>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                s42
              </th>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                stock32
              </th>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                stock42
              </th>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                fuzeren
              </th>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                team
              </th>
            </tr>
          </thead>
          <tbody>
            {trans.map((item) => (
              <tr key={item.id}>
                <td className="p1 border border-gray-900 dark:border-white p-1 ">
                  {item.id}
                </td>
                {/*   <td className="p1 border border-gray-900 dark:border-white p-1 ">
          {formatCreatedAt(item.created_at)}
        </td> */}
                <td className="p1 border border-gray-900 dark:border-white p-1 ">
                  {item.date_time.replace("T", " ")}
                </td>
                <td className="p1 border border-gray-900 dark:border-white p-1 ">
                  {item.operation}
                </td>
                <td className="p1 border border-gray-900 dark:border-white p-1 ">
                  {item.s32}
                </td>
                <td className="p1 border border-gray-900 dark:border-white p-1 ">
                  {item.s42}
                </td>
                <td className="p1 border border-gray-900 dark:border-white p-1 ">
                  {item.stock32}
                </td>
                <td className="p1 border border-gray-900 dark:border-white p-1 ">
                  {item.stock42}
                </td>
                <td className="p1 border border-gray-900 dark:border-white p-1 ">
                  {item.fuzeren}
                </td>
                <td className="p1 border border-gray-900 dark:border-white p-1 ">
                  {item.team}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className=" bg-red-900 text-red-400 p-2 rounded-md text-sm ">
          {GetTransForTokensArray(LANG_TOKENS.CONATINER_IS_EMPTY, user.lang)}
        </div>
      )}
    </div>
  );
}

function TableInput({
  onCancel,
  onInputChage,
  resetStock,
  stockInsufficient,
  onSave,
  containerStock,
}) {
  const [data, setData] = useState({
    date_time: formatDateForDatetimeLocal(new Date()),
    operation: "in",
    s32: 0,
    s42: 0,
    stock32: 0,
    stock42: 0,
    fuzeren: "谭义勇",
    team: "A",
    stockRes: false,
  });

  const [, , user] = useContext(UserContext);

  useEffect(() => {
    const finalData = {
      ...data,
    };

    console.log("final data", finalData);

    if (isNaN(data.s32)) {
      finalData.s32 = 0;
      resetStock();
    }

    if (isNaN(data.s42)) {
      finalData.s42 = 0;
      resetStock();
    }

    onInputChage(finalData);
  }, [data]);

  return (
    <div>
      <div>
        {!stockInsufficient && (
          <button className="btn btn-primary" onClick={(e) => onSave(data)}>
            Save
          </button>
        )}
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <table class="table-auto">
        <thead className="p1 border border-gray-900 dark:border-white p-1 ">
          <tr>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              DATE TIME
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              OP
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              s32
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              s42
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              stock32
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              stock42
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              fuzeren
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              team
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Stock Reset
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              {/* <input
                type="datetime-local"
                className="w-full"
                value={data.date_time}
                onChange={(e) =>
                  setData((prev) => ({
                    ...data,
                    date_time: e.target.value.replace("T", " "),
                  }))
                }
              /> */}
              {formatCreatedAt(new Date().toISOString())}
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <select
                className="w-full"
                value={data.operation}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, operation: e.target.value }))
                }
              >
                <option value="in">
                  {" "}
                  {GetTransForTokensArray(LANG_TOKENS.IN, user.lang)}
                </option>
                <option value="out">
                  {GetTransForTokensArray(LANG_TOKENS.OUT, user.lang)}
                </option>
              </select>
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <input
                type="number"
                min={0}
                step={1}
                className="w-full"
                placeholder="s32"
                value={data.s32}
                onChange={(e) =>
                  setData((prev) => ({
                    ...data,
                    s32: parseInt(e.target.value),
                  }))
                }
              />
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <input
                type="number"
                min={0}
                step={1}
                className="w-full"
                placeholder="s42"
                value={data.s42}
                onChange={(e) =>
                  setData((prev) => ({
                    ...data,
                    s42: parseInt(e.target.value),
                  }))
                }
              />
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              {containerStock.stock32}
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              {containerStock.stock42}
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <select
                className="w-full"
                value={data.fuzeren}
                onChange={(e) =>
                  setData((prev) => ({ ...data, fuzeren: e.target.value }))
                }
              >
                {DAIZI_FUZEREN.map((fuzeren) => (
                  <option key={fuzeren} value={fuzeren}>
                    {fuzeren}{" "}
                  </option>
                ))}
              </select>
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <select
                className="w-full"
                value={data.team}
                onChange={(e) =>
                  setData((prev) => ({ ...data, team: e.target.value }))
                }
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <input
                type="checkbox"
                value={data.stockRes}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, stockRes: e.target.checked }))
                }
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function DaiziContainer({
  onInputChage,
  resetStock,
  //stockInsufficient,
  stock32Unsufficient,
  stock42Unsufficient,
  onSave,
  containerStock,
}) {
  const [, , user] = useContext(UserContext);

  const [trans, setTrans] = useState([]);
  const [transf, settransf] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(false);
  const [filteredMonth, setFilteredMonth] = useState({
    y: 2025,
    m: new Date().getMonth(),
  });

  useEffect(() => {
    // Load transactions or any other data needed
    loadData();
  }, []);

  useEffect(() => {
    const filtereds = trans.filter(
      (it) => !it.created_at.indexOf(filteredMonth)
    );

    console.log("filtereds: ", filtereds);
    settransf(filtereds);
  }, [filteredMonth]);
  async function loadData() {
    setLoading(true);
    const fetchedTrans = await SB.LoadAllItems(
      TABLES_NAMES.DAIZI_JIZHUANGXIANG,
      "created_at",
      false
    );
    if (fetchedTrans) {
      setTrans(fetchedTrans);
      settransf(fetchedTrans);
      console.log("Transactions loaded:", fetchedTrans);
      setLoading(false);
    } else {
      console.error("Failed to load transactions");
      setLoading(false);
    }
  }

  const stockInsufficient = stock32Unsufficient || stock42Unsufficient;

  function onMonthFiltered(d) {
    setFilteredMonth(d);
    let df = `${d.y}-${parseInt(d.m).toString().padStart(2, "0")}`;
    setFilteredMonth(df);
    console.log("FilteredMonth: ", d);
  }

  return loading ? (
    <Loading isLoading={loading} />
  ) : (
    <div>
      <ContainerStock
        containerStock={containerStock}
        stock32Unsufficient={stock32Unsufficient}
        stock42Unsufficient={stock42Unsufficient}
      />
      <MonthFilter onMonthFiltered={onMonthFiltered} />
      {input ? (
        <TableInput
          onCancel={(e) => {
            setInput(false);
            resetStock();
          }}
          onSave={onSave}
          onInputChage={onInputChage}
          resetStock={resetStock}
          stockInsufficient={stockInsufficient}
          containerStock={containerStock}
        />
      ) : (
        <TableContainer trans={transf} onAdd={(e) => setInput(true)} />
      )}{" "}
    </div>
  );
}
