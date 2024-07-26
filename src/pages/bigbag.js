import { useState } from "react";
import DateSelector from "../comps/DateSelector";
import TabCont from "../comps/TabCont";
import { BIGBAG_SECTIONS, CLASS_INPUT_TEXT, SECTIONS } from "../helpers/flow";
import FormNewBigbagTruck from "../comps/bigbag/FormNewBigbagTruck";
import ListBigbagTrucks from "../comps/bigbag/ListBigbagTrucks";

export function Bigbag() {
  const [curs, setcurs] = useState(Object.entries(BIGBAG_SECTIONS)[0]);

  function onSaveBibag(d) {
    console.log(d);
  }

  return (
    <div>
      <TabCont
        tabs={BIGBAG_SECTIONS}
        onSelectTab={(e) => setcurs(e)}
        selectedIndex={0}
      />
      {curs[0] === BIGBAG_SECTIONS.NEW.label && (
        <FormNewBigbagTruck onSaveBibag={onSaveBibag} />
      )}
      {curs[0] === BIGBAG_SECTIONS.BIGBAG.label && <ListBigbagTrucks />}
    </div>
  );
}
