import React from "react";
import { CLASS_TD, COLUMNS_TO_HIDE } from "../helpers/flow";
import { formatAsMoney, AddLeadingZero } from "../helpers/func";

export default function TableLoadsTotals({
  totalData,
  date,
  columnsToHide = [],
  lastUpdateDate,
  tableMode = true,
}) {
  const no_data = totalData.length === 0;

  const ParseDate = (date) => {
    if (!date || !date.getFullYear) date = new Date();
    const y = date.getFullYear();
    const m = AddLeadingZero(date.getMonth());
    const d = AddLeadingZero(date.getDate());

    const h = AddLeadingZero(date.getHours());
    const i = AddLeadingZero(date.getMinutes());
    const s = AddLeadingZero(date.getSeconds());

    return `Le ${d}/${m}/${y} a ${h}:${i}:${s}.`;
  };

  return (
    <table className=" w-full rounded-md   ">
      <tr className="  font-bold">
        <td align="center" className="  border-0 ">
          水泥车间包装奖金 - {date.y}年{date.m + 1}月
        </td>
      </tr>{" "}
      {no_data && (
        <tr>
          <td colSpan={5} className={CLASS_TD} align="center">
            <div className="text-red-400">
              Sorry, there's no data for the selected Month!
            </div>
          </td>
        </tr>
      )}
      {!no_data &&
        (tableMode ? (
          <div>
            <tr className="  w-full  ">
              <td className={CLASS_TD}>EQ. 班组</td>
              {!columnsToHide.includes(COLUMNS_TO_HIDE.SACS) && (
                <td className={CLASS_TD}>SAC 袋袋数</td>
              )}
              {!columnsToHide.includes(COLUMNS_TO_HIDE.TONNAGE) && (
                <td className={CLASS_TD}>T 吨</td>
              )}
              {!columnsToHide.includes(COLUMNS_TO_HIDE.BONUS) && (
                <td className={CLASS_TD}>BONUS 奖金(T)</td>
              )}
              {!columnsToHide.includes(COLUMNS_TO_HIDE.CDF) && (
                <td className={CLASS_TD}>CDF 钢狼</td>
              )}
            </tr>
            {Object.entries(totalData).map((td, i) => (
              <>
                {" "}
                {td[0] !== "TOTAL" && (
                  <tr>
                    <td className={CLASS_TD}>{td[0]}</td>
                    {!columnsToHide.includes(COLUMNS_TO_HIDE.SACS) && (
                      <td className={CLASS_TD}>{td[1].sacs}</td>
                    )}
                    {!columnsToHide.includes(COLUMNS_TO_HIDE.TONNAGE) && (
                      <td className={CLASS_TD}> {td[1].tonnage.toFixed(2)}</td>
                    )}
                    {!columnsToHide.includes(COLUMNS_TO_HIDE.BONUS) && (
                      <td className={CLASS_TD}>{td[1].bonus.toFixed(2)}</td>
                    )}

                    {!columnsToHide.includes(COLUMNS_TO_HIDE.CDF) && (
                      <td className={CLASS_TD}>
                        {formatAsMoney((td[1].bonus * 1000).toFixed(2))}
                      </td>
                    )}
                  </tr>
                )}{" "}
                {td[0] === "TOTAL" && (
                  <tr className="font-bold">
                    <td className={CLASS_TD}>{td[0]}</td>
                    {!columnsToHide.includes(COLUMNS_TO_HIDE.SACS) && (
                      <td className={CLASS_TD}>{td[1].sacs}</td>
                    )}
                    {!columnsToHide.includes(COLUMNS_TO_HIDE.TONNAGE) && (
                      <td className={CLASS_TD}> {td[1].tonnage.toFixed(2)}</td>
                    )}
                    {!columnsToHide.includes(COLUMNS_TO_HIDE.BONUS) && (
                      <td className={CLASS_TD}>{td[1].bonus.toFixed(2)}</td>
                    )}

                    {!columnsToHide.includes(COLUMNS_TO_HIDE.CDF) && (
                      <td className={CLASS_TD}>
                        {formatAsMoney(Number(td[1].bonus * 1000).toFixed(2))}
                      </td>
                    )}
                  </tr>
                )}
              </>
            ))}

            <tr>
              <td className={CLASS_TD} colSpan={5 - columnsToHide.length}>
                Last Update : <b>{ParseDate(lastUpdateDate)}</b>
              </td>
            </tr>
          </div>
        ) : (
          <div>Cool</div>
        ))}
    </table>
  );
}
