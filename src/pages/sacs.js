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
import SacsProduction from "../comps/sacs/SacsProduction";
import SacsContainer from "../comps/sacs/SacsContainer";

const SAVING_TO_SB = true;

export default function Sacs() {
  const [curtab, setcurtab] = useState(Object.entries(SACS_SECTIONS)[2]);
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

  async function loadData() {
    setloading(true);
    const sacs_cont = await SB.LoadAllItems(TABLES_NAMES.SACS_CONTAINER);
    set_trans_cont(sacs_cont);
    console.log("sacs cont", sacs_cont);

    let last_rec = sacs_cont[sacs_cont.length - 1];

    if (last_rec) {
      set_stock_cont({ s32: last_rec.stock32, s42: last_rec.stock42 });
    }

    const sacs_prod = await SB.LoadAllItems(TABLES_NAMES.SACS_PRODUCTION);
    set_trans_prod(sacs_prod);
    console.log("sacs prod", sacs_prod);

    last_rec = sacs_prod[sacs_prod.length - 1];

    if (last_rec) {
      set_stock_prod({ s32: last_rec.restants32, s42: last_rec.restants42 });
    }

    setloading(false);
  }

  async function onAddTrans(type, data) {
    console.log(data);

    if (type === TRANSACTION_TYPE.CONTAINER) {
      const { s32, s42 } = stock_cont;

      const news32 =
        data.op === SACS_CONTAINER_OPERATION_TYPE.IN
          ? data.stockres
            ? data.s32
            : s32 + data.s32
          : s32 - data.s32;
      const news42 =
        data.op === SACS_CONTAINER_OPERATION_TYPE.IN
          ? data.stockres
            ? data.s42
            : s42 + data.s42
          : s42 - data.s42;

      const new_trans_cont = { ...data, stock32: news32, stock42: news42 };
      set_trans_cont((old) => [...old, new_trans_cont]);
      const pr_trans_cont = SB.InsertItem(
        TABLES_NAMES.SACS_CONTAINER,
        new_trans_cont
      );

      const new_stock_cont = { s32: news32, s42: news42 };
      set_stock_cont(new_stock_cont);
      const pr_stock_cont = SB.InsertItem(
        TABLES_NAMES.SACS_STOCK_CONTAINER,
        new_stock_cont
      );

      let pr_stock_prod;
      if (data.op === "out") {
        const { s32, s42 } = stock_prod;
        const ns32 = s32 + data.s32;
        const ns42 = s42 + data.s42;

        const new_stock_prod = { s32: ns32, s42: ns42 };
        set_stock_prod(new_stock_prod);
        pr_stock_prod = SB.InsertItem(
          TABLES_NAMES.SACS_STOCK_PRODUCTION,
          new_stock_prod
        );
      }

      setloading(true);
      const res = await Promise.all([
        pr_trans_cont,
        pr_stock_cont,
        pr_stock_prod,
      ]);
      setloading(false);

      const success = res.every((el) => el === null);

      if (success) {
        alert("Data saved!");
        console.log(res);
      } else {
        alert(`Error saving data! \n ${JSON.stringify(res)}`);
      }
    }

    if (type === TRANSACTION_TYPE.PRODUCTION) {
      // production
      set_trans_prod((old) => [...old, data]);
      const pr_trans_prod = SB.InsertItem(TABLES_NAMES.SACS_PRODUCTION, data);

      const new_stock_prod = { s32: data.restants32, s42: data.restants42 };
      set_stock_prod(new_stock_prod);
      const pr_stock_prod = SB.InsertItem(
        TABLES_NAMES.SACS_STOCK_PRODUCTION,
        new_stock_prod
      );

      console.log("data", data);
      console.log("stock_cont", stock_cont);

      const { sortis32, sortis42 } = data;
      const { s32, s42 } = stock_cont;

      const new_stock_container = { s32: s32 - sortis32, s42: s42 - sortis42 };

      console.log("news", new_stock_container);

      set_stock_cont(new_stock_container);

      const pr_stock_cont = SB.InsertItem(
        TABLES_NAMES.SACS_STOCK_CONTAINER,
        new_stock_container
      );

      setloading(true);
      const res = await Promise.all([
        pr_trans_prod,
        pr_stock_prod,
        pr_stock_cont,
      ]);
      const success = res.every((el) => el === null);

      console.log("res prod insert", res);

      setloading(false);

      if (success) {
        alert("Data saved!");
        console.log(res);
      } else {
        //console.log(res);
        alert(`Error saving data! \n ${JSON.stringify(res)}`);
      }
    }
  }

  const onResetStock = (stockType) => {
    if (STOCK_TYPE.CONTAINER === stockType) {
      console.log("container ...");
    }

    if (STOCK_TYPE.PRODUCTION === stockType) {
      console.log("production ...");
    }
  };

  return (
    <div>
      <Loading isLoading={loading} />

      <div className={`  ${loading ? "hidden" : "block"} `}>
        {/* <Stock
          stock={stock_cont}
          label={"CONTAINER"}
          onResetStock={(e) => set_stock_cont({ s32: 0, s42: 0 })}
        /> */}
        <TabCont tabs={SACS_SECTIONS} onSelectTab={onSelectTab} />
        {curtab && (
          <>
            {SACS_SECTIONS.PRODUCTION.label === curtab[1].label && (
              <SacsProduction
                trans={trans_prod}
                onAddTrans={onAddTrans}
                stock={stock_prod}
                setStock={set_stock_prod}
                onResetStock={onResetStock}
              />
            )}
            {SACS_SECTIONS.CONTAINER.label === curtab[1].label && (
              <SacsContainer
                trans={trans_cont}
                onAddTrans={onAddTrans}
                stock={stock_cont}
                onResetStock={onResetStock}
              />
            )}
            {SACS_SECTIONS.CALCULATOR.label === curtab[1].label && <SacsCalc />}
          </>
        )}
      </div>
    </div>
  );
}
