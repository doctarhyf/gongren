import React, { useContext, useEffect, useRef, useState } from "react";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import useDataLoader from "../hooks/useDataLoader";
import { TABLES_NAMES } from "../helpers/sb.config";
import {
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  CLASS_TD,
  STOCK_RESET_PWD,
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
import SacsProduction from "../comps/sacs/SacsProduction";
import SacsContainer from "../comps/sacs/SacsContainer";

export default function Sacs() {
  const [curtab, setcurtab] = useState(Object.entries(SACS_SECTIONS)[0]);
  const [trans_cont, set_trans_cont] = useState([]);
  const [trans_prod, set_trans_prod] = useState([]);
  const [stock_cont, set_stock_cont] = useState({ s32: 0, s42: 0 });
  const [stock_prod, set_stock_prod] = useState({ s32: 0, s42: 0 });
  const [loading, setloading] = useState(false);

  function onSelectTab(t) {
    //console.log(t);
    setcurtab(t);
  }

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {}

  useEffect(() => {
    const isFirstRec = trans_cont.length === 1;

    if (isFirstRec) {
      set_stock_cont({ s32: trans_cont[0].s32, s42: trans_cont[0].s42 });
    } else {
      const last_rec = { s32: 0, s42: 0 }; //trans_cont[trans_cont.length - 1];
      const { s32, s42 } = stock_cont;
      const news32 = parseInt(s32) + parseInt(last_rec.s32);
      const news42 = parseInt(s42) + parseInt(last_rec.s42);

      set_stock_cont({ s32: news32, s42: news42 });
    }
  }, [trans_cont]);

  function onAddTrans(type, data) {
    console.log(data);

    if (type === TRANSACTION_TYPE.CONTAINER) {
      const { s32, s42 } = stock_cont;

      const news32 =
        data.op === SACS_CONTAINER_OPERATION_TYPE.IN
          ? s32 + data.s32
          : s32 - data.s32;
      const news42 =
        data.op === SACS_CONTAINER_OPERATION_TYPE.IN
          ? s42 + data.s42
          : s42 - data.s42;

      const new_trans_cont = { ...data, stock32: news32, stock42: news42 };
      set_trans_cont((old) => [...old, new_trans_cont]);

      console.log(`trans_cont => `, trans_cont);

      const new_stock_cont = { s32: news32, s42: news42 };
      set_stock_cont(new_stock_cont);

      if (data.op === "out") {
        const { s32, s42 } = stock_prod;
        const ns32 = s32 + data.s32;
        const ns42 = s42 + data.s42;

        const new_stock_prod = { s32: ns32, s42: ns42 };
        set_stock_prod(new_stock_prod);
      }
    } else {
      // production
      set_trans_prod((old) => [...old, data]);
      set_stock_prod({ s32: data.restants32, s42: data.restants42 });

      console.log("data", data);
      console.log("stock_cont", stock_cont);

      const { sortis32, sortis42 } = data;
      const { s32, s42 } = stock_cont;

      const new_stock_container = { s32: s32 - sortis32, s42: s42 - sortis42 };

      console.log("news", new_stock_container);

      set_stock_cont(new_stock_container);
    }
  }

  return (
    <div>
      <Stock
        stock={stock_cont}
        label={"CONTAINER"}
        onResetStock={(e) => set_stock_cont({ s32: 0, s42: 0 })}
      />
      <TabCont tabs={SACS_SECTIONS} onSelectTab={onSelectTab} />
      {curtab && (
        <>
          {SACS_SECTIONS.PRODUCTION.label === curtab[1].label && (
            <SacsProduction
              trans={trans_prod}
              onAddTrans={onAddTrans}
              stock={stock_prod}
              setStock={set_stock_prod}
            />
          )}
          {SACS_SECTIONS.CONTAINER.label === curtab[1].label && (
            <SacsContainer
              trans={trans_cont}
              onAddTrans={onAddTrans}
              stock={stock_cont}
            />
          )}
          {SACS_SECTIONS.CALCULATOR.label === curtab[1].label && <SacsCalc />}
        </>
      )}
    </div>
  );
}
