import { useEffect, useState } from "react";
import { MONTHS } from "../helpers/flow";
import ButtonPrint from "./ButtonPrint";
import Loading from "./Loading";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Excelexport from "./Excelexport";
const DAYS = ["D", "L", "M", "M", "J", "V", "S"];

export default function RoulementEquipes() {
  const [curmndays, setcurmndays] = useState(30);
  const [l, setl] = useState(false);
  const [dates, setdates] = useState(new Array(curmndays).fill(new Date()));
  const [y, sety] = useState(new Date().getFullYear());
  const [m, setm] = useState(new Date().getMonth());
  const SHIFTS = ["M", "N", "R"];
  const TEAMS = ["-", "A", "B", "C"];
  const [datastr, setdatastr] = useState(
    "AABBCCAABBCCAABBCCAABBCCAABBCC|CCAABBCCAABBCCAABBCCAABBCCAABB|BBCCAABBCCAABBCCAABBCCAABBCCAA"
  );
  const [edit, setedit] = useState(false);
  const [dataarr, setdataarr] = useState([[], [], []]);

  function str2arr(ttstr) {
    const d = ttstr.split("|");
    const dt = [];

    d.forEach((it, i) => dt.push(it.split("")));

    console.log(dt);
    return dt;
  }

  function arr2str(a) {
    const str = a.join("|").replaceAll(",", "");
    console.log("str");
    return str;
  }

  useEffect(() => {
    console.log("daarr => ", dataarr);
    console.log("str ", arr2str(dataarr));
  }, [dataarr]);

  useEffect(() => {
    setdataarr(str2arr(datastr));
  }, []);

  useEffect(() => {
    setedit(false);
    const d = new Date(y, m);
    const dayscount = new Date(y, m + 1, 0).getDate();
    setcurmndays(dayscount);

    const dates = [];
    new Array(dayscount).fill(0).forEach((it, i) => {
      let d = new Date(y, m, 21);
      //d.setMonth(d.getMonth() + 1);
      d.setDate(d.getDate() + i);
      dates.push(d);
      //console.log("i : ", i, " : ", d.toISOString(), " => ", d.getDay());
    });

    setdates(dates);
    defDates(y, m);
    loadData();
  }, [y, m]);

  function defDates(y, m) {
    const dayscount = new Date(y, m + 1, 0).getDate();
    const defdt = new Array(TEAMS.slice(-3).length)
      .fill(0)
      .map((it) => new Array(dayscount).fill("-"));
    setdataarr(defdt);
  }
  async function loadData() {
    setl(true);
    const code = `${y}-${m.toString().padStart(2, 0)}`;
    const d = await SB.LoadItemWithColNameEqColVal(
      TABLES_NAMES.TIME_TABLE,
      "code",
      code
    );

    if (!!d) {
      setdataarr(str2arr(d.tt));
    } else {
      defDates(y, m);
    }

    console.log("d => ", d);
    setl(false);
  }

  function onChange(val, r, c) {
    // console.log(val, r, c);

    const a = [...dataarr];
    a[r][c] = val;

    setdataarr(a);
  }

  async function onSave(arr, y, m) {
    setedit(false);
    const tt = arr2str(arr);
    const code = `${y}-${m.toString().padStart(2, 0)}`;

    setl(true);
    const r = await SB.UpsertItem(
      TABLES_NAMES.TIME_TABLE,
      { tt, code },
      "code"
    );

    console.log("res => ", r);
    setl(false);
  }

  function prepareExcel(a, y, m) {
    const arr = [...a];
    const dl = dates.map((it, i) => DAYS[it.getDay()]);
    const dt = dates.map((it, i) => it.getDate());

    arr.unshift(dt);
    arr.unshift(dl);
    console.log(arr);

    return arr;
  }

  return (
    <div>
      <div className=" text-3xl font-thin text-center p-4  ">
        ROULEMENT {MONTHS[m]}- {y}
      </div>
      <Loading isLoading={l} />

      <div className=" flex gap-2  ">
        <select value={y} onChange={(e) => sety(parseInt(e.target.value))}>
          {new Array(3).fill(0).map((it, i) => (
            <option value={new Date().getFullYear() + i}>
              {new Date().getFullYear() + i}
            </option>
          ))}
        </select>
        <select value={m} onChange={(e) => setm(parseInt(e.target.value))}>
          {new Array(12).fill(0).map((it, i) => (
            <option value={i}> {MONTHS[i]}</option>
          ))}
        </select>
        <div>Num days: {curmndays}</div>
      </div>

      <div>
        <input
          className=" checkbox  "
          type="checkbox"
          value={edit}
          onChange={(e) => setedit(e.target.checked)}
        />
        EDIT
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <td className=" table-cell p-1 border"></td>
              {dates.map((it, i) => (
                <td className=" table-cell p-1 border">{DAYS[it.getDay()]}</td>
              ))}
            </tr>
            <tr>
              <td className=" table-cell p-1 border"></td>
              {dates.map((it, i) => (
                <td className=" table-cell p-1 border">{it.getDate()}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataarr.map((row, irow) => (
              <tr>
                <td className=" table-cell p-1 border">{SHIFTS[irow]}</td>
                {row.map((col, icol) => (
                  <td className=" table-cell p-1 border">
                    {edit ? (
                      <select
                        onChange={(e) => onChange(e.target.value, irow, icol)}
                        value={dataarr[irow][icol]}
                      >
                        {TEAMS.map((teams, iteams) => (
                          <option
                            selected={teams === dataarr[irow][icol] || "-"}
                          >
                            {teams}
                          </option>
                        ))}
                      </select>
                    ) : (
                      col
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className=" my-2 flex justify-between ">
          <ButtonPrint onClick={(e) => onSave(dataarr, y, m)} title={"SAVE"} />

          <Excelexport excelData={prepareExcel(dataarr)} title={"PRINT"} />
        </div>
      </div>
    </div>
  );
}
