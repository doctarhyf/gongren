import React, { useRef, useState } from "react";
import { MONTHS } from "../helpers/flow";
import DateSelector from "../comps/DateSelector";

export default function Chargement() {
  function onDateSelected(d) {
    console.log(d);
  }
  return (
    <div>
      <div>Chargement</div>
      <div>
        <DateSelector onDateSelected={onDateSelected} />
      </div>
    </div>
  );
}
