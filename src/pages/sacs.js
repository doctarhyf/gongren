import { useEffect, useState } from "react";
import { formatDateForDatetimeLocal } from "../helpers/func";
import { v4 as uuidv4 } from "uuid";

const HEADERS = [
  "id",
  "team",
  "date",
  "sortis32",
  "prod32",
  "sortis42",
  "prod42",
  "dech32",
  "dech42",
  "ut32",
  "ut42",
  "res32",
  "res42",
  "ben",
  "gest",
  "act",
  "key",
];

const def = {
  team: "A",
  date_time: new Date().toISOString(),
  sortis32: 0,
  sortis42: 0,
  ut32: 0,
  ut42: 0,
  dech32: 0,
  dech42: 0,
  gest: "tan",
  key: uuidv4(),
};

const TEST_TRANS = [
  {
    team: "A",
    date_time: "2025-07-14T00:52:10.000Z",
    sortis32: 0,
    sortis42: 10000,
    ut32: 0,
    ut42: 12235,
    dech32: 0,
    dech42: 92,
    gest: "tan",
    key: "5f725a08-09a0-4ac6-b55b-12494cbd3380",
    ts: 1752454330000,
    res32: 0,
    res42: 0,
  },
  {
    team: "C",
    date_time: "2025-07-14T00:52:41.000Z",
    sortis32: 0,
    sortis42: 16500,
    ut32: 0,
    ut42: 16150,
    dech32: 0,
    dech42: 45,
    gest: "tan",
    key: "88d3bd03-d2a7-4063-98fa-85e0498507b1",
    ts: 1752454361000,
    res32: 0,
    res42: 9908,
  },
  {
    team: "B",
    date_time: "2025-07-15T00:53:04.000Z",
    sortis32: 800,
    sortis42: 15500,
    ut32: 0,
    ut42: 16995,
    dech32: 0,
    dech42: 60,
    gest: "tan",
    key: "a7850ce9-1f6d-4f4c-a2fc-16703ab72f94",
    ts: 1752540784000,
    res32: 0,
    res42: 16455,
  },
  {
    team: "A",
    date_time: "2025-07-15T00:53:48.000Z",
    sortis32: 0,
    sortis42: 22375,
    ut32: 0,
    ut42: 21545,
    dech32: 0,
    dech42: 92,
    gest: "tan",
    key: "306133ae-0b3a-4c56-90aa-1c0ff41b0441",
    ts: 1752540828000,
    res32: 800,
    res42: 15440,
  },
  {
    team: "B",
    date_time: "2025-07-16T00:54:28.000Z",
    sortis32: 0,
    sortis42: 13500,
    ut32: 0,
    ut42: 13745,
    dech32: 0,
    dech42: 72,
    gest: "tan",
    key: "c8644150-241b-4dc8-aa3e-5683c757adc2",
    ts: 1752627268000,
    res32: 0,
    res42: 22283,
  },
];

const TROUVE_32 = 0,
  TROUVE_42 = 2795;

