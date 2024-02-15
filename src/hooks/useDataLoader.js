import { useEffect, useState } from "react";
import * as SB from "../helpers/sb";

const useDataLoader = (tableName) => {
  const [items, setItems] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();

  useEffect(() => {
    setloading(true);
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
      }
    );
  }, [tableName]);

  return [items, loading, error];
};

export default useDataLoader;
