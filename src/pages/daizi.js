import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import useDataLoader from "../hooks/useDataLoader";
import { TABLES_NAMES } from "../helpers/sb.config";
import {
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  CLASS_TD,
  STOCK_RESET_PWD,
  STOCK_TYPE,
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

import {
  SACS_SECTIONS,
  TRANSACTION_TYPE,
  SACS_CONTAINER_OPERATION_TYPE,
} from "../helpers/flow";
import Stock from "../comps/sacs/Stock";
import DaiziContainer from "../comps/sacs/DaiziContainer";
import DaiziProd from "../comps/sacs/DaiziProd";

export default function Daizi() {
  const [curtab, setcurtab] = useState(Object.entries(SACS_SECTIONS)[0]);
  const [loading, setloading] = useState(false);
  const [trans_cont, set_trans_cont] = useState([]);
  const [trans_prod, set_trans_prod] = useState([]);
  const [stock_cont, set_stock_cont] = useState({ s32: 0, s42: 0 });
  const [stock_prod, set_stock_prod] = useState({ s32: 0, s42: 0 });
  const user = useContext(UserContext);

  function onSelectTab(t) {
    //console.log(t);
    setcurtab(t);
  }

  useEffect(() => {
    loadData();
  }, []);
  function getLastRecord(records) {
    if (records && records.length > 0) {
      return records[records.length - 1];
    }
    return null;
  }

  async function loadData() {
    setloading(true);
    const sacs_cont = await SB.LoadAllItems(TABLES_NAMES.DAIZI_JIZHUANGXIANG);
    set_trans_cont(sacs_cont);
    console.log("sacs cont", sacs_cont);

    let last_rec = getLastRecord(sacs_cont);

    if (last_rec) {
      set_stock_cont({ s32: last_rec.stock32, s42: last_rec.stock42 });
    }

    const sacs_prod = await SB.LoadAllItems(TABLES_NAMES.DAIZI_SHENGCHAN);
    set_trans_prod(sacs_prod);
    console.log("sacs prod", sacs_prod);

    last_rec = getLastRecord(sacs_prod);

    if (last_rec) {
      set_stock_prod({ s32: last_rec.rest32, s42: last_rec.rest42 });
    }

    setloading(false);
  }

  return (
    <div>
      <Loading isLoading={loading} />

      <div className={`  ${loading ? "hidden" : "block"} `}>
        <TabCont tabs={SACS_SECTIONS} onSelectTab={onSelectTab} />
      </div>

      {curtab && (
        <>
          {SACS_SECTIONS.PRODUCTION.label === curtab[1].label && (
            <DaiziProd stock={stock_prod} />
          )}

          {SACS_SECTIONS.CONTAINER.label === curtab[1].label && (
            <DaiziContainer stock={stock_cont} trans={trans_cont} />
          )}
        </>
      )}
    </div>
  );
}
