import { useEffect, useState } from "react";
import * as SB from "../../helpers/sb";
import { TABLES_NAMES } from "../../helpers/sb.config";
import Loading from "../Loading";

export default function DaiziPandian() {
  const [trans, setTrans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await SB.LoadAllItems(TABLES_NAMES.PANDIAN);

    console.log("pd => ", data);
    if (data.length > 0) setTrans(data);

    setLoading(false);
  }

  return loading ? (
    <Loading isLoading={loading} />
  ) : (
    <div>
      <div>Pandian</div>
      {trans.length === 0 && <div>No data</div>}
      {trans.length > 0 && (
        <table>
          <tr>
            <td className=" p-2 border   ">Year-Month</td>
            <td className=" p-2 border   ">32.5N</td>
            <td className=" p-2 border   ">42.5N</td>
            <td className=" p-2 border   ">LOST 32.5N</td>
            <td className=" p-2 border   ">LOST 42.5N</td>
            <td className=" p-2 border   ">DATE-TIME</td>
          </tr>
          {trans.map((it) => (
            <tr>
              <td className=" p-2 border   ">{it.year_month}</td>
              <td className=" p-2 border   ">{it.s32}</td>
              <td className=" p-2 border   ">{it.s42}</td>
              <td className=" p-2 border   ">{it.lost32}</td>
              <td className=" p-2 border   ">{it.lost42}</td>
              <td className=" p-2 border   ">{it.date_time}</td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
}
