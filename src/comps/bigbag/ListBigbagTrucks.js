import { useEffect, useState } from "react";
import DateSelector from "../DateSelector";
import { AddLeadingZero, dt2YYYYmmdd, ParseDate } from "../../helpers/func";
import * as SB from "../../helpers/sb";
import { TABLES_NAMES } from "../../helpers/sb.config";
import { CLASS_TD } from "../../helpers/flow";
import Loading from "../Loading";

export default function ListBigbagTrucks() {
  const [dt, setdt] = useState(ParseDate(new Date(), false));
  const [trucks, settrucks] = useState([]);
  const [trucksf, settrucksf] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const ftrucks = trucks.filter((t) => t.date === dt2YYYYmmdd(dt));
    settrucksf(ftrucks);
  }, [dt]);

  async function loadData() {
    setloading(true);
    const d = await SB.LoadAllItems(TABLES_NAMES.BIGBAG);
    settrucks(d);

    const filter_date = dt2YYYYmmdd(dt);
    const df = d.filter((t) => t.date === filter_date);
    settrucksf(df);

    setloading(false);
  }

  function onDateSelected(d) {
    setdt(d);
  }

  function onTruckClick(truck) {
    console.log(truck);
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
        {loading ? (
          <Loading isLoading={true} />
        ) : (
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
            {trucksf.map((truck, i) => (
              <tr
                key={truck.created_at}
                className=" hover:bg-slate-500 cursor-pointer   "
                onClick={onTruckClick(truck)}
              >
                <td className={CLASS_TD}>{truck.id}</td>
                <td className={CLASS_TD}>{truck.equipe}</td>
                <td className={CLASS_TD}>{truck.plaque}</td>
                <td className={CLASS_TD}>{truck.t}</td>
                <td className={CLASS_TD}>{truck.bags}</td>
                <td className={CLASS_TD}>
                  {truck.date} a {truck.time}
                </td>
                <td className={CLASS_TD}>
                  <div className=" bg-slate-700 w-32 h-16 rounded-md overflow-hidden  ">
                    <a href={truck.photos[0]}>
                      <img
                        src={truck.photos[0]}
                        className=" cursor-pointer  "
                      />
                    </a>
                  </div>
                </td>
                <td className={CLASS_TD}>
                  <div className=" bg-slate-700 w-32 h-16 rounded-md overflow-hidden  ">
                    <a href={truck.photos[0]}>
                      <img
                        src={truck.photos[1]}
                        className=" cursor-pointer  "
                      />
                    </a>
                  </div>
                </td>
                <td className={CLASS_TD}>
                  <div className=" bg-slate-700 w-32 h-16 rounded-md overflow-hidden  ">
                    <a href={truck.photos[0]}>
                      <img
                        src={truck.photos[2]}
                        className=" cursor-pointer  "
                      />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </table>
        )}
      </div>
    </div>
  );
}
