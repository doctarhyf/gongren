import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import * as SB from "../../helpers/sb";
import { TABLES_NAMES } from "../../helpers/sb.config";
import {
  formatCreatedAt,
  formatDateForDatetimeLocal,
  formatFrenchDate,
  GetCurrentMonthTrans,
} from "../../helpers/func";
import { DAIZI_FUZEREN, EQUIPES, EQUIPES_CHARGEMENT } from "../../helpers/flow";
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
import { v4 as uuid } from "uuid";
import ShengyuStock from "./ShengyuStock";
import Loading from "../Loading";
import MonthFilter, { FILTER_TEAMS } from "./MonthFilter";

import add from "../../img/add.png";

function TableProduction({ trans, totals }) {
  const [, , user] = useContext(UserContext);

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
      id: 10,
      created_at: "2025-06-10T09:30:00.190243+00:00",
      team: "A",
      used_32: 0,
      used_42: 100,
      t_32: 0,
      t_42: 5,
      dech_32: 0,
      dech_42: 0,
      rest32: 0,
      rest42: 7900,
      date_time: "2025-06-10 08:29:44",
      key: "abe18cf1-2229-442a-98e0-8f98a147ed70",
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
      <table class="table-auto w-full">
        <thead className="p1 border border-gray-900 dark:border-white p-1 ">
          <tr>
            {[
              GetTransForTokensArray(LANG_TOKENS.DATE, user.lang),
              GetTransForTokensArray(LANG_TOKENS.TEAM, user.lang),
              GetTransForTokensArray(LANG_TOKENS.DELIVER_BAGS, user.lang) +
                " 32.5",
              GetTransForTokensArray(LANG_TOKENS.DELIVER_BAGS, user.lang) +
                " 42.5",
              ,
              "T (32)",
              "T (42)",
              GetTransForTokensArray(LANG_TOKENS.TORN_BAGS, user.lang) + "(32)",
              GetTransForTokensArray(LANG_TOKENS.TORN_BAGS, user.lang) + "(42)",
              GetTransForTokensArray(LANG_TOKENS.REMAINING) + " 32.5",
              GetTransForTokensArray(LANG_TOKENS.REMAINING) + " 42.5",
              //"date_time",
              ,
            ].map((it, i) => {
              return (
                <th className="p1 border border-gray-900 dark:border-white p-1 ">
                  {it}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <tr className=" font-bold bg-slate-700  ">
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              {GetTransForTokensArray(LANG_TOKENS.TOTAL, user.lang)}
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 "></td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              {totals.used_32}
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              {totals.used_42}
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 "></td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              {totals.dech_32}
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              {totals.dech_42}
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 "></td>
            <td className="p1 border border-gray-900 dark:border-white p-1 "></td>
            <td className="p1 border border-gray-900 dark:border-white p-1 "></td>
          </tr>
          {trans.map((item) => (
            <tr key={item.id} className=" hover:bg-slate-700 cursor-pointer ">
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {formatCreatedAt(item.date_time)}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.team}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.used_32}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.used_42}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.t_32}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.t_42}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.dech_32}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.dech_42}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.rest32}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.rest42}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ButtonPrint
        title={GetTransForTokensArray(LANG_TOKENS.PRINT, user.lang)}
        onClick={(e) => onPrint(trans)}
      />
    </div>
  );
}

