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

function SacsCont({ trans }) {
  return <div></div>;
}

export default function Sacs() {
  const [curtab, setcurtab] = useState();
  const [trans_cont, set_trans_cont] = useState([]);
  const [trans_prod, set_trans_prod] = useState([]);

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
          {SECTIONS.CONTAINER.label === curtab[1].label && (
            <SacsCont trans={trans_cont} />
          )}
          {SECTIONS.CALCULATOR.label === curtab[1].label && (
            <div>Calculator</div>
          )}{" "}
        </>
      )}
    </div>
  );
}
