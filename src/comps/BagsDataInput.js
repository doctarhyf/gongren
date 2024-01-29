import React, { useRef, useState } from "react";
import Loading from "./Loading";
import {
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  CLASS_SELECT,
  CLASS_SELECT_TITLE,
  SHIFTS_ZH,
} from "../helpers/flow";
import { _ } from "../helpers/func";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import DateSelector from "./DateSelector";
import LoadsCalculator from "./LoadCalculator";

export default function BagsDataInput({
  onDataAdded,
  onCancel,
  onError,
  dataToUpdate,
}) {
  const [loading, setloading] = useState(false);
  const ref_team = useRef();
  const ref_shift = useRef();
  const ref_sacs = useRef();
  const ref_camions = useRef();
  const ref_retours = useRef();
  const ref_ajouts = useRef();
  const ref_dechires = useRef();

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
    const dechires = Number(_(ref_dechires));

    const code = `${team}_${shift}_${date.y}_${date.m}_${date.d}`;
    const load = {
      code: code,
      sacs: sacs,
      camions: camions,
      retours: retours,
      ajouts: ajouts,
      dechires: dechires,
    };

    let res;
    if (dataToUpdate) {
      /* console.log(
        `will update \nid : ${dataToUpdate.id}\nupd data : `,
        load,
        "\nold data ",
        dataToUpdate
      ); */
      res = await SB.UpdateItem(TABLES_NAMES.LOADS, {
        ...load,
        id: dataToUpdate.id,
      });
    } else {
      /* console.log("will save new data", load); */
      res = await SB.InsertItem(TABLES_NAMES.LOADS, load);
    }

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

  /* const upd = {
    shift: shift.code[0], //SHIF_HOURS_ZH[shift.code[0]][1],
    sacs: shift.sacs,
    camions: shift.camions,
    retours: shift.retours,
    ajouts: shift.ajouts,
    dechires: shift.dechires,
  };*/

  const upd = dataToUpdate && JSON.parse(dataToUpdate.upd);

  console.log("upd => ", upd);

  return (
    <div className="flex flex-row-reverse">
      <DateSelector onDateSelected={onDateSelected} />

      <div className={` ${showCalculator ? "hidden" : "block"} `}>
        <div>
          <span className={CLASS_SELECT_TITLE}>Team:</span>
          <select className={CLASS_SELECT} ref={ref_team}>
            {["A", "B", "C", "D"].map((t, i) => (
              <option selected={upd && t === upd.team}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <span className={CLASS_SELECT_TITLE}>SHIFT:</span>
          <select className={CLASS_SELECT} ref={ref_shift}>
            {["M", "P", "N"].map((t, i) => (
              <option selected={upd && t === upd.shift}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <span className={CLASS_SELECT_TITLE}>DATE:</span>

          {(upd && upd.date) || `${date.d}/${Number(date.m) + 1}/${date.y}`}
        </div>
        <div>
          <div>
            <span className={CLASS_SELECT_TITLE}>SACS:</span>
            <input
              className={CLASS_INPUT_TEXT}
              ref={ref_sacs}
              type="text"
              defaultValue={(upd && upd.sacs) || 0}
            />
          </div>
          <div>
            <span className={CLASS_SELECT_TITLE}>CAMIONS:</span>
            <input
              className={CLASS_INPUT_TEXT}
              ref={ref_camions}
              type="text"
              defaultValue={(upd && upd.camions) || 0}
            />
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
          <span className={CLASS_SELECT_TITLE}>RETOURS:</span>
          <input
            className={CLASS_INPUT_TEXT}
            ref={ref_retours}
            type="text"
            defaultValue={(upd && upd.retours) || 0}
          />
        </div>
        <div>
          <span className={CLASS_SELECT_TITLE}>AJOUTS:</span>
          <input
            className={CLASS_INPUT_TEXT}
            ref={ref_ajouts}
            type="text"
            defaultValue={(upd && upd.ajouts) || 0}
          />
        </div>
        <div>
          <span className={CLASS_SELECT_TITLE}>DECHIRES:</span>
          <input
            className={CLASS_INPUT_TEXT}
            ref={ref_dechires}
            type="text"
            defaultValue={(upd && upd.dechires) || 0}
          />
        </div>
        <div className="flex">
          <button onClick={onSaveLoad} className={CLASS_BTN}>
            SAVE
          </button>
          <button onClick={onCancel} className={CLASS_BTN}>
            CANCEL
          </button>
        </div>
        <Loading isLoading={loading} />
      </div>

      <LoadsCalculator
        onCancel={(e) => setShowCalculator(false)}
        show={showCalculator}
        onSaveTotalSacs={onSaveTotalSacs}
      />
    </div>
  );
}
