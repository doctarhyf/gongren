import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import * as SB from "../../helpers/sb";
import { TABLES_NAMES } from "../../helpers/sb.config";
import {
  formatCreatedAt,
  formatDateForDatetimeLocal,
  formatFrenchDate,
  GenerateExcelData,
  objectsToArrays,
  objectsToArraysWithHeaders,
  UserHasAccessCode,
} from "../../helpers/func";
import {
  ACCESS_CODES,
  CLASS_SELECT,
  DAIZI_FUZEREN,
  MONTHS,
} from "../../helpers/flow";
import ButtonPrint from "../ButtonPrint";
import {
  GetTransForTokenName,
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
import MonthFilter, {
  FILTER_CONTAINER_IN_OUT,
  FILTER_TEAMS,
} from "./MonthFilter";

import add from "../../img/add.png";
import Excelexport from "../Excelexport";

function TableContainer({ trans, onAdd, title, pandian }) {
  const [, , user] = useContext(UserContext);

  const totals = { s32: 0, s42: 0 };

  if (trans && trans.length > 0) {
    totals.s32 = trans.reduce((sum, it) => sum + it.s32, 0);
    totals.s42 = trans.reduce((sum, it) => sum + it.s42, 0);
  }

  function onPrint(loads) {
    ////console.log(loads);
    //return;
    //console.log("loads => ", loads);
    loads = transformDataForPrint(loads);
    //console.log("loads => ", loads);
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

  function PreCleanExcelData(data) {
    /*
{
    "id": 26,
    "created_at": "2025-05-30T13:36:25.164133+00:00",
    "date_time": "2025-05-30 15:36",
    "operation": "out",
    "s32": 0,
    "s42": 90000,
    "stock32": 0,
    "stock42": 120000,
    "fuzeren": "谭义勇",
    "team": "A",
    "stockRes": false,
    "key": "622f4728-1a59-4d8a-af6a-ce47917a2e8f"
} 
    */
    ///  console.log(data[0]);

    const date_time = GetTransForTokensArray(LANG_TOKENS.DATE_TIME, user.lang);
    const operation = GetTransForTokensArray(LANG_TOKENS["IN/OUT"], user.lang);
    const s32 = GetTransForTokensArray(LANG_TOKENS.s32, user.lang);
    const s42 = GetTransForTokensArray(LANG_TOKENS.s42, user.lang);
    const stock32 = `${GetTransForTokensArray(
      LANG_TOKENS.STOCK,
      user.lang
    )}32.5N`;
    const stock42 = `${GetTransForTokensArray(
      LANG_TOKENS.STOCK,
      user.lang
    )}42.5N`;
    const team = GetTransForTokensArray(LANG_TOKENS.TEAM, user.lang);
    const fuzeren = GetTransForTokensArray(LANG_TOKENS.FUZEREN, user.lang);

    return data.map((it) => ({
      ID: it.id,
      [date_time]: it.date_time,
      [operation]: GetTransForTokenName(it.operation.toUpperCase(), user.lang),
      [s32]: it.s32,
      [s42]: it.s42,
      [stock32]: it.stock32,
      [stock42]: it.stock32,
      [team]: it.team,
      [fuzeren]: it.fuzeren,
    }));
  }

  const containerIsEmpty = trans.length === 0;

  return (
    <div>
      {!containerIsEmpty > 0 ? (
        <table class="table-auto w-full">
          <thead className="p1 border border-gray-900 dark:border-white p-1 ">
            <tr>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                ID
              </th>
              {/*  <th className="p1 border border-gray-900 dark:border-white p-1 ">
        created
      </th> */}
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                {GetTransForTokensArray(LANG_TOKENS.DATE_TIME, user.lang)}
              </th>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                {GetTransForTokensArray(LANG_TOKENS["IN/OUT"], user.lang)}
              </th>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                {GetTransForTokensArray(LANG_TOKENS.DELIVERED_BAGS, user.lang)}
                32.5
              </th>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                {GetTransForTokensArray(LANG_TOKENS.DELIVERED_BAGS, user.lang)}
                42.5
              </th>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                {GetTransForTokensArray(LANG_TOKENS.STOCK, user.lang)} 32.5
              </th>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                {GetTransForTokensArray(LANG_TOKENS.STOCK, user.lang)} 42.5
              </th>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                {GetTransForTokensArray(LANG_TOKENS.FUZEREN, user.lang)}
              </th>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                {GetTransForTokensArray(LANG_TOKENS.TEAM, user.lang)}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className=" font-bold bg-slate-700  ">
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                PANDIAN
              </td>

              <td className="p1 border border-gray-900 dark:border-white p-1 "></td>
              <td className="p1 border border-gray-900 dark:border-white p-1 "></td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {pandian.s32}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {pandian.s42}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 "></td>
              <td className="p1 border border-gray-900 dark:border-white p-1 "></td>
              <td className="p1 border border-gray-900 dark:border-white p-1 "></td>
              <td className="p1 border border-gray-900 dark:border-white p-1 "></td>
            </tr>

            {trans.map((item) => (
              <tr key={item.id} className="hover:bg-slate-700 cursor-pointer">
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
                  {GetTransForTokenName(
                    item.operation.toUpperCase(),
                    user.lang
                  )}
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

      <div className=" flex gap-2 justify-between ">
        {UserHasAccessCode(user, ACCESS_CODES.CAN_UPDATE_CONTAINER_BAGS) && (
          <ButtonPrint
            title={GetTransForTokensArray(LANG_TOKENS.DELIVER_BAGS, user.lang)}
            icon={add}
            onClick={onAdd}
          />
        )}

        {!containerIsEmpty && (
          <Excelexport
            excelData={GenerateExcelData(PreCleanExcelData(trans), [
              "key",
              "created_at",
              "stockRes",
            ])}
            fileName={title}
          />
        )}
      </div>
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

    //console.log("final data", finalData);

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
      <table class="table-auto w-full">
        <thead className="p1 border border-gray-900 dark:border-white p-1 ">
          <tr>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.DATE_TIME, user.lang)}
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS["IN/OUT"], user.lang) +
                " 32.5"}
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              32.5
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              42.5
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.STOCK, user.lang) + " 32.5"}
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.STOCK, user.lang) + " 32.5"}
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.FUZEREN, user.lang)}
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.TEAM, user.lang)}
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              Stock Reset
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              {/*  {formatCreatedAt(new Date().toISOString())} */}
              <input
                type="datetime-local"
                value={
                  data.date_time ||
                  formatCreatedAt(
                    new Date().toISOString().replace("T", " ").split(".")[0]
                  )
                }
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    date_time: e.target.value.replace("T", " "),
                  }))
                }
              />
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

      <div className=" flex justify-between my-4  ">
        {!stockInsufficient && (
          <button className="btn btn-primary" onClick={(e) => onSave(data)}>
            {GetTransForTokensArray(LANG_TOKENS.SAVE, user.lang)}
          </button>
        )}
        <button className="btn btn-secondary" onClick={onCancel}>
          {GetTransForTokensArray(LANG_TOKENS.CANCEL, user.lang)}
        </button>
      </div>
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
  transPandian,
}) {
  const [, , user] = useContext(UserContext);
  const [filteredTeam, setFilteredTeam] = useState(FILTER_TEAMS.ALL_TEAMS);
  const [filterInOut, setFilterInOut] = useState(
    FILTER_CONTAINER_IN_OUT.IN_OUT
  );
  const [trans, setTrans] = useState([]);
  const [transf, settransf] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(false);
  const [filteredMonth, setFilteredMonth] = useState({
    y: 2025,
    m: new Date().getMonth() + 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const defFData = {
    ...filteredMonth,
    team: FILTER_TEAMS.ALL_TEAMS,
    inOut: FILTER_CONTAINER_IN_OUT.IN_OUT,
  };

  function filterData(fdata) {
    if (!fdata) {
      fdata = { ...defFData };
    }

    const { y, m, team, inOut } = fdata;

    const filteredMonth = `${y}-${parseInt(m).toString().padStart(2, "0")}`;
    console.log("fmm => ", filteredMonth);

    const filteredTeam = team;
    const filterInOut = inOut;

    let filtereds = trans.filter((it) =>
      it.date_time.startsWith(filteredMonth)
    );

    if (filteredTeam !== FILTER_TEAMS.ALL_TEAMS) {
      filtereds = filtereds.filter((t) => t.team === filteredTeam);
    }

    if (FILTER_CONTAINER_IN_OUT.IN_OUT !== filterInOut) {
      filtereds = filtereds.filter((it) => it.operation === filterInOut);
    }

    filtereds.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));

    const fd = CalculateTransactions(filtereds, transPandian);

    settransf(fd);
  }

  function CalculateTransactions(data, pd) {
    const curMonthPandian = { s32: 60000, s42: 120000 };
    /*  if (pd.length === 0) {
    } */

    const finalArray = [];

    data.forEach((curit, i) => {
      const item = { ...curit };
      const { operation, s32: currentS32, s42: currentS42 } = curit;

      const isFirst = i === 0;
      const isLast = i === data.length - 1;
      const isIn = operation === "in" ? true : false;

      if (isFirst) {
        curit.stock32 = isIn
          ? curMonthPandian.s32 + currentS32
          : curMonthPandian.s32 - currentS32;
        curit.stock42 = isIn
          ? curMonthPandian.s42 + currentS42
          : curMonthPandian.s42 - currentS42;
        finalArray.push(item);
      } else {
        const previtem = finalArray[i - 1];

        const { stock32: previousStock32, stock42: previousStock42 } = previtem;
        const newStock32 = isIn
          ? parseInt(previousStock32) + currentS32
          : parseInt(previousStock32) - currentS32;

        const newStock42 = isIn
          ? parseInt(previousStock42) + currentS42
          : parseInt(previousStock42) - currentS42;

        item.stock32 = newStock32;
        item.stock42 = newStock42;

        finalArray.push(item);
      }
    });

    return finalArray;
  }

  async function loadData() {
    setLoading(true);
    const fetchedTrans = await SB.LoadAllItems(
      TABLES_NAMES.DAIZI_JIZHUANGXIANG,
      "created_at",
      true
    );
    if (fetchedTrans) {
      setTrans(fetchedTrans);
      //filterData();
      setLoading(false);
    } else {
      //console.error("Failed to load transactions");

      ///hhjhjh
      setLoading(false);
    }
  }

  const stockInsufficient = stock32Unsufficient || stock42Unsufficient;
  const [d, setd] = useState({ y: "-", m: "-" });
  const [title, setTitle] = useState();

  function onMonthFiltered(d) {
    setd({ y: d.y, m: d.m });
    let df = `${d.y}-${parseInt(d.m).toString().padStart(2, "0")}`;

    setFilteredMonth(df);
    setFilterInOut(d.inOut);
    setFilteredTeam(d.team);

    filterData(d);

    setTitle(
      GetTransForTokensArray(LANG_TOKENS.RECORDS_TITLE_CONT, user.lang, {
        y: d.y,
        m: d.m,
      })
    );
  }

  return loading ? (
    <Loading isLoading={loading} />
  ) : (
    <div>
      <div className=" text-xl mb-2 border-b   ">
        {GetTransForTokensArray(
          LANG_TOKENS.CONTAINER_BAGS_MANAGEMENT,
          user.lang
        )}
      </div>
      <div className=" flex flex-col justify-center  items-center  ">
        <ContainerStock
          containerStock={containerStock}
          stock32Unsufficient={stock32Unsufficient}
          stock42Unsufficient={stock42Unsufficient}
        />
        <MonthFilter onMonthFiltered={onMonthFiltered} isContainer={true} />
      </div>
      {input ? (
        <div className=" overflow-auto  ">
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
        </div>
      ) : (
        <div>
          <div className=" text-3xl text-center my-4  ">
            {title ||
              GetTransForTokensArray(
                LANG_TOKENS.RECORDS_TITLE_CONT,
                user.lang,
                {
                  y: d.y,
                  m: d.m,
                }
              )}
          </div>
          <div className=" overflow-x-auto p-4   ">
            <TableContainer
              trans={transf}
              onAdd={(e) => setInput(true)}
              title={title}
              pandian={{ s32: 60000, s42: 120000 }}
            />
          </div>
        </div>
      )}{" "}
    </div>
  );
}
