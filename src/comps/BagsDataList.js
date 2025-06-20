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
  customOrderShift,
  customSortByDate,
  customSortDaysArray,
  formatFrenchDate,
  CaclculateAllTeamsTotals,
  SortLoadsByShiftOfDay,
  CalculateYearTotal,
  sumAllPropsFromObjectArray,
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
              {selm && selm[0] === month_data[0] && (
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              )}
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
                {seld && seld[0] === day_data[0] && (
                  <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                    -&gt;
                  </span>
                )}
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
  addSacsAdj,
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
  const [showAllTeamsTotals, setShowAllTeamsTotals] = useState(false);
  const [loadsByShiftOfDay, setLoadsByShiftOfDay] = useState();

  const [yearTotals, setYearTotal] = useState();
  const [allTeamsTotals, setAllTeamsTotals] = useState([]);

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

    setAllTeamsTotals([]);
    setdate(new_date);
    setYearTotal(undefined);
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

    const sortedByShiftOfDay = SortLoadsByShiftOfDay(
      loads_by_item,
      year,
      month
    );

    console.log("loads_by_item", loads_by_item);

    setLoadsByShiftOfDay(sortedByShiftOfDay);
    console.log("sortedByShiftOfDay", sortedByShiftOfDay);
    const totals = CaclculateAllTeamsTotals(sortedByShiftOfDay);
    console.log("totals", totals);
    setAllTeamsTotals(totals);
    setYearTotal(CalculateYearTotal(loads_by_item));
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
        width: 100,
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
    const loads_array = Object.entries(loads)
      .flat(2)
      .filter((t) => typeof t !== "string");
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

    const {
      sacs: total_sacs,
      tonnage: total_t,
      camions: total_camions,
      dechires: total_dechires,
      bonus: total_bonus,
    } = totals.TOTAL;

    const total_label = "TOTAL";

    const def = {
      date: repeatChar(),
      shift: repeatChar(),
      equipe: total_label.toString(),
      sacs: total_sacs.toString(),
      T: total_t.toString(),
      camions: total_camions.toString(),
      dechires: total_dechires.toString(),
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
      columnStyles: {
        4: { cellWidth: "wrap" }, // Let column 2 auto-size based on content
      },
    };

    body.push(def);

    doc.text(formatFrenchDate(new Date()), 210 - 15, 10, { align: "right" });

    const doc_title = `RAPPORT CHARGEMENT, ${MONTHS[tm]} - ${ty}`;
    const file_name = `RAPPORT_CHARGEMENT_${MONTHS[tm]}_${ty}`;
    doc.text(doc_title, 105, 20, {
      align: "center",
    });

    doc.table(15, 25, body, headers, tableConfig);
    /* doc.autoTable({
      head: [["ID", "Name", "Description"]],
      body: [
        ["1", "Apple", "A small red fruit."],
        [
          "2",
          "Banana",
          "A yellow fruit that is longer and has a soft texture.",
        ],
        [
          "3",
          "Watermelon",
          "A very large fruit with a thick rind and lots of juicy red flesh inside. This description is purposely long to test auto-expansion.",
        ],
        ["4", "Grape", "Small and round fruit, often purple or green."],
      ],
      styles: { overflow: "linebreak" }, // Wrap if needed
      columnStyles: {
        1: { cellWidth: "wrap" }, // Let column 2 auto-size based on content
      },
      didDrawCell: function (data) {
        // Optional: custom logic per cell
      },
    }); */
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

    console.log("final data => ", final_data);

    const json_final_data = JSON.parse(final_data);
    console.log("json_final_data => ", json_final_data);
    return json_final_data;
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
                    onClick={(e) => setShowAllTeamsTotals(!showAllTeamsTotals)}
                    className={CLASS_BTN}
                  >
                    SHOW/HIDE TOTALS
                  </button>
                </div>
              </div>
              <div className="">
                {showAllTeamsTotals && (
                  <>
                    <div>
                      <ButtonPrint
                        title={"PRINT TOTAL"}
                        onClick={(e) =>
                          printTotalsTable(allTeamsTotals, date.y, date.m)
                        }
                      />
                    </div>

                    <TableLoadsTotals totalData={allTeamsTotals} date={date} />
                  </>
                )}
                {!showAllTeamsTotals && (
                  <>
                    <div className="flex gap-4">
                      {!showAllTeamsTotals && (
                        <>
                          <ButtonPrint
                            title={"PRINT"}
                            onClick={(e) =>
                              printLoadTabled(loadsByShiftOfDay, allTeamsTotals)
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
