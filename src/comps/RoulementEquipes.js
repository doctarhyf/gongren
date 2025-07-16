import { useEffect, useState } from "react";

export default function RoulementEquipes() {
  const [numDays, setNumDays] = useState(30);
  const [daysl, setdaysl] = useState(new Array(numDays).fill("L"));
  const [dates, setdates] = useState(new Array(numDays).fill(0));
  const SHIFTS = ["M", "N", "R"];
  const TEAMS = ["A", "B", "C"];
  const [datastr, setdatastr] = useState(
    "AABBCCAABBCCAABBCCAABBCCAABBCC|CCAABBCCAABBCCAABBCCAABBCCAABB|BBCCAABBCCAABBCCAABBCCAABBCCAA"
  );
  const [edit, setedit] = useState(true);
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

  function onch(val, r, c) {
    console.log(val, r, c);
    const a = [...dataarr];
    a[r][c] = val;

    setdataarr(a);
  }

  return (
    <div>
      <div>Roulement</div>

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
              {daysl.map((it, i) => (
                <td className=" table-cell p-1 border">{it}</td>
              ))}
            </tr>
            <tr>
              <td className=" table-cell p-1 border"></td>
              {dates.map((it, i) => (
                <td className=" table-cell p-1 border">{it}</td>
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
            {/*  {SHIFTS.map((sh, ish) => (
              <tr>
                <td className=" table-cell p-1 border">{sh}</td>
                {dates.map((it, i) => (
                  <td className=" table-cell p-1 border">
                    <select>
                      {TEAMS.map((t, it) => (
                        <option>{t}</option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
