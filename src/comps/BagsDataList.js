import React, { useEffect, useRef, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "../comps/Loading";
import DateSelector from "./DateSelector";
import { CLASS_BTN, CLASS_TD, MONTHS } from "../helpers/flow";
import {
  CorrectZeroMonthIndexDisplay,
  customSortByDate,
  customSortDaysArray,
  formatFrenchDate,
} from "../helpers/func";
import ButtonPrint from "./ButtonPrint";
import RepportCard from "./RepportCard";

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
  loads_by_item,
  repportData,
  onUpdateShiftData,
  onDeleteShiftData,
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

  const [totalData, setTotalData] = useState();
  const [loadsbif, setloadsbif] = useState();

  function onDateSelected(new_date) {
    setdate(new_date);

    const { y: year, m: month } = new_date;
    const date_code = `${new_date.y}-${new_date.m}`;
    const data = loadsf[year] && loadsf[year][date_code];

    setloads(data);
    if (data === undefined) {
      setloadsbif([]);
      return;
    }
    setloadsbif(SortLoadsByYearMonth(loads_by_item, year, month));
  }

  const customOrderShift = { M: 1, N: 3, P: 2 };

  const customSortShifts = (a, b) => {
    const codeA = a.code.charAt(2);
    const codeB = b.code.charAt(2);

    return customOrderShift[codeA] - customOrderShift[codeB];
  };

  function SortLoadsByYearMonth(data, y, m) {
    let year_data =
      data.filter && data.filter((it, i) => it.code.includes(`${y}_${m}`));

    year_data = year_data.sort(customSortByDate);

    let sorted_loads = {};
    let tot_sacs = 0;
    let tot_camions = 0;
    let tot_retours = 0;
    let tot_ajouts = 0;
    let tot_dechires = 0;
    let tot_bonus = 0;

    year_data.forEach((it, i) => {
      const { sacs, camions, ajouts, retours, dechires } = it;

      tot_sacs += sacs;
      tot_camions += camions;
      tot_ajouts += ajouts;
      tot_retours += retours;
      tot_dechires += dechires;

      const bonus = Number(sacs) / 20 - 600 < 0 ? 0 : Number(sacs) / 20 - 600;
      tot_bonus += bonus;

      const [team, shift, year, month, date] = it.code.split("_");
      const day = `${year}_${month}_${date}`;

      if (sorted_loads[day] == undefined) {
        sorted_loads[day] = [it];
      } else {
        sorted_loads[day].push(it);
      }

      let old = sorted_loads[day];

      sorted_loads[day] = [...old.sort(customSortShifts)];
    });

    const total_data = {
      sacs: tot_sacs,
      camions: tot_camions,
      t: (Number(tot_sacs) / 20).toFixed(2),
      ajouts: tot_ajouts,
      retours: tot_retours,
      dechires: tot_dechires,
      bonus: tot_bonus,
    };

    setTotalData(total_data);
    console.log("total_data", total_data);

    return sorted_loads;
  }

  function stfy(d) {
    return JSON.stringify(d).toString();
  }
  return (
    <div>
      <Loading isLoading={loading} />

      {showRepportMode && (
        <>
          <DateSelector onDateSelected={onDateSelected} />
          <div>Select date to view repport</div>
          {loads === undefined && (
            <div>
              No data for selected date <b>{`${MONTHS[date.m]}, ${date.y}`}</b>
            </div>
          )}

          {
            <div>
              <div className="flex">
                <ButtonPrint title={"PRINT"} onClick={(e) => console.log(e)} />
              </div>
              <table>
                <thead>
                  <tr>
                    {[
                      "id",
                      "date",
                      //"code",
                      "equipe",
                      "shift",
                      "sacs",
                      "t",

                      "bonus",
                      "camions",
                      "dechires",
                      "retours",
                      "ajouts",
                    ].map((t, i) => (
                      <td className={CLASS_TD}>{t}</td>
                    ))}
                  </tr>
                  {totalData && (
                    <tr>
                      {[
                        "TOTAL",
                        "",
                        //"code",
                        "",
                        "",
                        totalData.sacs,
                        totalData.t,
                        totalData.bonus,
                        totalData.camions,
                        totalData.dechires,
                        totalData.retours,
                        totalData.ajouts,
                      ].map((t, i) => (
                        <>
                          {![1, 2, 3].includes(i) && (
                            <td className={CLASS_TD} colSpan={i === 0 ? 4 : 1}>
                              {t}
                            </td>
                          )}
                        </>
                      ))}
                    </tr>
                  )}
                </thead>
                <tbody>
                  {loadsbif &&
                    Object.entries(loadsbif).map((ld, i) => (
                      <tr
                        className={`p-0 ${
                          i % 2 === 0 ? "bg-neutral-100" : ""
                        } hover:bg-slate-200 hover:cursor-pointer`}
                      >
                        <td className={CLASS_TD}>{i}</td>
                        <td className={CLASS_TD}>
                          {ld[0].replaceAll("_", "/").replaceAll("/0/", "/1/")}
                        </td>
                        {/*  <td>
                              {ld[1].map &&
                                ld[1].map((it, i) => (
                                  <div className={CLASS_TD}>{it.code}</div>
                                ))}
                            </td> */}
                        <td>
                          {ld[1].map &&
                            ld[1].map((it, i) => (
                              <div className={CLASS_TD}>
                                {it.code.split("_")[0]}
                              </div>
                            ))}
                        </td>
                        <td>
                          {ld[1].map &&
                            ld[1].map((it, i) => (
                              <div className={CLASS_TD}>
                                {it.code.split("_")[1]}
                              </div>
                            ))}
                        </td>
                        <td>
                          {ld[1].map &&
                            ld[1].map((it, i) => (
                              <div className={CLASS_TD}>{it.sacs}</div>
                            ))}
                        </td>
                        <td>
                          {ld[1].map &&
                            ld[1].map((it, i) => (
                              <div className={CLASS_TD}>
                                {Number(it.sacs) / 20}
                              </div>
                            ))}
                        </td>
                        <td>
                          {ld[1].map &&
                            ld[1].map((it, i) => (
                              <div className={CLASS_TD}>
                                {Number(it.sacs) / 20 - 600 < 0
                                  ? 0
                                  : (Number(it.sacs) / 20 - 600).toFixed(2)}
                              </div>
                            ))}
                        </td>
                        <td>
                          {ld[1].map &&
                            ld[1].map((it, i) => (
                              <div className={CLASS_TD}>{it.camions}</div>
                            ))}
                        </td>
                        <td>
                          {ld[1].map &&
                            ld[1].map((it, i) => (
                              <div className={CLASS_TD}>{it.dechires}</div>
                            ))}
                        </td>
                        <td>
                          {ld[1].map &&
                            ld[1].map((it, i) => (
                              <div className={CLASS_TD}>{it.retours}</div>
                            ))}
                        </td>
                        <td>
                          {ld[1].map &&
                            ld[1].map((it, i) => (
                              <div className={CLASS_TD}>{it.ajouts}</div>
                            ))}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          }
        </>
      )}

      {!showRepportMode && (
        <div className="flex gap-4">
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
                    {CorrectZeroMonthIndexDisplay(month_data[0])}
                  </div>
                ))}
              </div>
            )}

            {monthData && (
              <div className="border-l pl-1">
                <div>Jour/日</div>
                {Object.entries(monthData)
                  .sort(customSortDaysArray)
                  .map((day_data, i) => (
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
                      {CorrectZeroMonthIndexDisplay(day_data[0])}
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
