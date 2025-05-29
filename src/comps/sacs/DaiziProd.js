import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import * as SB from "../../helpers/sb";
import { TABLES_NAMES } from "../../helpers/sb.config";
import {
  formatCreatedAt,
  formatDateForDatetimeLocal,
  formatFrenchDate,
} from "../../helpers/func";
import { DAIZI_FUZEREN } from "../../helpers/flow";
import ButtonPrint from "../ButtonPrint";
import {
  GetTransForTokensArray,
  LANG_TOKENS,
} from "../../helpers/lang_strings";
import jsPDF from "jspdf";
import {
  createHeaders,
  transformDataForPrint,
} from "../../helpers/funcs_print";

export default function DaiziProd({ stock }) {
  const [, , user] = useContext(UserContext);
  const [trans, setTrans] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const trans = await SB.LoadAllItems(
      TABLES_NAMES.DAIZI_SHENGCHAN,
      "created_at",
      true
    );

    setTrans(trans);
  }

  return (
    <div>
      <div>PRODUCTION</div>

      <table class="table-auto">
        <thead className="p1 border border-gray-900 dark:border-white p-1 ">
          {[
            "created_at",
            "team",
            "used_32",
            "used_42",
            "t_32",
            "t_42",
            "dech_32",
            "dech_32",
            "rest32",
            "rest42",
            "date_time",
          ].map((it, i) => {
            <tr>
              <th className="p1 border border-gray-900 dark:border-white p-1 ">
                ID
              </th>
            </tr>;
          })}
        </thead>
        <tbody>
          {trans.map((item) => (
            <tr key={item.id}>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {formatCreatedAt(item.created_at)}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.created_at}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.created_at}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.created_at}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.created_at}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.created_at}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.created_at}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.created_at}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.created_at}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.created_at}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.created_at}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
