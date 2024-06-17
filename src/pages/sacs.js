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

const SECTIONS = {
  CONTAINER: { label: "Sacs Container" },
  PRODUCTION: { label: "Sacs Production" },
  CALCULATOR: { label: "Sacs Calculator" },
};

function TabCont({ tabs, onSelectTab }) {
  const [selected_tab, set_selected_tab] = useState(Object.entries(tabs)[0]);

  return (
    <div className=" gap-4 flex py-4 sm:flex-row flex-col ">
      {Object.entries(tabs).map((t, i) => (
        <button
          onClick={(e) => {
            set_selected_tab(t);
            onSelectTab(t);
          }}
          className={`  hover:text-white hover:bg-sky-500 ${
            selected_tab[0] === t[0]
              ? " text-white bg-sky-500  "
              : "  text-sky-500 "
          } p-1 border border-sky-500 rounded-md `}
        >
          {t[1].label}
        </button>
      ))}
    </div>
  );
}

export default function Sacs() {
  const [curtab, setcurtab] = useState();

  function onSelectTab(t) {
    console.log(t);
    setcurtab(t);
  }

  return (
    <div>
      <TabCont tabs={SECTIONS} onSelectTab={onSelectTab} />
      {curtab && (
        <>
          {SECTIONS.PRODUCTION.label === curtab[1].label && (
            <div>Production</div>
          )}
          {SECTIONS.CONTAINER.label === curtab[1].label && <div>Container</div>}
          {SECTIONS.CALCULATOR.label === curtab[1].label && (
            <div>Calculator</div>
          )}{" "}
        </>
      )}
    </div>
  );
}
