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

function Table({
  records,
  onRowClick,
  addingNewRecord,
  ref_team,
  ref_sacs,
  ref_ag_mag,
  ref_chef_deq,
}) {
  return (
    <table>
      <tr>
        {Object.keys(records[0]).map((it, i) => (
          <td className={CLASS_TD}>{it}</td>
        ))}
      </tr>
      {Object.values(records).map((it, i) => (
        <tr
          className={` hover:bg-slate-300 cursor-pointer `}
          onClick={(e) => onRowClick(it)}
        >
          {Object.values(it).map((v, i) => (
            <td className={CLASS_TD}>
              {i === 1 ? dateFormatter.format(new Date(v)) : v}
            </td>
          ))}
        </tr>
      ))}
      <tr className={` ${addingNewRecord ? "" : "hidden"} `}>
        <td className={CLASS_TD}></td>
        <td className={CLASS_TD}></td>
        <td className={CLASS_TD}>
          <select ref={ref_team}>
            {["A", "B", "C", "D"].map((t, i) => (
              <option key={i}>{t}</option>
            ))}
          </select>
        </td>
        <td className={CLASS_TD}>
          <input type="number" className={CLASS_INPUT_TEXT} ref={ref_sacs} />
        </td>
        <td className={CLASS_TD}>
          <input type="text" className={CLASS_INPUT_TEXT} ref={ref_ag_mag} />
        </td>
        <td className={CLASS_TD}>
          <input type="text" className={CLASS_INPUT_TEXT} ref={ref_chef_deq} />
        </td>
      </tr>
    </table>
  );
}

export default function Sacs() {
  const [stv, setstv] = useState(0);
  const [ss, setss] = useState(0);
  const [sd, setsd] = useState(0);
  const [su, setsu] = useState(0);
  const [sr, setsr] = useState(0);
  const [sc, setsc] = useState(0);
  const [sdiff, setsdiff] = useState(0);

  useEffect(() => {
    let restants = stv + ss - sd - su;
    let diff = restants - sc;

    setsr(restants);
    setsdiff(diff);

    console.log(`Sacs restants ; ${restants}`);
  }, [stv, ss, sd, su, sc]);

  return (
    <div>
      <div>Calculateurs de sacs</div>
      <div>Sacs trouves</div>
      <input
        type="number"
        keyboardType={"numeric"}
        value={stv}
        onChange={(e) => setstv(parseInt(e.target.value))}
      />
      <div>Sacs sortis</div>
      <input
        type="number"
        keyboardType={"numeric"}
        value={ss}
        onChange={(e) => setss(parseInt(e.target.value))}
      />
      <div>Sacs dechires</div>
      <input
        type="number"
        keyboardType={"numeric"}
        value={sd}
        onChange={(e) => setsd(parseInt(e.target.value))}
      />
      <div>Sacs utilises</div>
      <input
        type="number"
        keyboardType={"numeric"}
        value={su}
        onChange={(e) => setsu(parseInt(e.target.value))}
      />

      <div>Sacs comptes apres chargement</div>
      <input
        type="number"
        keyboardType={"numeric"}
        value={sc}
        onChange={(e) => setsc(parseInt(e.target.value))}
      />

      <div>Sacs Restants</div>
      <div>{sr}</div>
      <div>Sacs Perdus</div>
      <div>{sdiff}</div>
    </div>
  );
}

/* export default function Sacs() {
  const [, , user] = useContext(UserContext);

  const [addingNewRecord, setAddingNewRecord] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [records, loading, error, reload] = useDataLoader(TABLES_NAMES.SACS);
  const [newrec, setnewrec] = useState();
  const def_obj = {
    //id: 1,
    //created_at: "2024-02-15T10:46:18.549578+00:00",
    equipe: "",
    sacs: 0,
    agent_mag: "",
    chef_deq: "",
  };

  const ref_team = useRef();
  const ref_sacs = useRef();
  const ref_ag_mag = useRef();
  const ref_chef_deq = useRef();

  async function saveNewRecord() {
    setDataLoading(true);
    let newdt = {
      equipe: _(ref_team),
      sacs: Number(_(ref_sacs)),
      agent_mag: _(ref_ag_mag),
      chef_deq: _(ref_chef_deq),
    };

    const res = await SB.InsertItem(TABLES_NAMES.SACS, newdt);

    if (res === null) {
      alert("Record saved!");
      reload();
    } else {
      alert("Error \n" + JSON.stringify(res));
      console.log(res);
    }

    setDataLoading(false);
  }

  function print() {
    const doc = new jsPDF();

    if (records.length === 0) {
      alert("Sorry, cant print empty data!");
      return;
    }

    let headers = Object.keys(records[0]);
    headers = [headers];

    let body = records.map((rec, i) =>
      Object.values(rec).map((it, i) =>
        i === 1 ? formatFrenchDate(new Date(it)) : it + ""
      )
    );

    console.log(headers);
    console.log(body);

    autoTable(doc, {
      head: headers,
      body: body,
    });

    doc.save("table.pdf");
  }

  async function onRowClick(it) {
    console.log(it);
    if (window.confirm("Delete record?")) {
      const res = await SB.DeleteItem(TABLES_NAMES.SACS, it);

      console.log(res);
      reload();
    }
  }

  return (
    <div>
      <Loading isLoading={dataLoading} />
      <div>{loading && "loading ..."}</div>
      <div>
        <div className="text-red-500 uppercase text-xs font-bold">
          Click on item to delete it!
        </div>
        {records && records.length > 0 && (
          <Table
            records={records}
            onRowClick={onRowClick}
            addingNewRecord={addingNewRecord}
            ref_team={ref_team}
            ref_sacs={ref_sacs}
            ref_ag_mag={ref_ag_mag}
            ref_chef_deq={ref_chef_deq}
          />
        )}
        <div className=" md:flex">
          {user.user_level === USER_LEVEL.SUPER && (
            <>
              {addingNewRecord && (
                <button className={CLASS_BTN} onClick={(e) => saveNewRecord()}>
                  SAVE NEW RECORD
                </button>
              )}

              <button
                className={CLASS_BTN}
                onClick={(e) => {
                  setAddingNewRecord(!addingNewRecord);
                }}
              >
                {addingNewRecord ? "CANCEL" : "ADD NEW RECORD"}
              </button>
            </>
          )}
          <button className={CLASS_BTN} onClick={(e) => reload()}>
            RELOAD
          </button>
          <ButtonPrint onClick={print} />
        </div>
      </div>
      <div>{error && JSON.stringify(error)}</div>
    </div>
  );
}
 */
