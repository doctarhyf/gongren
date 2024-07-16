import React, { useContext, useEffect, useRef, useState } from "react";
import { ACCESS_CODES, CLASS_BTN, MONTHS, USER_LEVEL } from "../helpers/flow";
import DateSelector from "../comps/DateSelector";
import Loading from "../comps/Loading";
import BagsDataInput from "../comps/BagsDataInput";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import BagsDataList from "../comps/BagsDataList";
import {
  ParseDayRepport,
  ParseMonthRepport,
  ParseShiftRepport,
  ParseYearRepport,
  UserHasAccessCode,
} from "../helpers/func";
import RepportCard from "../comps/RepportCard";
import { UserContext } from "../App";

const bg = "bg-neutral-100";

export default function Chargement() {
  const [, , user] = useContext(UserContext);
  const [date, setdate] = useState({});

  const [addDataMode, setAddDataMode] = useState(false);
  const [loading, setloading] = useState(false);
  const [loads, setloads] = useState([]);
  const [loadsf, setloadsf] = useState([]);
  const [loads_by_item, set_loads_by_item] = useState();
  const [showRepportMode, setShowRepportMode] = useState(false);
  const [addSacsAdj, setAddSacsAdj] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [addSacsAdj]);

  async function loadData() {
    setloading(true);
    setloadsf([]);
    setloads([]);
    setRepportData({});
    set_loads_by_item([]);

    let d = await SB.LoadAllItems(TABLES_NAMES.LOADS);
    if (addSacsAdj) {
      const new_d = [];
      d.forEach((it, i) => {
        let new_sacs = it.sacs + it.sacs_adj;
        it.sacs = new_sacs;
        it.sacs_adj = 0;
        new_d.push({ ...it });
      });

      d = [...new_d];
      console.log("new d ", new_d);
    }

    set_loads_by_item(d);
    setloads(groupByYearMonthAndDay(d));
    setloadsf(groupByYearMonthAndDay(d));
    setloading(false);
  }

  const groupByYearMonthAndDay = (array) => {
    return array.reduce((acc, obj) => {
      const { code } = obj;
      const [team, shift, year, month, day] = code.split("_");
      const yearKey = year.toString();
      const monthKey = `${year}-${month}`;
      const dayKey = `${year}-${month}-${day}`;

      acc[yearKey] = acc[yearKey] || {};
      acc[yearKey][monthKey] = acc[yearKey][monthKey] || {};
      acc[yearKey][monthKey][dayKey] = acc[yearKey][monthKey][dayKey] || [];
      acc[yearKey][monthKey][dayKey].push(obj);

      return acc;
    }, {});
  };

  const groupByYearAndMonth = (array) => {
    return array.reduce((acc, obj) => {
      const { code } = obj;
      const [team, shift, year, month, day] = code.split("_");
      const key = `${year}-${MONTHS[month]}`;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(obj);

      return acc;
    }, {});
  };

  const [repportData, setRepportData] = useState();

  function onSetDataLevel(level, data) {
    let rep_data;
    setRepportData({});
    if (level === "y") {
      rep_data = ParseYearRepport(data);
      rep_data.tid = level;
      setRepportData(rep_data);
    }

    if (level === "m") {
      rep_data = ParseMonthRepport(data);
      rep_data.tid = level;
      setRepportData(rep_data);
    }

    if (level === "d") {
      rep_data = ParseDayRepport(data);
      rep_data.tid = level;
      setRepportData(rep_data);
    }

    if (level === "s") {
      rep_data = ParseShiftRepport(data);
      rep_data.tid = level;
      setRepportData(rep_data);
    }
  }

  const [shiftDataToUpdate, setShiftDataToUpdate] = useState();

  function onUpdateShiftData(data) {
    //console.log(data);
    if (addSacsAdj) {
      alert("Cant update in addSacsAdj mode!");
      return;
    }
    setShiftDataToUpdate(data);
    setAddDataMode(true);
    loadData();
  }

  async function onDeleteShiftData(data) {
    //console.log(data);
    if (addSacsAdj) {
      alert("Cant delete in addSacsAdj mode!");
      return;
    }

    setloading(true);

    const error = await SB.DeleteItem(TABLES_NAMES.LOADS, data);
    if (error) {
      const msg = `Error deleting ...\n${JSON.stringify(error)}`;
      alert(msg);
      console.log(msg);
      loadData();
      setloading(false);
      setAddDataMode(false);
      return;
    }

    alert(`Load deleted!`);
    loadData();
    setloading(false);
    setAddDataMode(false);
  }

  function onAddDataClick() {
    setShiftDataToUpdate(undefined);
    setAddDataMode(true);
  }

  function onBagsDataAdded(upd) {
    setAddDataMode(false);
    loadData();

    if (upd) {
      alert("Data updated");

      return;
    }

    alert("New data added!");
  }

  return (
    <div>
      <Loading isLoading={loading} />

      {UserHasAccessCode(user, ACCESS_CODES.ADD_NEW_LOAD) && (
        <button
          className={`${CLASS_BTN}  ${addDataMode ? "hidden" : "block"} `}
          onClick={onAddDataClick}
        >
          ADD NEW DATA
        </button>
      )}

      {addDataMode && (
        <BagsDataInput
          onCancel={(e) => setAddDataMode(false)}
          dataToUpdate={shiftDataToUpdate}
          onDataAdded={onBagsDataAdded}
          onError={(e) => {
            console.log(e);
            alert(
              "Bags data input error!\nThe data may already exists!\n" +
                JSON.stringify(e)
            );
          }}
          date={date}
        />
      )}
      {!addDataMode && (
        <div>
          <div>
            TOGGLE REPPORT MODE
            <input
              type="checkbox"
              className="toggle toggle-xs"
              checked={showRepportMode}
              onChange={(e) => setShowRepportMode(e.target.checked)}
            />
          </div>
          {UserHasAccessCode(user, ACCESS_CODES.ROOT) && (
            <div>
              <span className=" font-bold text-white bg-green-800 p-1 rounded-md my-2 inline-block ">
                ADD SACS ADJ
              </span>
              <input
                type="checkbox"
                className="toggle toggle-xs"
                checked={addSacsAdj}
                onChange={(e) => setAddSacsAdj(e.target.checked)}
              />
            </div>
          )}
          <div className="flex  gap-4">
            {true && (
              <BagsDataList
                loadsf={loadsf}
                showRepportMode={showRepportMode}
                onSetDataLevel={onSetDataLevel}
                loads_by_item={loads_by_item}
                repportData={repportData}
                onUpdateShiftData={onUpdateShiftData}
                onDeleteShiftData={onDeleteShiftData}
                addSacsAdj={addSacsAdj}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
