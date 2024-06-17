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

const SECTIONS = {
  CONTAINER: { label: "Sacs Container" },
  PRODUCTION: { label: "Sacs Production" },
  CALCULATOR: { label: "Sacs Calculator" },
};

function SacsCont({ trans, onAddTrans }) {
  const [showInput, setShowInput] = useState(false);

  function onSaveTrans() {
    setShowInput(false);
    onAddTrans("cont", { team: "A", s32: Math.random(), s42: Math.random() });
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
                  <select className=" border p-1 ">
                    {["A", "B", "C", "D"].map((eq) => (
                      <option value={eq}>{eq}</option>
                    ))}
                  </select>
                </td>
                <td className="p1 border border-gray-900">
                  <input className=" w-16 " type="number" value={0} />
                </td>
                <td className="p1 border border-gray-900">
                  <input className=" w-16" type="number" value={0} />
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

  function onSelectTab(t) {
    console.log(t);
    setcurtab(t);
  }

  function onAddTrans(type, data) {
    set_trans_cont((old) => [...old, data]);

    console.log(type, data);
    console.log(trans_cont);
  }

  return (
    <div>
      <TabCont tabs={SECTIONS} onSelectTab={onSelectTab} />
      {curtab && (
        <>
          {SECTIONS.PRODUCTION.label === curtab[1].label && (
            <div>Production</div>
          )}
          {SECTIONS.CONTAINER.label === curtab[1].label && (
            <SacsCont trans={trans_cont} onAddTrans={onAddTrans} />
          )}
          {SECTIONS.CALCULATOR.label === curtab[1].label && (
            <div>Calculator</div>
          )}{" "}
        </>
      )}
    </div>
  );
}
