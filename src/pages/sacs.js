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
import SacsCalc from "../comps/SacsCalc";
import SacsUsed from "../comps/SacsUsed";
import SacsContainer from "../comps/SacsContainer";

const SECTIONS = {
  CONTAINER: { label: "Sacs Container" },
  SACS_CHARGEMENT: { label: "Sacs Used" },
  CALC: { label: "Calculateur sacs" },
};

export default function Sacs() {
  const [selsec, setselsec] = useState(SECTIONS.CONTAINER);

  return (
    <div>
      <div className="gap-2 my-2">
        {Object.values(SECTIONS).map((s, i) => (
          <span
            onClick={(e) => setselsec(s)}
            className={`  ${
              s.label === selsec.label
                ? "bg-sky-500 text-white    "
                : " hover:text-sky-500 hover:border-b  "
            }  p-1 hover:cursor-pointer `}
          >
            {s.label}
          </span>
        ))}
      </div>

      {selsec === SECTIONS.CONTAINER && <SacsContainer />}
      {selsec === SECTIONS.SACS_CHARGEMENT && <SacsUsed />}
      {selsec === SECTIONS.CALC && <SacsCalc />}
    </div>
  );
}
