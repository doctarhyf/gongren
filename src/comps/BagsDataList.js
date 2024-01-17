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
  const [selectedLoad, setSelectedLoad] = useState(undefined);

  function onDateSelected(new_date) {
    console.log(new_date);
    setdate(new_date);
    setloadsf([]);
    setSelectedLoad(undefined);
    const [y, m, d, t] = Object.values(new_date);
    const date_code = `${y}_${m}_${d}`;

    console.log("date_code", date_code);

    const loads_filtered = loads.filter((it, i) => {
      const { code } = it;

      const [equipe, shift, y, m, d] = code.split("_");
      const cur_date_code = `${y}_${m}_${d}`;
      return cur_date_code, date_code === cur_date_code;
    });

    console.log(loads_filtered);
    setloadsf(loads_filtered);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const d = await SB.LoadAllItems(TABLES_NAMES.LOADS);
    console.log(d);
    setloads(d);
  }

  return (
    <div>
      <DateSelector onDateSelected={onDateSelected} />

      <div className="flex border rounded-md">
        <div>
          {loadsf.map((ld, i) => (
            <div
              key={i}
              onClick={(e) => setSelectedLoad(ld)}
              className={CLASS_BTN}
            >
              {ld.code}
            </div>
          ))}
        </div>

        {selectedLoad && (
          <div>
            {[
              ...Object.entries(selectedLoad),
              ["Tonnage", Object.entries(selectedLoad)[2][1] / 20 + "T"],
            ].map((dt, i) => (
              <div key={i}>
                {dt[0]} : {dt[1]}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
