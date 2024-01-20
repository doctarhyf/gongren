import React, { useRef, useState } from "react";
import Loading from "./Loading";
import { CLASS_BTN } from "../helpers/flow";
import { _ } from "../helpers/func";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import DateSelector from "./DateSelector";
import LoadsCalculator from "./LoadCalculator";

export default function BagsDataInput({ onDataAdded, onError }) {
  const [loading, setloading] = useState(false);
  const ref_team = useRef();
  const ref_shift = useRef();
  const ref_sacs = useRef();
  const ref_camions = useRef();
  const ref_retours = useRef();
  const ref_ajouts = useRef();
  const [date, setdate] = useState({
    y: new Date().getFullYear(),
    m: new Date().getMonth(),
    d: new Date().getDay(),
  });
  const [showCalculator, setShowCalculator] = useState(false);

  function onDateSelected(d) {
    setdate(d);
  }

  async function onSaveLoad() {
    setloading(true);
    const team = _(ref_team);

    const shift = _(ref_shift);
    const sacs = Number(_(ref_sacs));
    const camions = Number(_(ref_camions));
    const retours = Number(_(ref_retours));
    const ajouts = Number(_(ref_ajouts));
    const code = `${team}_${shift}_${date.y}_${date.m}_${date.d}`;
    const load = {
      code: code,
      sacs: sacs,
      camions: camions,
      retours: retours,
      ajouts: ajouts,
    };

    let res = await SB.InsertItem(TABLES_NAMES.LOADS, load);

    if (res === null) {
      alert("Data added succssefully!");
      onDataAdded && onDataAdded(load);
    } else {
      const err = JSON.stringify(res);
      alert(err);
      onError && onError(err);
    }
    console.log(res);
    setloading(false);
  }

  function onSaveTotalSacs(sacs, camions) {
    console.log(`Sacs: ${sacs} sacs, ${sacs / 20} tons`);
    ref_sacs.current.value = sacs;
    ref_camions.current.value = camions;
    setShowCalculator(false);
  }

  return (
    <div className="flex flex-row-reverse">
      <DateSelector onDateSelected={onDateSelected} />

      <div className={` ${showCalculator ? "hidden" : "block"} `}>
        <div>
          Team:
          <select ref={ref_team}>
            {["A", "B", "C", "D"].map((t, i) => (
              <option>{t}</option>
            ))}
          </select>
        </div>
        <div>
          SHIFT:
          <select ref={ref_shift}>
            {["白班", "中班", "夜班"].map((t, i) => (
              <option value={["M", "P", "N"][i]}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          DATE: {date.d}/{date.m}/{date.y}
        </div>
        <div className="border rounded-md ">
          <div>
            SACS: <input ref={ref_sacs} type="text" />
          </div>
          <div>
            CAMIONS: <input ref={ref_camions} type="text" />
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">AFFICHER CALCULATEUR DE BONS</span>
              <input
                type="checkbox"
                onChange={(e) => setShowCalculator(e.target.checked)}
                className="toggle"
                checked={showCalculator}
              />
            </label>
          </div>
        </div>

        <div>
          RETOURS: <input ref={ref_retours} type="text" />
        </div>
        <div>
          AJOUTS: <input ref={ref_ajouts} type="text" />
        </div>
        <div>
          <button onClick={onSaveLoad} className={CLASS_BTN}>
            SAVE
          </button>
        </div>
        <Loading isLoading={loading} />
      </div>

      <LoadsCalculator
        show={showCalculator}
        onSaveTotalSacs={onSaveTotalSacs}
      />
    </div>
  );
}
