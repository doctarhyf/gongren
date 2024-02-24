import React, { useContext, useEffect, useRef, useState } from "react";
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

export default function Sacs() {
  const [, , user] = useContext(UserContext);
  const [records, loading, error] = useDataLoader(TABLES_NAMES.SACS);
  const [addingNewRecord, setAddingNewRecord] = useState(false);
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

  function saveNewRecord() {
    console.log(this);
    setAddingNewRecord(false);
  }

  return (
    <div>
      <div>Gerance sacs</div>
      <div>{loading && "loading ..."}</div>
      <div>
        {records && records.length > 0 && (
          <table>
            <tr>
              {Object.keys(records[0]).map((it, i) => (
                <td className={CLASS_TD}>{it}</td>
              ))}
            </tr>
            {Object.values(records).map((it, i) => (
              <tr>
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
                <input
                  type="number"
                  className={CLASS_INPUT_TEXT}
                  ref={ref_sacs}
                />
              </td>
              <td className={CLASS_TD}>
                <input
                  type="text"
                  className={CLASS_INPUT_TEXT}
                  ref={ref_ag_mag}
                />
              </td>
              <td className={CLASS_TD}>
                <input
                  type="text"
                  className={CLASS_INPUT_TEXT}
                  ref={ref_chef_deq}
                />
              </td>
            </tr>
          </table>
        )}
        {user.user_level === USER_LEVEL.SUPER && (
          <button
            className={CLASS_BTN}
            onClick={(e) => {
              if (!addingNewRecord) {
                setAddingNewRecord(true);
              } else {
                saveNewRecord();
              }
            }}
          >
            {addingNewRecord ? "SAVE RECORD" : "ADD NEW RECORD"}
          </button>
        )}
      </div>
      <div>{error && JSON.stringify(error)}</div>
    </div>
  );
}
