import { useState } from "react";
import Bon from "./Bon";
import { CLASS_BTN } from "../helpers/flow";

export default function LoadsCalculator({
  show,
  onAddCamion,
  onSaveTotalSacs,
}) {
  const [camions, setcamions] = useState([0]);

  function onSacsChange(id, sacs) {
    const nb_sacs = Number(sacs) || 0;
    let old = camions;
    old[id] = nb_sacs;

    const new_array = [...old];
    setcamions(new_array);
    console.log(new_array);
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
      <div className="text-sky-500 border-b my-1">Calculator</div>
      <div>Camions : {camions.length}</div>
      <div>
        Sacs Total:{" "}
        {camions.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        )}{" "}
        Sacs
      </div>
      <div>
        Tonnage Total:{" "}
        {camions.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        ) / 20}{" "}
        T
      </div>
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
      <div>
        <button
          onClick={(e) => {
            setcamions((old) => [...old, 0]);
            console.log(camions);
          }}
          className={CLASS_BTN}
        >
          Ajouter bon
        </button>
        <button
          onClick={(e) => {
            setcamions([0]);
          }}
          className={CLASS_BTN}
        >
          Clear
        </button>
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
          className={CLASS_BTN}
        >
          Save
        </button>
      </div>
    </div>
  );
}
