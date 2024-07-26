import { useState } from "react";
import DateSelector from "../DateSelector";
import { ParseDate } from "../../helpers/func";

export default function ListBigbagTrucks() {
  const [dt, setdt] = useState(ParseDate(new Date(), false));

  function onDateSelected(d) {
    setdt(d);
  }

  return (
    <div className=" container  ">
      <div>
        <DateSelector
          defaultDate={new Date()}
          hideSelectDateType
          onDateSelected={onDateSelected}
        />
      </div>
      <div>LIST / {JSON.stringify(dt)}</div>
    </div>
  );
}
