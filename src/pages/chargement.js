import React, { useEffect, useRef, useState } from "react";
import { MONTHS } from "../helpers/flow";
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
} from "../helpers/func";
import RepportCard from "../comps/RepportCard";

export default function Chargement() {
  const [date, setdate] = useState({});

  const [addDataMode, setAddDataMode] = useState(false);
  const [loading, setloading] = useState(false);
  const [loads, setloads] = useState([]);
  const [loadsf, setloadsf] = useState([]);
  const [loads_by_item, set_loads_by_item] = useState();
  const [showRepportMode, setShowRepportMode] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setloading(true);
    setloadsf([]);
    setloads([]);
    setRepportData({});
    set_loads_by_item([]);
    const d = await SB.LoadAllItems(TABLES_NAMES.LOADS);

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
    setShiftDataToUpdate(data);
    setAddDataMode(true);
    loadData();
  }

  async function onDeleteShiftData(data) {
    console.log(`deleting shift data ...`, data);

    const error = await SB.DeleteItem(TABLES_NAMES.LOADS, data);
    if (error) {
      const msg = `Error deleting ...\n${JSON.stringify(error)}`;
      alert(msg);
      console.log(msg);
      return;
    }

    alert(`Load deleted!`);
    loadData();
  }

  return (
    <div>
      <Loading isLoading={loading} />
      <div>
        ADD DATA
        <input
          type="checkbox"
          className="toggle toggle-xs"
          checked={addDataMode}
          onChange={(e) => {
            setShiftDataToUpdate(undefined);
            setAddDataMode(e.target.checked);
          }}
        />
      </div>
      <div>
        SHOW REPPORT MODE
        <input
          type="checkbox"
          className="toggle toggle-xs"
          checked={showRepportMode}
          onChange={(e) => setShowRepportMode(e.target.checked)}
        />
      </div>
      {addDataMode && (
        <>
          <div>{shiftDataToUpdate && "updating ..."}</div>
          <BagsDataInput
            onCancel={(e) => setAddDataMode(false)}
            dataToUpdate={shiftDataToUpdate}
            onDataAdded={(e) => {
              setAddDataMode(false);
              loadData();
            }}
            date={date}
          />
        </>
      )}
      {!addDataMode && (
        <div className="flex  gap-4">
          <BagsDataList
            loadsf={loadsf}
            showRepportMode={showRepportMode}
            onSetDataLevel={onSetDataLevel}
            loads_by_item={loads_by_item}
          />

          <RepportCard
            data={repportData}
            onUpdateShiftData={onUpdateShiftData}
            onDeleteShiftData={onDeleteShiftData}
          />
        </div>
      )}
    </div>
  );
}
