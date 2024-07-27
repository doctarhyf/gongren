import { useEffect, useState } from "react";
import DateSelector from "../DateSelector";
import { ParseDate } from "../../helpers/func";
import * as SB from "../../helpers/sb";
import { TABLES_NAMES } from "../../helpers/sb.config";
import { CLASS_TD } from "../../helpers/flow";

export default function ListBigbagTrucks() {
  const [dt, setdt] = useState(ParseDate(new Date(), false));
  const [ls, setls] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const d = await SB.LoadAllItems(TABLES_NAMES.BIGBAG);
    console.log(d);
    setls(d);
  }

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
      <div>LIST</div>
      <div>
        <table>
          <tr>
            <td className={CLASS_TD}>ID</td>
            <td className={CLASS_TD}>Equipe</td>
            <td className={CLASS_TD}>Plaque</td>
            <td className={CLASS_TD}>T</td>
            <td className={CLASS_TD}>Bags</td>
            <td className={CLASS_TD}>Date/Time</td>
            <td className={CLASS_TD}>Bon</td>
            <td className={CLASS_TD}>front</td>
            <td className={CLASS_TD}>side</td>
          </tr>
          {ls.map((l, i) => (
            <tr>
              <td className={CLASS_TD}>{l.id}</td>
              <td className={CLASS_TD}>{l.equipe}</td>
              <td className={CLASS_TD}>{l.plaque}</td>
              <td className={CLASS_TD}>{l.t}</td>
              <td className={CLASS_TD}>{l.bags}</td>
              <td className={CLASS_TD}>
                {l.date} a {l.time}
              </td>
              <td className={CLASS_TD}>
                <div className=" bg-slate-700 w-32 h-16 rounded-md overflow-hidden  ">
                  <a href={l.photos[0]}>
                    <img src={l.photos[0]} className=" cursor-pointer  " />
                  </a>
                </div>
              </td>
              <td className={CLASS_TD}>
                <div className=" bg-slate-700 w-32 h-16 rounded-md overflow-hidden  ">
                  <a href={l.photos[0]}>
                    <img src={l.photos[1]} className=" cursor-pointer  " />
                  </a>
                </div>
              </td>
              <td className={CLASS_TD}>
                <div className=" bg-slate-700 w-32 h-16 rounded-md overflow-hidden  ">
                  <a href={l.photos[0]}>
                    <img src={l.photos[2]} className=" cursor-pointer  " />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}
