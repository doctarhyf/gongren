import React, { useEffect, useRef, useState } from "react";
import { MONTHS } from "../helpers/flow";
import DateSelector from "../comps/DateSelector";
import Loading from "../comps/Loading";
import BagsDataInput from "../comps/BagsDataInput";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import BagsDataList from "../comps/BagsDataList";

export default function Chargement() {
  const [date, setdate] = useState({});

  const [addDataMode, setAddDataMode] = useState(false);

  return (
    <div>
      <div>
        ADD DATA
        <input
          type="checkbox"
          className="toggle toggle-xs"
          checked={addDataMode}
          onChange={(e) => setAddDataMode(e.target.checked)}
        />
      </div>

      {addDataMode && <BagsDataInput date={date} />}

      {!addDataMode && <BagsDataList />}
    </div>
  );
}
