import React, { useEffect, useRef, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "../comps/Loading";
import DateSelector from "./DateSelector";
import { CLASS_BTN, CLASS_TD, MONTHS } from "../helpers/flow";

function MyForm() {
  return (
    <table>
      <tbody>
        <tr>
          <td className={CLASS_TD} colSpan={8} align="center">
            水泥包装每班产量统计分析
          </td>
        </tr>
        <tr>
          {[
            "日期",
            "班组",
            "产量(T)",
            "设备原因",
            "电气原因",
            "停电原因",
            "其它原因",
            "备注",
          ].map((title, i) => (
            <td key={i} className={CLASS_TD}>
              {title}
            </td>
          ))}
        </tr>
        {[...Array(31)].map((r, i) => (
          <tr key={i}>
            <td className={CLASS_TD}>2023.01.{i + 1}</td>
            <td className={CLASS_TD}>cool</td>
          </tr>
        ))}
      </tbody>
      {/* <tbody>
                <tr>
                  <td className={CLASS_TD}>Date</td>
                  <td className={CLASS_TD}>Sacs</td>
                  <td className={CLASS_TD}>Ajouts</td>
                  <td className={CLASS_TD}>Retours</td>
                </tr>
                {Object.entries(loads).map((day, i) => (
                  <tr>
                    <td className={CLASS_TD}>{day[0]}</td>
                    <td className={CLASS_TD}>
                      {Object.values(day[1]).map((d, i) => (
                        <tr className="p-0 border-collapse">
                          <td className={CLASS_TD}>{d.code}</td>
                          <td className={CLASS_TD}>{d.sacs}</td>
                        </tr>
                      ))}
                    </td>
                    <td className={CLASS_TD}>
                      {Object.values(day[1]).map((d, i) => (
                        <tr className="p-0 border-collapse">
                          <td className={CLASS_TD}>{d.ajouts}</td>
                        </tr>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody> */}
    </table>
  );
}

export default function BagsDataList({
  loadsf,
  showRepportMode,
  onSetDataLevel,
}) {
  const [loading, setloading] = useState(false);
  const [loads, setloads] = useState([]);
  // const [loadsf, setloadsf] = useState([]);
  const [date, setdate] = useState();
  const [yearData, setYearData] = useState();
  const [monthData, setMonthData] = useState();
  const [dayData, setDayData] = useState();
  const [shiftData, setShiftData] = useState();
  const [curLoadData, setCurLoadData] = useState();
  const [datePath, setDatePath] = useState({
    y: new Date().getFullYear(),
    m: "",
    d: "",
    shift: "",
  });

  function onDateSelected(new_date) {
    setdate(new_date);

    const { y: year, m: month } = new_date;
    const date_code = `${new_date.y}-${new_date.m}`;
    const data = loadsf[year][date_code];
    setloads(data);
  }

  function stfy(d) {
    return JSON.stringify(d).toString();
  }
  return (
    <div>
      <Loading isLoading={loading} />

      {true && (
        <>
          {showRepportMode && (
            <>
              <DateSelector onDateSelected={onDateSelected} />
              {loads === undefined && (
                <div>
                  No data for selected date{" "}
                  <b>{`${MONTHS[date.m]}, ${date.y}`}</b>
                </div>
              )}

              {loads && (
                <div>
                  <div>repport mode cool</div>
                  <div>
                    {loadsf.map((ld, i) => (
                      <div>{JSON.stringify(ld)}</div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
      {!showRepportMode && (
        <>
          <div className="flex  ">
            <div className="border-l pl-1">
              <div>Annee/年</div>
              {Object.entries(loadsf).map((year_data, i) => (
                <div
                  key={i}
                  onClick={(e) => {
                    onSetDataLevel("y", year_data);
                    setShiftData(undefined);
                    setMonthData(undefined);
                    setDayData(undefined);
                    setDatePath((old) => ({
                      y: year_data[0],
                      m: "",
                      d: "",
                      shift: "",
                    }));
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
                <div>Mois/月</div>
                {Object.entries(yearData).map((month_data, i) => (
                  <div
                    key={i}
                    onClick={(e) => {
                      onSetDataLevel("m", month_data);
                      setShiftData(undefined);
                      setMonthData(undefined);
                      setDayData(undefined);
                      setDatePath((old) => ({
                        ...old,
                        m: MONTHS[Number(month_data[0].split("-")[1])],
                        d: "",
                        shift: "",
                      }));
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
                <div>Jour/日</div>
                {Object.entries(monthData).map((day_data, i) => (
                  <div
                    key={i}
                    onClick={(e) => {
                      onSetDataLevel("d", day_data);
                      setShiftData(undefined);
                      setDatePath((old) => ({
                        ...old,
                        d: day_data[0].split("-")[2],
                        shift: "",
                      }));
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
                <div>Equipe/班次</div>
                {Object.entries(dayData).map((shift_data, i) => (
                  <div
                    key={i}
                    onClick={(e) => {
                      onSetDataLevel("s", shift_data);
                      setDatePath((old) => ({
                        ...old,
                        shift: shift_data[1].code,
                      }));
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
        </>
      )}
    </div>
  );
}
