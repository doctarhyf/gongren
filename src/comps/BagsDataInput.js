import React, { useEffect, useRef, useState } from "react";
import Loading from "./Loading";
import {
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  CLASS_SELECT,
  CLASS_SELECT_TITLE,
  SHIFTS_ZH,
} from "../helpers/flow";
import {
  GetDatesPartsFromShiftCode,
  GetTodaysDateYMDObject,
  _,
} from "../helpers/func";
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
    d: new Date().getDate(),
  });
  const [showCalculator, setShowCalculator] = useState(false);
  const [tonnage, settonnage] = useState(0);

  function onDateSelected(d) {
    setdate(d);
    console.log(d);
  }

  useEffect(() => {
    if (dataToUpdate) {
      setdate(GetDatesPartsFromShiftCode(dataToUpdate.code));
    }
  }, []);

  async function onSaveLoad(upd) {
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
      console.log("updating ...");
      res = await SB.UpdateItem(
        TABLES_NAMES.LOADS,
        {
          ...load,
          id: dataToUpdate.id,
        },
        (s) => {
          onDataAdded(s);
          setloading(false);
        },
        (e) => {
          onError(e);
          setloading(false);
        }
      );
    } else {
      res = await SB.InsertItem(TABLES_NAMES.LOADS, load);

      console.log("ressss => ", res);
      if (res === null) {
        onDataAdded && onDataAdded();
        setloading(false);
      } else {
        onError && onError(`Error adding bags data`, JSON.stringify(res));
      }
      setloading(false);
    }

    setloading(false);
  }

  function onSaveTotalSacs(sacs, camions) {
    ref_sacs.current.value = sacs;
    ref_camions.current.value = camions;
    settonnage(Number(sacs) / 20);
    setShowCalculator(false);
  }

  const upd = dataToUpdate && JSON.parse(dataToUpdate.upd);

  return (
    <div className="">
      {dataToUpdate && (
        <div className="my-1">
          Updating ...
          <span className="p-1 rounded-full bg-green-600 text-white text-sm uppercase">
            {dataToUpdate.code}
          </span>{" "}
        </div>
      )}
      <div className={` ${showCalculator ? "hidden" : "block"} `}>
        <div className=" border mt-2 border-red-500 rounded-md">
          <div className="my-2 text-center text-sm ml-2 w-fit font-bold shadow-sm">
            Veuillez commencer par choisir la date
          </div>
          <div>
            <span className={CLASS_SELECT_TITLE}>DATE:</span>
            {dataToUpdate && upd.date}
            {dataToUpdate && " - " && <b>, New Date : </b>}
            {`${date.d}/${Number(date.m)}/${date.y}`}
          </div>

          <div className="border rounded-md p-1">
            <DateSelector
              onDateSelected={onDateSelected}
              hideSelectDateType={true}
              horizontal={true}
              defaultDate={
                (dataToUpdate &&
                  GetDatesPartsFromShiftCode(dataToUpdate.code)) ||
                GetTodaysDateYMDObject()
              }
            />
          </div>
        </div>

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
          <div>
            <span className={CLASS_SELECT_TITLE}>SACS:</span>
            <input
              className={CLASS_INPUT_TEXT}
              onChange={(e) =>
                settonnage(Number(Number(e.target.value) / 20).toFixed(2))
              }
              ref={ref_sacs}
              type="number"
              defaultValue={(upd && upd.sacs) || 0}
            />
          </div>
          <div>
            <span className={CLASS_SELECT_TITLE}>TONNAGE:</span>
            {tonnage} T.
          </div>
          <div className="md:flex">
            <div>
              <span className={CLASS_SELECT_TITLE}>CAMIONS:</span>
              <input
                type="number"
                className={CLASS_INPUT_TEXT}
                ref={ref_camions}
                defaultValue={(upd && upd.camions) || 0}
              />
            </div>

            <button
              className={CLASS_BTN}
              onClick={(e) => setShowCalculator(true)}
            >
              AFFICHER CALCULATEUR DE BONS
            </button>
          </div>
        </div>

        <div>
          <span className={CLASS_SELECT_TITLE}>SACS DECHIRES:</span>
          <input
            className={CLASS_INPUT_TEXT}
            ref={ref_dechires}
            type="number"
            defaultValue={(upd && upd.dechires) || 0}
          />
        </div>

        <div>
          <span className={CLASS_SELECT_TITLE}>RETOURS:</span>
          <input
            className={CLASS_INPUT_TEXT}
            ref={ref_retours}
            type="number"
            defaultValue={(upd && upd.retours) || 0}
          />
        </div>
        <div>
          <span className={CLASS_SELECT_TITLE}>AJOUTS:</span>
          <input
            className={CLASS_INPUT_TEXT}
            ref={ref_ajouts}
            type="number"
            defaultValue={(upd && upd.ajouts) || 0}
          />
        </div>

        <div className="flex">
          <button
            onClick={(e) => onSaveLoad(dataToUpdate)}
            className={CLASS_BTN}
          >
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
