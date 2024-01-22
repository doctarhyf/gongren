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
  const [showRepportMode, setShowRepportMode] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setloading(true);
    const d = await SB.LoadAllItems(TABLES_NAMES.LOADS);
    console.log(groupByYearMonthAndDay(d));

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
    console.log("lev dat ", data);

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
    console.log(data);
    setShiftDataToUpdate(data);
    setAddDataMode(true);
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
            onDataAdded={(e) => setAddDataMode(false)}
            date={date}
          />
        </>
      )}
      {!addDataMode && (
        <>
          <BagsDataList
            loadsf={loadsf}
            showRepportMode={showRepportMode}
            onSetDataLevel={onSetDataLevel}
          />

          <RepportCard
            data={repportData}
            onUpdateShiftData={onUpdateShiftData}
          />
        </>
      )}
    </div>
  );
}
