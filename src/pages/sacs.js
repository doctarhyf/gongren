import React, { useEffect, useState } from "react";
import useDataLoader from "../hooks/useDataLoader";
import { TABLES_NAMES } from "../helpers/sb.config";
import { CLASS_BTN, CLASS_TD } from "../helpers/flow";

export default function Sacs() {
  const [records, loading, error] = useDataLoader(TABLES_NAMES.SACS);

  return (
    <div>
      <div>Gerance sacs</div>
      <div>{loading && "loading ..."}</div>
      <div>
        {records && records.length > 0 && (
          <table>
            <tr>
              {Object.keys(records[0]).map((it, i) => (
                <td className={CLASS_TD}>{it}</td>
              ))}
            </tr>
            {Object.values(records).map((it, i) => (
              <tr>
                {Object.values(it).map((v, i) => (
                  <td className={CLASS_TD}>{v}</td>
                ))}
              </tr>
            ))}
          </table>
        )}
      </div>
      <div>{error && JSON.stringify(error)}</div>
    </div>
  );
}
