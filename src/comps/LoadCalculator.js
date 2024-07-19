import { useState } from "react";
import Bon from "./Bon";
import { CLASS_BTN } from "../helpers/flow";

export default function LoadsCalculator({
  show,
  onAddCamion,
  onSaveTotalSacs,
  onCancel,
  showTitle = true,
  showSaveBtn = true,
}) {
  const [camions, setcamions] = useState([0]);
  const [data, setdata] = useState({ count: 0, sacs: 0, t: 0 });

  function onSacsChange(id, sacs) {
    const nb_sacs = Number(sacs) || 0;
    let old = camions;
    old[id] = nb_sacs;

    const new_array = [...old];
    setcamions(new_array);

    const _data = {
      count: camions.length,
      sacs: camions.reduce((acc, cv) => acc + cv, 0),
      t: (camions.reduce((acc, cv) => acc + cv, 0) / 20).toFixed(2),
    };
    setdata(_data);

    console.log(_data);
  }

  function onRemoveBon(index) {
    let array = camions;

    if (index >= 0 && index < array.length) {
      array.splice(index, 1);
    }
    const new_array = [...array];
    setcamions(new_array);
    console.log(new_array);
  }

  return (
    <div className={` ${show ? "block" : "hidden"} `}>
      {showTitle && (
        <div className="text-sky-500 border-b my-1">Calculator</div>
      )}

      <div className="  bg-black text-white rounded-md p-1 text-center  text-sm my-1 ">{`${data.count} camions, ${data.sacs} sacs, ${data.t} T. `}</div>

      <div>
        {camions.map((sacs, i) => (
          <Bon
            id={i}
            sacs={sacs}
            onSacsChange={onSacsChange}
            onRemoveBon={onRemoveBon}
          />
        ))}
      </div>

      <div className=" flex gap-2 my-2  shadow-md py-2 ">
        <button
          onClick={(e) => {
            setcamions((old) => [...old, 0]);
            console.log(camions);
          }}
          className={
            " text-xs bg-white/20 hover:bg-white/10 rounded-md px-2 p-1  "
          }
        >
          AJOUT CAMION
        </button>
        <button
          onClick={(e) => {
            setcamions([0]);
          }}
          className={
            " text-xs bg-white/20 hover:bg-white/10 rounded-md px-2 p-1  "
          }
        >
          REFAIRE
        </button>
        {showSaveBtn && (
          <button
            onClick={(e) => {
              onSaveTotalSacs &&
                onSaveTotalSacs(
                  camions.reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0
                  ),
                  camions.length
                );
            }}
            className={""}
          >
            Save
          </button>
        )}
        <button
          className={
            " text-xs bg-red-800 hover:bg-red-800/50 text-white rounded-md px-2 p-1  "
          }
          onClick={(e) => onCancel && onCancel()}
        >
          ANNULER
        </button>
      </div>

      <div className="  mt-2 border-t border-white/20 ">
        <div>
          {" "}
          <span className={" opacity-50 "}> Nbr. Camions: </span>{" "}
          <b> {camions.length}</b>
        </div>
        <div>
          <span className={" opacity-50"}> Total Sacs: </span>
          <b>
            {camions.reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0
            )}{" "}
            Sacs
          </b>
        </div>
        <div>
          <span className={" opacity-50"}>Tonnage Total: </span>
          <b>
            {camions.reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0
            ) / 20}{" "}
            T
          </b>
        </div>
      </div>
    </div>
  );
}
