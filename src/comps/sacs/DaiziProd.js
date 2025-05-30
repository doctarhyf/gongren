import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import * as SB from "../../helpers/sb";
import { TABLES_NAMES } from "../../helpers/sb.config";
import {
  formatCreatedAt,
  formatDateForDatetimeLocal,
  formatFrenchDate,
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

function TableProduction({ trans }) {
  const [, , user] = useContext(UserContext);

  return (
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
        {trans.map((item) => (
          <tr key={item.id}>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              {formatCreatedAt(item.created_at)}
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
            {/* <td className="p1 border border-gray-900 dark:border-white p-1 ">
          {item.date_time}
        </td> */}
          </tr>
        ))}
      </tbody>
    </table>
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

    const prodDataUpdate = { ...data, ...tonnage };

    onDaiziProdChange(prodDataUpdate);
  }, [data]);

  return (
    <div>
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
              {formatCreatedAt(new Date())}
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
              {/*  <input
              type="number" min={0} step={1}
              value={data.t_32}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  t_32: parseInt(e.target.value),
                }))
              }
            /> */}
              {tonnage.t_32}
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              {/* <input
              type="number" min={0} step={1}
              value={data.t_42}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  t_42: parseInt(e.target.value),
                }))
              }
            /> */}
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
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <input
                type="datetime-local"
                value={
                  data.date_time || formatCreatedAt(new Date().toISOString())
                }
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    date_time: e.target.value.replace("T", " "),
                  }))
                }
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function DaiziProd({}) {
  const [trans, setTrans] = useState([]);
  const [stockShengYU, setStockShengYu] = useState({ s32: 0, s42: 0 });
  const [stockShengYUOriginal, setStockShengYuOriginal] = useState({
    s32: 0,
    s42: 0,
  });
  const [showInput, setShowInput] = useState(false);
  const [error, seterror] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    seterror(null);
    const trans = await SB.LoadAllItems(
      TABLES_NAMES.DAIZI_SHENGCHAN,
      "created_at",
      true
    );

    setTrans(trans);
    console.log("prods => ", trans);
    const rest = await SB.LoadLastItem(TABLES_NAMES.DAIZI_SHENGYU);

    console.log("stock shengyu ", rest);
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
      console.log(msg);
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

  function onSave(data) {
    if (data.used_32 === 0 && data.used_42 === 0) {
      alert("All bags cant be zero");
      return;
    }
    console.log("save prod and ssy", data);
  }

  function onCancel() {
    setShowInput(false);
    setStock32Unsufficient(false);
    setStock42Unsufficient(false);

    setStockShengYu(stockShengYUOriginal);
  }
  return (
    <div>
      <div>PRODUCTION</div>

      {loading ? (
        <Loading isLoading={true} />
      ) : (
        <ShengyuStock
          shengYuStock={stockShengYU}
          stock32Unsufficient={stock32Unsufficient}
          stock42Unsufficient={stock42Unsufficient}
        />
      )}

      {!showInput && (
        <button className="btn btn-primary" onClick={(e) => setShowInput(true)}>
          Add
        </button>
      )}
      {error ? (
        <div className=" bg-red-900 text-red-400 p-2 rounded-md text-sm ">
          {error}
        </div>
      ) : showInput ? (
        <TableInput
          stockShengYu={stockShengYU}
          onDaiziProdChange={onDaiziProdChange}
          onCancel={onCancel}
          onSave={onSave}
          stock32Unsufficient={stock32Unsufficient}
          stock42Unsufficient={stock42Unsufficient}
        />
      ) : (
        <TableProduction trans={trans} stockShengYu={stockShengYU} />
      )}
    </div>
  );
}
