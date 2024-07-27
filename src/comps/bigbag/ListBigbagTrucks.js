import { useEffect, useState } from "react";
import DateSelector from "../DateSelector";
import { ParseDate } from "../../helpers/func";
import * as SB from "../../helpers/sb";
import { TABLES_NAMES } from "../../helpers/sb.config";

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
            <td>ID</td>
            <td>Equipe</td>
            <td>Plaque</td>
            <td>T</td>
            <td>Bags</td>
            <td>Date/Time</td>
            <td>Bon</td>
            <td>front</td>
            <td>side</td>
          </tr>
          {ls.map((l, i) => (
            <tr>
              <td>{l.id}</td>
              <td>{l.equipe}</td>
              <td>{l.plaque}</td>
              <td>{l.t}</td>
              <td>{l.bags}</td>
              <td>
                {l.date} a {l.time}
              </td>
              <td>
                <div className=" bg-slate-700 w-32 h-16 rounded-md overflow-hidden  ">
                  <a href={l.photos[0]}>
                    <img src={l.photos[0]} className=" cursor-pointer  " />
                  </a>
                </div>
              </td>
              <td>
                <div className=" bg-slate-700 w-32 h-16 rounded-md overflow-hidden  ">
                  <a href={l.photos[0]}>
                    <img src={l.photos[1]} className=" cursor-pointer  " />
                  </a>
                </div>
              </td>
              <td>
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
