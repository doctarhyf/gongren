import React, { useEffect, useState } from "react";
import useDataLoader from "../hooks/useDataLoader";
import { TABLES_NAMES } from "../helpers/sb.config";

export default function Sacs() {
  const [records, loading, error] = useDataLoader(TABLES_NAMES.SACS);

  return (
    <div>
      <div>Gerance sacs</div>
      <div>{loading && "loading ..."}</div>
      <div>{records && records.length > 0 && JSON.stringify(records)}</div>
      <div>{error && JSON.stringify(error)}</div>
    </div>
  );
}
