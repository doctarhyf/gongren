import React, { useContext, useEffect, useRef, useState } from "react";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import useDataLoader from "../hooks/useDataLoader";
import { TABLES_NAMES } from "../helpers/sb.config";
import {
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  CLASS_TD,
  USER_LEVEL,
  dateFormatter,
} from "../helpers/flow";
import { UserContext } from "../App";
import ButtonPrint from "../comps/ButtonPrint";
import { _, createHeaders, formatFrenchDate } from "../helpers/func";
import * as SB from "../helpers/sb";
import Loading from "../comps/Loading";
import { doc } from "../helpers/funcs_print";
import TabCont from "../comps/TabCont";
import SacsCalc from "../comps/SacsCalc";

const SECTIONS = {
  CONTAINER: { label: "Sacs Container" },
  PRODUCTION: { label: "Sacs Production" },
  CALCULATOR: { label: "Sacs Calculator" },
};

function Stock({ stock }) {
  return (
    <div className=" py-4 border rounded-md p-1 bg-slate-300/50 ">
      <div className=" font-bold  ">STOCK CONTAINER</div>

      <div className=" flex flex-col ">
        <div>
          {" "}
          Type 32.5 :<span className=" font-bold "> {stock.s32}</span>{" "}
        </div>
        <div>
          {" "}
          Type 42.5 : <span className=" font-bold ">{stock.s42}</span>{" "}
        </div>
      </div>
    </div>
  );
}

function SacsCont({ trans, onAddTrans }) {
  const [showInput, setShowInput] = useState(false);
  const [data, setdata] = useState({
    id: trans.length,
  });

  function onSaveTrans() {
    if (data.s32 === undefined || data.s42 === undefined) {
      alert("Please input sacs amount!");
      return;
    }

    setShowInput(false);
    onAddTrans("cont", data);
    setdata({});
  }

  return (
    <div>
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
          <button
            onClick={onSaveTrans}
            className=" p-1 text-sky-500 border rounded-md border-sky-500 hover:text-white hover:bg-sky-500 "
          >
            SAVE
          </button>
        )}

        <button
          onClick={(e) => setShowInput(false)}
          className=" p-1 text-red-500 border rounded-md border-red-500 hover:text-white hover:bg-red-500 "
        >
          CANCEL
        </button>
      </div>
      <div className=" container  ">
        <table>
          <thead>
            <th className="p1 border border-gray-900">id</th>
            <th className="p1 border border-gray-900">Equipe</th>
            <th className="p1 border border-gray-900">32.5</th>
            <th className="p1 border border-gray-900">42.5</th>
            <th className="p1 border border-gray-900">Date</th>
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
                  <input
                    className=" w-16 "
                    value={data.s32}
                    onChange={(e) =>
                      setdata((old) => ({
                        ...old,
                        s32: parseInt(e.target.value),
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
                        s42: parseInt(e.target.value),
                      }))
                    }
                  />
                </td>
                <td className="p1 border border-gray-900">
                  {new Date().toDateString()}
                </td>
              </tr>
            )}
            {trans.map((t, i) => (
              <tr className={`  ${showInput ? "opacity-20" : ""}  `}>
                <td className="p1 border border-gray-900">{i}</td>
                <td className="p1 border border-gray-900">{t.team}</td>
                <td className="p1 border border-gray-900">{t.s32}</td>
                <td className="p1 border border-gray-900">{t.s42}</td>
                <td className="p1 border border-gray-900">
                  {new Date().toDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Sacs() {
  const [curtab, setcurtab] = useState();
  const [trans_cont, set_trans_cont] = useState([]);
  const [trans_prod, set_trans_prod] = useState([]);
  const [stock_cont, set_stock_cont] = useState({ s32: 0, s42: 0 });

  function onSelectTab(t) {
    //console.log(t);
    setcurtab(t);
  }

  useEffect(() => {
    const isFirstRec = trans_cont.length === 1;

    if (isFirstRec) {
      set_stock_cont({ s32: trans_cont[0].s32, s42: trans_cont[0].s42 });
      //console.log("first rec", trans_cont);
    } else {
      const last_rec = trans_cont[trans_cont.length - 1];
      const { s32, s42 } = stock_cont;
      const news32 = parseInt(s32) + parseInt(last_rec.s32);
      const news42 = parseInt(s42) + parseInt(last_rec.s42);

      set_stock_cont({ s32: news32, s42: news42 });
    }
  }, [trans_cont]);

  function onAddTrans(type, data) {
    set_trans_cont((old) => [...old, data]);
  }

  return (
    <div>
      <Stock stock={stock_cont} />

      <TabCont tabs={SECTIONS} onSelectTab={onSelectTab} />
      {curtab && (
        <>
          {SECTIONS.PRODUCTION.label === curtab[1].label && (
            <div>Production</div>
          )}
          {SECTIONS.CONTAINER.label === curtab[1].label && (
            <SacsCont trans={trans_cont} onAddTrans={onAddTrans} />
          )}
          {SECTIONS.CALCULATOR.label === curtab[1].label && <SacsCalc />}
        </>
      )}
    </div>
  );
}
