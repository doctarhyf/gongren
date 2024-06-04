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
//import SacsContainer from "../comps/SacsContainer";

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZone: "UTC", // Adjust to local time zone if needed
  timeZoneName: "short",
};

const TRANSACTION_TYPE = {
  CONTAINER: "CONTAINER",
  PRODUCTION: "PRODUCTION",
};

const SECTIONS = {
  CONTAINER: { label: "SACS CONTAINER" },
  PRODUCTION: { label: "SACS PRODUCTION" },
};

const transaction_container = {
  id: 0,
  team: "A", // A | B | C | D
  type: "", // normal | sinoma,
  sacs: 0,
  createdAt: new Date().toISOString(),
};

const transaction_production = {
  id: 0,
  team: "A", // A | B | C | D
  createdAt: new Date().toISOString(),
  st: 0, // sacs trouves
  ss: 0, // sacs sortis
  su: 0, // sacs utilises
  prod: 0, // production
  sd: 0, // sacs dechires
  sr: 0, // sacs restants
};

function MyButton({ title = "ADD", onClick }) {
  return (
    <button
      onClick={onClick}
      className=" p-1 rounded-lg bg-sky-500 hover:bg-sky-300 text-white  "
    >
      {title}
    </button>
  );
}

function SacsContainer({ onAddTrans, trans_cont }) {
  const type = TRANSACTION_TYPE.CONTAINER;

  return (
    <div className=" container  ">
      <div>
        <MyButton onClick={(e) => onAddTrans(type)} />
      </div>
      <table>
        <thead>
          <th>
            <td>ID</td>
            <td>Team</td>
            <td>Type</td>
            <td>Sacs</td>
            <td>Date</td>
          </th>
        </thead>
        <tbody>
          {trans_cont.map((t, i) => (
            <tr>
              <td>{t.id}</td>
              <td>{t.team}</td>
              <td>{t.type}</td>
              <td>{t.sacs}</td>
              <td>{t.dates}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FormInput({ type, set_show_form, on_save }) {
  const [data, setdata] = useState({});

  return (
    <div>
      {type === TRANSACTION_TYPE.CONTAINER && <div>form</div>}
      {type === TRANSACTION_TYPE.PRODUCTION && <div>form prod</div>}
      <div>
        <MyButton onClick={(e) => on_save("cool", type)} title="SAVE" />
        <MyButton onClick={(e) => set_show_form(false)} title="CANCEL" />
      </div>
    </div>
  );
}

function SacsProduction({ trans_prod, onAddTrans }) {
  const type = TRANSACTION_TYPE.PRODUCTION;

  return (
    <div>
      <div>
        <MyButton onClick={(e) => onAddTrans(type)} />
      </div>

      {JSON.stringify(trans_prod)}
    </div>
  );
}

export default function Sacs() {
  const [trans_cont, set_trans_cont] = useState([]);
  const [trans_prod, set_trans_prod] = useState([]);
  const [selsec, setselsec] = useState(SECTIONS.CONTAINER);
  const [show_form, set_show_form] = useState(false);
  const [form_type, set_form_type] = useState(undefined);

  const on_save = (dt, t) => console.log(dt, t);

  const onAddTrans = (t) => {
    // console.log(t);
    set_form_type(t);
    set_show_form(true);

    return;
    if (t === TRANSACTION_TYPE.CONTAINER) {
      set_trans_cont((old) => [...old, { ...transaction_container }]);
    } else {
      set_trans_prod((old) => [...old, { ...transaction_production }]);
    }
  };

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

      <div className=" text-3xl font-thin  ">
        <div>
          Stock Container :{" "}
          <span className=" font-bold text-green-900 ">{0}</span>
        </div>
        <div className=" text-base text-gray-800  ">
          Last update :{" "}
          <span className=" font-bold  ">
            {new Intl.DateTimeFormat("fr-FR", options).format(new Date())}
          </span>
        </div>
      </div>

      {show_form && (
        <FormInput
          type={form_type}
          set_show_form={set_show_form}
          on_save={on_save}
        />
      )}

      {!show_form && (
        <>
          {SECTIONS.CONTAINER.label === selsec.label && (
            <SacsContainer onAddTrans={onAddTrans} trans_cont={trans_cont} />
          )}
          {SECTIONS.PRODUCTION.label === selsec.label && (
            <SacsProduction onAddTrans={onAddTrans} trans_prod={trans_prod} />
          )}
        </>
      )}
    </div>
  );
}
