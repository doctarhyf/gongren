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
import ButtonPrint from "./ButtonPrint";
import { _, createHeaders, formatFrenchDate } from "../helpers/func";
import * as SB from "../helpers/sb";
import Loading from "./Loading";
import { doc } from "../helpers/funcs_print";
import container from "../img/container.jpg";

export default function SacsUsed() {
  return <div>SacsUsed</div>;
}
