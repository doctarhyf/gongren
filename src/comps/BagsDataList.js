import React, { useEffect, useRef, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "../comps/Loading";
import DateSelector from "./DateSelector";
import {
  CLASS_BTN,
  CLASS_TD,
  MONTHS,
  SHIFTS_ZH,
  SHIFT_HOURS_ZH,
} from "../helpers/flow";
import excel from "../img/excel.png";
import Papa from "papaparse";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import {
  CorrectZeroMonthIndexDisplay,
  customSortByDate,
  customSortDaysArray,
  formatFrenchDate,
  ParseTotalsData,
} from "../helpers/func";
import ButtonPrint from "./ButtonPrint";
import RepportCard from "./RepportCard";
import TableLoads from "./TableLoads";
import Excelexport from "./Excelexport";
import TableLoadsTotals from "./TableLoadsTotal";
import {
  doc,
  drawChineseEnglishTextLine,
  drawLogo,
  draw_en_tete,
} from "../helpers/funcs_print";

function DataSelector({
  loadsFiltered,
  onSetDataLevel,
  setYearData,
  setShiftData,
  setMonthData,
  setDayData,
  setDatePath,
  yearData,
  monthData,
  dayData,
  customOrderShift,
}) {
  const [sely, setsely] = useState();
  const [selm, setselm] = useState();
  const [seld, setseld] = useState();
  const [sels, setsels] = useState();

  return (
    <div className="flex divide-x  ">
      <div className=" pl-1">
        <div className="text-white px-2 text-sm bg-sky-500 mb-2">Annee/年</div>
        {Object.entries(loadsFiltered).map((year_data, i) => (
          <div
            key={i}
            onClick={(e) => {
              setsely(year_data);
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
            className={` ${CLASS_BTN}   ${
              sely && sely[0] === year_data[0] && "bg-sky-500 text-white"
            }    `}
          >
            {year_data[0]}
            {sely && sely[0] === year_data[0] && " ->"}
          </div>
        ))}
      </div>

      {yearData && (
        <div className=" pl-1">
          <div className="text-white px-2 text-sm bg-sky-500 mb-2">Mois/月</div>
          {Object.entries(yearData).map((month_data, i) => (
            <div
              key={i}
              onClick={(e) => {
                setselm(month_data);
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
              className={`  
                
                 ${CLASS_BTN}   ${
                selm && selm[0] === month_data[0] && "bg-sky-500 text-white"
              }   
                
                `}
            >
              {CorrectZeroMonthIndexDisplay(month_data[0])}
              {selm && selm[0] === month_data[0] && " ->"}
            </div>
          ))}
        </div>
      )}

      {monthData && (
        <div className=" pl-1">
          <div className="text-white px-2 text-sm bg-sky-500 mb-2">Jour/日</div>
          {Object.entries(monthData)
            .sort(customSortDaysArray)
            .map((day_data, i) => (
              <div
                key={i}
                onClick={(e) => {
                  setseld(day_data);
                  onSetDataLevel("d", day_data);
                  setShiftData(undefined);
                  setDatePath((old) => ({
                    ...old,
                    d: day_data[0].split("-")[2],
                    shift: "",
                  }));
                  setDayData(day_data[1]);
                }}
                className={`  
                
                 ${CLASS_BTN}   ${
                  seld && seld[0] === day_data[0] && "bg-sky-500 text-white"
                }   
                
                `}
              >
                {CorrectZeroMonthIndexDisplay(day_data[0])}
                {seld && seld[0] === day_data[0] && " ->"}
              </div>
            ))}
        </div>
      )}

      {dayData && (
        <div className=" pl-1">
          <div className="text-white px-2 text-sm bg-sky-500 mb-2">
            Equipe/班次
          </div>
          {Object.entries(dayData)
            .sort((a, b) => {
              const codeA = a[1].code.charAt(2);
              const codeB = b[1].code.charAt(2);

              return customOrderShift[codeA] - customOrderShift[codeB];
            })
            .map((shift_data, i) => (
              <div
                key={i}
                onClick={(e) => {
                  setsels(shift_data);
                  onSetDataLevel("s", shift_data);
                  setDatePath((old) => ({
                    ...old,
                    shift: shift_data[1].code,
                  }));
                  setShiftData(shift_data[1]);
                }}
                className={`  
                
                 ${CLASS_BTN}   ${
                  sels &&
                  sels[1].code === shift_data[1].code &&
                  "bg-sky-500 text-white"
                }   
                
                `}
              >
                {shift_data[1].code}{" "}
                {sels && sels[1].code === shift_data[1].code && "->"}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default function BagsDataList({
  loadsf: loadsFiltered,
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
  const [showTotals, setShowTotals] = useState(false);

  const [yearTotals, setYearTotals] = useState();
  const [loadsByShiftOfDay, setLoadsByShiftOfDay] = useState();

  useEffect(() => {
    init();
  }, [loadsFiltered, showRepportMode]);

  function init() {
    //console.log("init bag data list");
    onDateSelected({
      y: new Date().getFullYear(),
      m: new Date().getMonth() - 1,
    });
  }

  function onDateSelected(new_date) {
    console.log(`New date selected : ${JSON.stringify(new_date)}`);

    setTotalData([]);
    setdate(new_date);
    setYearTotals(undefined);
    setLoadsByShiftOfDay([]);

    setYearData([]);
    setMonthData([]);
    setDayData([]);
    setShiftData(undefined);

    const { y: year, m: month } = new_date;
    const date_code = `${new_date.y}-${new_date.m}`;
    const data = loadsFiltered[year] && loadsFiltered[year][date_code];

    setloads(data);
    if (data === undefined) {
      setLoadsByShiftOfDay([]);
      return;
    }

    const sortedByShiftOfDay = SortLoadsByShoftOfDay(
      loads_by_item,
      year,
      month
    );
    setLoadsByShiftOfDay(sortedByShiftOfDay);
    setTotalData(ParseTotalsData(sortedByShiftOfDay));
    setYearTotals(CalculateYearTotal(loads_by_item));
  }

  const [totalData, setTotalData] = useState([]);

  const customOrderShift = { M: 1, N: 3, P: 2 };

  const customSortShifts = (a, b) => {
    const codeA = a.code.charAt(2);
    const codeB = b.code.charAt(2);

    return customOrderShift[codeA] - customOrderShift[codeB];
  };

  const CalculateYearTotal = (year_data) => {
    ////////
    let tot_sacs = 0;
    let tot_camions = 0;
    let tot_retours = 0;
    let tot_ajouts = 0;
    let tot_dechires = 0;
    let tot_bonus = 0;

    year_data.forEach((it, i) => {
      ////// total math
      const { sacs, camions, ajouts, retours, dechires } = it;

      tot_sacs += sacs;
      tot_camions += camions;
      tot_ajouts += ajouts;
      tot_retours += retours;
      tot_dechires += dechires;

      const bonus = Number(sacs) / 20 - 600 < 0 ? 0 : Number(sacs) / 20 - 600;
      tot_bonus += bonus;
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

    return total_data;
  };

  function SortLoadsByShoftOfDay(data, y, m) {
    let year_data =
      data.filter && data.filter((it, i) => it.code.includes(`${y}_${m}`));

    year_data = year_data.sort(customSortByDate);

    let sorted_loads = {};

    year_data.forEach((it, i) => {
      const [team, shift, year, month, date] = it.code.split("_");
      const day = `${year}_${month}_${date}`;

      if (sorted_loads[day] === undefined) {
        sorted_loads[day] = [it];
      } else {
        sorted_loads[day].push(it);
      }

      let old = sorted_loads[day];

      sorted_loads[day] = [...old.sort(customSortShifts)];
    });

    //console.log("sorted => \n", sorted_loads);
    return sorted_loads;
  }

  function stfy(d) {
    return JSON.stringify(d).toString();
  }

  function createHeaders(keys) {
    var result = [];
    for (var i = 0; i < keys.length; i += 1) {
      result.push({
        id: keys[i],
        name: keys[i],
        prompt: keys[i],
        width: 80,
        align: "center",
        padding: 0,
      });
    }
    return result;
  }

  function repeatChar(char = "*", count = 15) {
    return [...Array(count)].map((c, i) => char).join("");
  }

  function printLoadTabled(loads, totals) {
    const doc = new jsPDF({ orientation: "portrait" });
    const FONT_SIZE = 10;
    let ty = -1;
    let tm = -1;

    doc.setFont("helvetica");
    doc.setFontSize(FONT_SIZE);

    let r = doc.addFont(
      "fonts/DroidSansFallback.ttf",
      "DroidSansFallback",
      "normal"
    );

    console.log(r);

    const body = [];

    const def = {
      date: repeatChar(),
      shift: repeatChar(),
      equipe: repeatChar(),
      sacs: repeatChar(),
      T: repeatChar(),
      camions: repeatChar(),
      dechires: repeatChar(),
    };

    Object.entries(loads).map((data_day, i_loads) => {
      const day_key = data_day[0];
      const day_data = data_day[1];

      let shift_idx = 0;
      day_data.map((shift, i_day) => {
        const {
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
        } = shift;

        const tonnage = Number(sacs) / 20;
        const [t, s, y, m, d] = code.split("_");

        const [s_fr, s_zh, s_h] = SHIFT_HOURS_ZH[s];

        /* const load_data_a = [
          day_key,
          t,
          s_fr,
          // s_zh,
          sacs + "",
          tonnage.toFixed(2),
          camions + "",
          dechires + "",
        ]; */

        const date_str = `${y}.${Number(m) + 1}.${d}`;
        ty = y;
        tm = m;

        const load_data = {
          date: shift_idx === 0 ? date_str : '"',
          shift: s_fr,
          equipe: t,
          sacs: sacs + "",
          T: tonnage.toFixed(2),
          camions: camions + "",
          dechires: dechires + "",
        };

        body.push(load_data);

        shift_idx++;
      });
    });

    console.log(body);

    var headers = createHeaders([
      "date",
      "shift",
      "equipe",
      "sacs",
      "T",
      "camions",
      "dechires",
    ]);

    const tableConfig = {
      printHeaders: true,
      autoSize: true,
      margins: 0,
      fontSize: FONT_SIZE,
      padding: 2.5,
      //headerBackgroundColor: "gray",
      // headerTextColor?: string;
    };

    body.push(def);

    doc.text(formatFrenchDate(new Date()), 210 - 15, 10, { align: "right" });

    const doc_title = `RAPPORT CHARGEMENT, ${MONTHS[tm]} - ${ty}`;
    const file_name = `RAPPORT_CHARGEMENT_${MONTHS[tm]}_${ty}`;
    doc.text(doc_title, 105, 20, {
      align: "center",
    });

    doc.table(15, 25, body, headers, tableConfig);
    doc.save(file_name);
  }

  function genTotalCSVData(data) {
    const headers = Object.keys(data).join(",") + "\n";
    const values = Object.values(data).join(",");
    const csvString = headers + values;
    const csvData =
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvString);
    return { csvString: csvString, csvData: csvData };
  }

  function GenExcelLoadsData(data) {
    if (data === undefined) {
      console.log("data is still null");
      return;
    }
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

    if (days_entries.length === 0) return;
    const first_element = days_entries[0][1][0];

    const loading_keys = Object.keys(first_element);

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
    ] = loading_keys;

    const headers = `[
      "Date/日期",
      "Equipe/班组",
      "Sacs/袋数",
      "T,/产量",
      "Ajouts/加袋数",
      "Retours/卸袋数",
      "Dechires/撕裂袋数",
      "PROB. MACHINE/设备原因",
      "PROB. ELEC./电气原因",
      "NOTE/备注"
    ]`;

    /*const headers =
      "Date/日期,Equipe/班组,袋数,·T/产量,Ajouts/加袋数,Retours/卸袋数,Dechires/撕裂袋数,PROB. MACHINE/设备原因,PROB. ELEC./电气原因, AUTRE/其它原因, NOTE/备注";
    */

    const num_days = days_entries.length;

    let final_data = `[${headers},`;

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

        const data_id = `${i_ld === 0 ? date : ""}`;
        const data_team = `${team}`;
        const data_sacs = `${Number(sacs)}`;
        const data_t = `${Number(sacs) / 20}`;
        const data_ajouts = `${ajouts}`;
        const data_retours = `${retours}`;
        const data_dechires = `${dechires}`;
        const data_prob_machines = `${prob_machine}`;
        const data_prob_courant = `${prob_courant}`;
        const data_autre = `${autre}`;

        let line_data = `["${data_id}",
        "${data_team}",
        "${data_sacs}",
        "${data_t}",
        "${data_ajouts}",
        "${data_retours}",
        "${data_dechires}",
        "${data_prob_machines}",
        "${data_prob_courant}",
      "${data_autre}"]`;

        let trail = ",";
        if (i_it === num_days - 1 && i_ld === data_len - 1) {
          trail = "";
        }
        final_data += line_data + trail;
      });
    });

    final_data += "]";

    return JSON.parse(final_data);
  }

  function printTotalsTable(totalData, y, m) {
    const doc = new jsPDF({ orientation: "portrait" });
    let r = doc.addFont(
      "fonts/DroidSansFallback.ttf",
      "DroidSansFallback",
      "normal"
    );

    let rect = drawLogo(doc);

    rect = drawChineseEnglishTextLine(doc, rect.x, rect.y + rect.h + 8, 12, [
      { zh: "水泥车间包装奖金" },
      { lat: " - " },
      { lat: "" + y },
      { zh: "年" },
      { lat: "" + m },
      { zh: "月" },
    ]);

    doc.setFontSize(10);
    doc.text(`TOTAL CHARGEMENTS ${MONTHS[m]} ${y}`, rect.x, rect.y + 8);

    let head = Object.keys(totalData.A);
    head = [["Equipe", ...head]];
    let body = Object.entries(totalData).map((dt, i) => [
      dt[0],
      ...Object.values(dt[1]).map((v, i) =>
        [3, 6].includes(i)
          ? i === 6
            ? (v * 1000).toFixed(2)
            : v.toFixed(2)
          : v
      ),
    ]);

    autoTable(doc, {
      head: head,
      body: body,
      margin: { top: rect.y + rect.h + 8 },
    });

    doc.save("total.pdf");
  }

  return (
    <div>
      <Loading isLoading={loading} />

      {showRepportMode && (
        <>
          <DateSelector
            hideSelectDateType={true}
            defaultDateType={"M"}
            onDateSelected={onDateSelected}
            horizontal={true}
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
                <div>
                  <button
                    onClick={(e) => setShowTotals(!showTotals)}
                    className={CLASS_BTN}
                  >
                    SHOW/HIDE TOTALS
                  </button>
                </div>
              </div>
              <div className="">
                {showTotals && (
                  <>
                    <div>
                      <ButtonPrint
                        title={"PRINT TOTAL"}
                        onClick={(e) =>
                          printTotalsTable(totalData, date.y, date.m)
                        }
                      />
                    </div>
                    <TableLoadsTotals totalData={totalData} date={date} />
                  </>
                )}
                {!showTotals && (
                  <>
                    <div className="flex gap-4">
                      {!showTotals && (
                        <>
                          <ButtonPrint
                            title={"PRINT"}
                            onClick={(e) =>
                              printLoadTabled(loadsByShiftOfDay, yearTotals)
                            }
                          />
                          <Excelexport
                            excelData={GenExcelLoadsData(loadsByShiftOfDay)}
                          />
                        </>
                      )}
                    </div>
                    <TableLoads
                      date={date}
                      totalData={yearTotals}
                      loadsData={loadsByShiftOfDay}
                    />
                  </>
                )}
              </div>
            </div>
          }
        </>
      )}
      {!showRepportMode && (
        <div className="flex gap-4">
          <DataSelector
            loadsFiltered={loadsFiltered}
            onSetDataLevel={onSetDataLevel}
            setYearData={setYearData}
            setShiftData={setShiftData}
            setMonthData={setMonthData}
            setDayData={setDayData}
            setDatePath={setDatePath}
            yearData={yearData}
            monthData={monthData}
            dayData={dayData}
            customOrderShift={customOrderShift}
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