function TableInput({
  stockShengYu,
  onDaiziProdChange,
  stock32Unsufficient,
  stock42Unsufficient,
  onCancel,
  onSave,
}) {
  const [, , user] = useContext(UserContext);
  const [data, setData] = useState({
    date_time: null,
    team: "A",
    used_32: 0,
    used_42: 0,
    //t_32: 0,
    //t_42: 0,
    dech_32: 0,
    dech_42: 0,
    //rest32: 0,
    // rest42: 0,
    date_time: null,
    key: uuid(),
  });

  const [tonnage, setTonnage] = useState({ t_32: 0, t_42: 0 });

  const stockInsufficient = stock32Unsufficient || stock42Unsufficient;

  const { s32: rest32, s42: rest42 } = stockShengYu;

  useEffect(() => {
    if (isNaN(data.used_32)) data.used_32 = 0;
    if (isNaN(data.used_42)) data.used_42 = 0;

    setTonnage({
      t_32: parseFloat((parseFloat(data.used_32) / 20).toFixed(2)),
      t_42: parseFloat((parseFloat(data.used_42) / 20).toFixed(2)),
    });

    const { s32: rest32, s42: rest42 } = stockShengYu;
    const rest = { rest32: rest32, rest42: rest42 };
    const prodDataUpdate = { ...data, ...tonnage };

    //console.log("pd", prodDataUpdate);
    onDaiziProdChange(prodDataUpdate);
  }, [data]);

  return (
    <div>
      <div>
        <div>
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
      <table class="table-auto">
        <thead className="p1 border border-gray-900 dark:border-white p-1 ">
          <tr>
            {[
              GetTransForTokensArray(LANG_TOKENS.DATE, user.lang),
              GetTransForTokensArray(LANG_TOKENS.TEAM, user.lang),
              "used_32",
              "used_42",
              "T (32)",
              "T (42)",
              GetTransForTokensArray(LANG_TOKENS.TORN_BAGS, user.lang) + "(32)",
              GetTransForTokensArray(LANG_TOKENS.TORN_BAGS, user.lang) + "(42)",
              "REST (32)",
              "REST (42)",
              //"date_time",
            ].map((it, i) => {
              return (
                <th className="p1 border border-gray-900 dark:border-white p-1 ">
                  {it}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              {/* {formatCreatedAt(new Date())}  */}
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
                value={data.team}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, team: e.target.value }))
                }
              >
                {EQUIPES_CHARGEMENT.map((t, i) => (
                  <option value={t}>{t}</option>
                ))}
              </select>
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <input
                type="number"
                min={0}
                step={1}
                value={data.used_32}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    used_32: parseInt(e.target.value),
                  }))
                }
              />
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <input
                type="number"
                min={0}
                step={1}
                value={data.used_42}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    used_42: parseInt(e.target.value),
                  }))
                }
              />
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              {tonnage.t_32}
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              {tonnage.t_42}
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <input
                type="number"
                min={0}
                step={1}
                value={data.dech_32}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    dech_32: parseInt(e.target.value),
                  }))
                }
              />
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <input
                type="number"
                min={0}
                step={1}
                value={data.dech_42}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    dech_42: parseInt(e.target.value),
                  }))
                }
              />
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              {rest32}
              {stock32Unsufficient && (
                <div className=" bg-red-900 text-red-300 p-1 rounded-sm text-sm ">
                  {GetTransForTokensArray(
                    LANG_TOKENS.STOCK_UNSUFFICIENT,
                    user.lang
                  )}
                </div>
              )}
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              {rest42}
              {stock42Unsufficient && (
                <div className=" bg-red-900 text-red-300 p-1 rounded-sm text-sm ">
                  {GetTransForTokensArray(
                    LANG_TOKENS.STOCK_UNSUFFICIENT,
                    user.lang
                  )}
                </div>
              )}
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 "></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function DaiziProd({}) {
  const [trans, setTrans] = useState([]);
  const [transf, settransf] = useState([]);
  const [stockShengYU, setStockShengYu] = useState({ s32: 0, s42: 0 });
  const [stockShengYUOriginal, setStockShengYuOriginal] = useState({
    s32: 0,
    s42: 0,
  });
  const [showInput, setShowInput] = useState(false);
  const [error, seterror] = useState(null);
  const [loading, setLoading] = useState(false);
  const [, , user] = useContext(UserContext);
  const [rdk, setrdk] = useState(Math.random());
  const [totals, settoals] = useState({
    used_32: 0,
    used_42: 0,
    dech32: 0,
    dech42: 0,
  });
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setrdk(Math.random());
    seterror(null);
    const trans = await SB.LoadAllItems(
      TABLES_NAMES.DAIZI_SHENGCHAN,
      "created_at",
      true
    );

    // //console.log(trans);

    setTrans(trans);
    settransf(GetCurrentMonthTrans(trans));
    setFilteredTeam(FILTER_TEAMS.ALL_TEAMS);

    //console.log("prods => ", trans);
    const rest = await SB.LoadLastItem(TABLES_NAMES.DAIZI_SHENGYU);

    //console.log("stock shengyu ", rest);
    if (rest) {
      const { s32, s42 } = rest;
      const ssy = { s32: s32, s42: s42 };
      setStockShengYu(ssy);
      setStockShengYuOriginal(ssy);
      setLoading(false);
    } else {
      const msg =
        "No bags for production, please remove bags from container first";
      seterror(msg);
      //console.log(msg);
      setLoading(false);
    }
  }

  const [stock32Unsufficient, setStock32Unsufficient] = useState(false);
  const [stock42Unsufficient, setStock42Unsufficient] = useState(false);

  function onDaiziProdChange(data) {
    setStock32Unsufficient(false);
    setStock42Unsufficient(false);
    const ns32 = stockShengYUOriginal.s32 - data.used_32;
    const ns42 = stockShengYUOriginal.s42 - data.used_42;

    if (ns32 < 0) setStock32Unsufficient(true);
    if (ns42 < 0) setStock42Unsufficient(true);

    if (stock32Unsufficient || stock42Unsufficient) {
      setStockShengYu(stockShengYUOriginal);
    } else {
      const newSSY = { s32: ns32, s42: ns42 };

      setStockShengYu(newSSY);
    }
  }

  function calculateTonnage(data) {
    const { used_32, used_42 } = data;
    const t_32 = parseFloat(used_32) / 20;
    const t_42 = parseFloat(used_42) / 20;

    return { t_32: t_32, t_42: t_42 };
  }

  async function onSave(data) {
    setLoading(true);
    if (data.used_32 === 0 && data.used_42 === 0) {
      alert("All bags cant be zero");
      return;
    }

    let { key: key_dzsc, date_time } = data;
    if (date_time === null)
      date_time = new Date().toISOString().replace("T", " ").split(".")[0];

    const { s32: rest32, s42: rest42 } = stockShengYU;
    const rest = { rest32: rest32, rest42: rest42 };
    const tonnage = calculateTonnage(data);
    const finalDataDzsc = { ...data, ...rest, ...tonnage, date_time };

    const finalDataDzsy = {
      s32: rest32,
      s42: rest42,
      operation: "out",
      key_dzsc: key_dzsc,
    };

    //console.log("finalDataDzsy", finalDataDzsy);
    //console.log("finalDataDzsc", finalDataDzsc);

    const res_sc = SB.InsertItem(TABLES_NAMES.DAIZI_SHENGCHAN, finalDataDzsc);
    const res_sy = SB.InsertItem(TABLES_NAMES.DAIZI_SHENGYU, finalDataDzsy);

    const res = await Promise.all([res_sc, res_sy]); //nnn

    //console.log("res all => ", res);

    setLoading(false);
  }

  function onCancel() {
    setShowInput(false);
    setStock32Unsufficient(false);
    setStock42Unsufficient(false);

    setStockShengYu(stockShengYUOriginal);
  }

  const [filteredMonth, setFilteredMonth] = useState({
    y: 2025,
    m: new Date().getMonth(),
  });
  const [filteredTeam, setFilteredTeam] = useState(FILTER_TEAMS.ALL_TEAMS);

  useEffect(() => {
    //console.log("filteredMonth", filteredMonth);
    let filtereds = trans.filter((it) =>
      it.date_time.startsWith(filteredMonth)
    );

    if (filteredTeam !== FILTER_TEAMS.ALL_TEAMS) {
      filtereds = filtereds.filter((t) => t.team === filteredTeam);
    }

    const tused_32 = filtereds.reduce(
      (sum, it) => sum + parseInt(it.used_32),
      0
    );
    const tused_42 = filtereds.reduce(
      (sum, it) => sum + parseInt(it.used_42),
      0
    );
    const tdech_32 = filtereds.reduce(
      (sum, it) => sum + parseInt(it.dech_32),
      0
    );
    const tdech_42 = filtereds.reduce(
      (sum, it) => sum + parseInt(it.dech_42),
      0
    );

    settoals({
      used_32: tused_32,
      used_42: tused_42,
      dech_32: tdech_32,
      dech_42: tdech_42,
    });

    settransf(filtereds);
  }, [filteredMonth, filteredTeam]);

  function onMonthFiltered(d) {
    let df = `${d.y}-${parseInt(d.m).toString().padStart(2, "0")}`;
    setFilteredMonth(df);
    setFilteredTeam(d.team);
    //console.log(d, df);
  }

  return (
    <div>
      {loading ? (
        <Loading isLoading={true} />
      ) : (
        <div className="   ">
          <div className=" text-xl mb-2 border-b   ">
            {GetTransForTokensArray(
              LANG_TOKENS.PRODUCTION_BAGS_MANAGEMENT,
              user.lang
            )}
          </div>
          <div className=" flex justify-center flex-col items-center ">
            <ShengyuStock
              shengYuStock={stockShengYU}
              stock32Unsufficient={stock32Unsufficient}
              stock42Unsufficient={stock42Unsufficient}
            />
            <MonthFilter
              onMonthFiltered={onMonthFiltered}
              isProduction={true}
            />
          </div>
        </div>
      )}

      {error ? (
        <>
          <div className=" bg-red-900 text-red-400 p-2 rounded-md text-sm ">
            {GetTransForTokensArray(LANG_TOKENS.NO_BAGS_AVAILABLE, user.lang)}
          </div>
        </>
      ) : showInput ? (
        <>
          <TableInput
            key={rdk} //clcllc
            stockShengYu={stockShengYU}
            onDaiziProdChange={onDaiziProdChange}
            onCancel={onCancel}
            onSave={onSave}
            stock32Unsufficient={stock32Unsufficient}
            stock42Unsufficient={stock42Unsufficient}
          />
        </>
      ) : (
        <div>
          <div className=" text-3xl text-center  ">
            {GetTransForTokensArray(LANG_TOKENS.RECORDS_TITLE_PROD, user.lang)}
          </div>

          <TableProduction
            trans={transf}
            stockShengYu={stockShengYU}
            totals={totals}
          />
        </div>
      )}

      {!showInput && (
        <>
          <ButtonPrint
            title={GetTransForTokensArray(LANG_TOKENS.SEND_REPPORT, user.lang)}
            icon={add}
            onClick={(e) => setShowInput(true)}
          />
        </>
      )}
    </div>
  );
}
