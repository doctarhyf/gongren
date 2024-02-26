import { useEffect, useState } from "react";
import * as SB from "../helpers/sb";

const useDataLoader = (tableName, columns) => {
  const [items, setItems] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();
  const [id, setid] = useState();

  useEffect(() => {
    setloading(true);
    setItems([]);
    SB.LoadAllItems2(
      tableName,
      (data) => {
        setItems(data);
        seterror(undefined);
        setloading(false);
      },
      (e) => {
        setItems([]);
        seterror(e);
        setloading(false);
      },
      columns
    );
  }, [tableName, id]);

  function reload() {
    setid(Math.random());
  }

  return [items, loading, error, reload];
};

export default useDataLoader;
