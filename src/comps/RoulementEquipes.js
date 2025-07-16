import { useEffect, useState } from "react";
import { getFrenchDayName, MONTHS } from "../helpers/flow";
import { getDayName } from "../helpers/funcs_print";

const DAYS = ["D", "L", "M", "M", "J", "V", "S"];

export default function RoulementEquipes() {
  const [curmndays, setcurmndays] = useState(30);

  const [dates, setdates] = useState(new Array(curmndays).fill(new Date()));
  const [y, sety] = useState(new Date().getFullYear());
  const [m, setm] = useState(new Date().getMonth());
  const SHIFTS = ["M", "N", "R"];
  const TEAMS = ["A", "B", "C"];
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
    const d = new Date(y, m);
    const dayscount = new Date(y, m + 1, 0).getDate();
    setcurmndays(dayscount);

    const dates = [];
    new Array(dayscount).fill(0).forEach((it, i) => {
      let d = new Date(y, m, 21);
      //d.setMonth(d.getMonth() + 1);
      d.setDate(d.getDate() + i);
      dates.push(d);
      console.log("i : ", i, " : ", d.toISOString(), " => ", d.getDay());
    });

    setdates(dates);

    console.log("cur date => ", d);
    console.log("days => ", dayscount);
  }, [y, m]);

  function onch(val, r, c) {
    console.log(val, r, c);
    const a = [...dataarr];
    a[r][c] = val;

    setdataarr(a);
  }

  return (
    <div>
      <div className=" text-3xl font-thin text-center p-4  ">
        Roulement {MONTHS[m]}- {y}
      </div>

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
              {new Array(curmndays).fill(0).map((it, i) => (
                <td className=" table-cell p-1 border">{i + 1}</td>
              ))}
            </tr>
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
                        onChange={(e) => onch(e.target.value, irow, icol)}
                        value={dataarr[irow][icol]}
                      >
                        {TEAMS.map((teams, iteams) => (
                          <option selected={teams === dataarr[irow][icol]}>
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
      </div>
    </div>
  );
}
