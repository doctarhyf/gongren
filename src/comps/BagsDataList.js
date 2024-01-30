import React, { useEffect, useRef, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "../comps/Loading";
import DateSelector from "./DateSelector";
import { CLASS_BTN, CLASS_TD, MONTHS } from "../helpers/flow";
import excel from "../img/excel.png";
import Papa from "papaparse";
import {
  CorrectZeroMonthIndexDisplay,
  customSortByDate,
  customSortDaysArray,
  formatFrenchDate,
} from "../helpers/func";
import ButtonPrint from "./ButtonPrint";
import RepportCard from "./RepportCard";
import TableLoads from "./TableLoads";

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

  useEffect(() => {
    onDateSelected({ y: new Date().getFullYear(), m: new Date().getMonth() });
  }, [showRepportMode]);

  function onDateSelected(new_date) {
    setdate(new_date);
    setTotalData(undefined);
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

  function printLoadTabled(loasds, totals) {
    console.log(loads, totals);
  }

  function genTotalCSVData(data) {
    const headers = Object.keys(data).join(",") + "\n";
    const values = Object.values(data).join(",");
    const csvString = headers + values;
    const csvData =
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvString);
    return { csvString: csvString, csvData: csvData };
  }

  function genLoadsCSVData(data) {
    /*
            "日期",
            "班组",
            "产量(T)",
            "设备原因",
            "电气原因",
            "停电原因",
            "其它原因",
            "备注"*/

    const days_entries = Object.entries(data);
    const ld_keys = Object.keys(days_entries[1][1][0]);
    const [
      id,
      created_at,
      sacs,
      retours,
      ajouts,
      code,
      prob_machine,
      prob_courant,
      autre,
      camions,
      dechires,
    ] = ld_keys;

    //const headers = "Date," + ld_keys.join(",") + "\n";
    const headers =
      "Date/日期,Equipe/班组,袋数,·T/产量,Ajouts/加袋数,Retours/卸袋数,Dechires/撕裂袋数,PROB. MACHINE/设备原因,PROB. ELEC./电气原因, AUTRE/其它原因, NOTE/备注";
    let cont = "";

    days_entries.forEach((it, i_it) => {
      const date = it[0];
      const loads = it[1];
      const data_len = loads.length;

      loads.forEach((ld, i_ld) => {
        const ld_values = Object.values(ld);
        const [
          id,
          created_at,
          sacs,
          retours,
          ajouts,
          code,
          prob_machine,
          prob_courant,
          autre,
          camions,
          dechires,
        ] = ld_values;
        const [team, shift, y, m, d] = code.split("_");

        const values_line = `${i_ld === 0 ? date : ""},${team},${Number(
          sacs
        )},${
          Number(sacs) / 20
        },${ajouts}, ${retours}, ${dechires},${prob_machine},${prob_courant}, ${autre}\n`;

        //const csv = `${i_ld === 0 ? date : ""},${ld_values.join(",")},\n`;
        cont += values_line;
      });
    });

    const csvString = headers + cont;

    const csvData =
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvString);
    return { csvString: csvString, csvData: csvData };
  }

  function downloadExcel(loads, totals) {
    //genLoadsCSVData(loads);
    const link = document.createElement("a");
    link.href = genLoadsCSVData(loads).csvData;
    link.download = "data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      <Loading isLoading={loading} />

      {showRepportMode && (
        <>
          <DateSelector
            hideSelectDateType={true}
            defaultDateType={"Y"}
            onDateSelected={onDateSelected}
          />
          <div>Select date to view repport</div>
          {loads === undefined && (
            <div>
              No data for selected date <b>{`${MONTHS[date.m]}, ${date.y}`}</b>
            </div>
          )}

          {
            <div>
              <div className="flex">
                <div className="flex gap-4">
                  <ButtonPrint
                    title={"PRINT"}
                    onClick={(e) => printLoadTabled(loadsbif, totalData)}
                  />
                  <ButtonPrint
                    icon={excel}
                    title={"DOWNLOAD EXCEL"}
                    onClick={(e) => downloadExcel(loadsbif, totalData)}
                  />
                </div>
              </div>
              <TableLoads
                date={date}
                totalData={totalData}
                loadsData={loadsbif}
              />
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