function Container() {
  const [insert, setinsert] = useState(false);
  const [trans, settrans] = useState([...TEST_TRANS]);
  // const [transfinal, settransfinal] = useState([]);
  const [newt, setnewt] = useState(def);

  useEffect(() => {
    calculateTrans(trans);
  }, []);

  function calculateTrans(trans) {
    /*  trans = trans.map((it) => ({
      ...it,
      ts: new Date(it.date_time).getTime(),
    }));

    trans.sort((a, b) => a.ts - b.ts); */

    let finaltrans = [];
    trans.forEach((it, i) => {
      const fel = i === 0;
      const lel = i === trans.length - 1;
      const curel = { ...it };
      const prevel = fel ? undefined : trans[i - 1];
      const nextel = lel ? undefined : trans[i + 1];

      /*
{
    "team": "A",
    "date_time": "2025-07-17T00:31:40.547Z",
    "sortis32": 0,
    "sortis42": 0,
    "ut32": 0,
    "ut42": 0,
    "dech32": 0,
    "dech42": 0,
    "gest": "tan",
    "key": "64871a08-1925-4f60-862b-0b6c5b365bd6"
}

      */

      const finalit = { ...curel };

      //if its the first element
      if (fel) {
        finalit.res32 = TROUVE_32;
        finalit.res42 = TROUVE_42;
      } else {
        finalit.res32 =
          prevel.res32 + finalit.sortis32 - finalit.ut32 - finalit.dech32;
        finalit.res42 =
          prevel.res42 + finalit.sortis42 - finalit.ut42 - finalit.dech42;
      }

      finalit.prod32 = finalit.ut32 / 20;
      finalit.prod42 = finalit.ut42 / 20;
      finaltrans.push(finalit);
    });

    console.log("fintrans\n", finaltrans);
    settrans(finaltrans);
  }

  function onInsertTrans() {
    console.log("ntrans \n", newt);
    let updatedTrans = [...trans];

    const nt = { ...newt, key: uuidv4() };
    nt.date_time = new Date(nt.date_time).toISOString();
    updatedTrans.push(nt);

    //////
    updatedTrans = updatedTrans.map((it) => ({
      ...it,
      ts: new Date(it.date_time).getTime(),
    }));

    updatedTrans.sort((a, b) => a.ts - b.ts);

    calculateTrans(updatedTrans);
    setnewt(def);
  }

  function onCancel() {}

  function onRemove(it) {
    const t = trans.filter((curel) => curel.key !== it.key);
    calculateTrans(t);
  }

  return (
    <div className="container">
      <div>CONTAINER</div>

      <button onClick={(e) => setinsert(true)}>INSERT</button>
      {/* <button onClick={(e) => calculateTrans()}>RECALCULATE</button> */}

      <div className=" overflow-auto ">
        <table>
          <thead>
            <tr>
              {HEADERS.map((it) => (
                <td className="p-1 border">{it}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {trans.map((r, i) => (
              <tr>
                <td className="p-1 border table-cell">{i + 1}</td>
                <td className="p-1 border table-cell">{r.team}</td>
                <td className="p-1 border table-cell">
                  {" "}
                  {formatDateForDatetimeLocal(r.date_time)}
                </td>
                <td className="p-1 border table-cell">{r.sortis32}</td>
                <td className="p-1 border table-cell">{r.prod32}</td>
                <td className="p-1 border table-cell">{r.sortis42}</td>
                <td className="p-1 border table-cell"> {r.prod42}</td>
                <td className="p-1 border table-cell">{r.dech32}</td>
                <td className="p-1 border table-cell">{r.dech42}</td>
                <td className="p-1 border table-cell">{r.ut32}</td>
                <td className="p-1 border table-cell">{r.ut42}</td>
                <td className="p-1 border table-cell">{r.res32}</td>
                <td className="p-1 border table-cell">{r.res42}</td>
                <td className="p-1 border table-cell">{}</td>
                <td className="p-1 border table-cell">{r.gest}</td>
                <td className="p-1 border table-cell">
                  <button onClick={(e) => onRemove(r)}>DEL</button>
                </td>
                <td className="p-1 border table-cell">{r.key}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className=" bg-black flex gap-2 flex-col ">
        <div>FORM INPUT</div>
        <div>
          <span>team</span>
          <select
            value={newt.team}
            onChange={(e) =>
              setnewt((old) => ({
                ...old,
                team: e.target.value,
              }))
            }
          >
            {["A", "B", "C"].map((it) => (
              <option value={it}>{it}</option>
            ))}
          </select>
        </div>
        <div>
          <span>date-time</span>
          <input
            defaultValue={formatDateForDatetimeLocal(new Date())}
            value={newt.date_time}
            onChange={(e) =>
              setnewt((old) => ({
                ...old,
                date_time: e.target.value,
              }))
            }
            step="1"
            type="datetime-local"
          />
        </div>
        <div>
          <span>sortis32</span>
          <input
            value={newt.sortis32}
            onChange={(e) =>
              setnewt((old) => ({
                ...old,
                sortis32: parseInt(e.target.value),
              }))
            }
            step="1"
            oninput="this.value = this.value.replace(/[^0-9]/g, '')"
            type="number"
          />
        </div>
        <div>
          <span>sortis42</span>
          <input
            value={newt.sortis42}
            onChange={(e) =>
              setnewt((old) => ({
                ...old,
                sortis42: parseInt(e.target.value),
              }))
            }
            step="1"
            oninput="this.value = this.value.replace(/[^0-9]/g, '')"
            type="number"
          />
        </div>

        <div>
          <span>dech32</span>
          <input
            value={newt.dech32}
            onChange={(e) =>
              setnewt((old) => ({
                ...old,
                dech32: parseInt(e.target.value),
              }))
            }
            step="1"
            oninput="this.value = this.value.replace(/[^0-9]/g, '')"
            type="number"
          />
        </div>
        <div>
          <span>dech42</span>
          <input
            value={newt.dech42}
            onChange={(e) =>
              setnewt((old) => ({
                ...old,
                dech42: parseInt(e.target.value),
              }))
            }
            step="1"
            oninput="this.value = this.value.replace(/[^0-9]/g, '')"
            type="number"
          />
        </div>

        <div>
          <span>ut32</span>
          <input
            value={newt.ut32}
            onChange={(e) =>
              setnewt((old) => ({
                ...old,
                ut32: parseInt(e.target.value),
              }))
            }
            step="1"
            oninput="this.value = this.value.replace(/[^0-9]/g, '')"
            type="number"
          />
        </div>
        <div>
          <span>ut42</span>
          <input
            value={newt.ut42}
            onChange={(e) =>
              setnewt((old) => ({
                ...old,
                ut42: parseInt(e.target.value),
              }))
            }
            step="1"
            oninput="this.value = this.value.replace(/[^0-9]/g, '')"
            type="number"
          />
        </div>

        <div>
          <span>team</span>
          <select
            value={newt.gest}
            onChange={(e) =>
              setnewt((old) => ({
                ...old,
                gest: e.target.value,
              }))
            }
          >
            {["tan", "zhao", "wang gang"].map((it) => (
              <option value={it}>{it}</option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={onInsertTrans}>SAVE</button>
          <button onClick={onCancel}>CANCEL</button>
        </div>
      </div>
    </div>
  );
}

export default function Sacs() {
  return (
    <div>
      <div>Sacs</div>
      <div>
        <Container />
      </div>
    </div>
  );
}
