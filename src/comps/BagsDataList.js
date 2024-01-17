import React, { useEffect, useRef, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "../comps/Loading";
import DateSelector from "./DateSelector";
import { CLASS_BTN, MONTHS } from "../helpers/flow";

export default function BagsDataList() {
  const [loading, setloading] = useState(false);
  const [loads, setloads] = useState([]);
  const [loadsf, setloadsf] = useState([]);
  const [date, setdate] = useState();
  const [yearData, setYearData] = useState();
  const [monthData, setMonthData] = useState();
  const [dayData, setDayData] = useState();
  const [shiftData, setShiftData] = useState();
  const [curLoadData, setCurLoadData] = useState();

  function onDateSelected(new_date) {
    setdate(new_date);
    setloadsf([]);

    /* setSelectedLoad(undefined);
    const [y, m, d, t] = Object.values(new_date);
    const date_code = `${y}_${m}_${d}`;

    const loads_filtered = loads.filter((it, i) => {
      const { code } = it;

      const [equipe, shift, y, m, d] = code.split("_");
      const cur_date_code = `${y}_${m}_${d}`;
      return date_code === cur_date_code;
    });

    setloadsf(loads_filtered); */
  }

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

  function stfy(d) {
    return JSON.stringify(d).toString();
  }
  return (
    <div>
      <Loading isLoading={loading} />
      <DateSelector onDateSelected={onDateSelected} />

      <div className="flex  ">
        <div className="border-l pl-1">
          {Object.entries(loadsf).map((year_data, i) => (
            <div
              key={i}
              onClick={(e) => {
                setYearData(year_data[1]);
              }}
              className={CLASS_BTN}
            >
              {year_data[0]}
            </div>
          ))}
        </div>

        {yearData && (
          <div className="border-l pl-1">
            {Object.entries(yearData).map((month_data, i) => (
              <div
                key={i}
                onClick={(e) => {
                  setMonthData(month_data[1]);
                }}
                className={CLASS_BTN}
              >
                {month_data[0]}
              </div>
            ))}
          </div>
        )}

        {monthData && (
          <div className="border-l pl-1">
            {Object.entries(monthData).map((day_data, i) => (
              <div
                key={i}
                onClick={(e) => {
                  setDayData(day_data[1]);
                }}
                className={CLASS_BTN}
              >
                {day_data[0]}
              </div>
            ))}
          </div>
        )}

        {dayData && (
          <div className="border-l pl-1">
            {Object.entries(dayData).map((shift_data, i) => (
              <div
                key={i}
                onClick={(e) => {
                  console.log("shift data", shift_data[1]);
                  setShiftData(shift_data[1]);
                }}
                className={CLASS_BTN}
              >
                {shift_data[1].code}
              </div>
            ))}
          </div>
        )}
      </div>

      {shiftData && (
        <div className="border-l pl-1">
          {[
            ...Object.entries(shiftData),
            ["Tonnage", Object.entries(shiftData)[2][1] / 20 + "T"],
          ].map((dt, i) => (
            <div key={i}>
              {dt[0]} : {dt[1]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
