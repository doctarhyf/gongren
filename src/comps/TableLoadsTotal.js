import React, { useEffect, useState } from "react";
import { CLASS_TD, COLUMNS_TO_HIDE } from "../helpers/flow";
import { formatAsMoney, AddLeadingZero, ParseDate } from "../helpers/func";

export default function TableLoadsTotals({
  totalData,
  date,
  columnsToHide = [],
  lastUpdateDate,
  tableMode = true,
}) {
  const [upddate, setupddate] = useState("");
  const no_data = totalData.length === 0;

  useEffect(() => {
    const { y, m, d, h, i, s } = ParseDate(lastUpdateDate);
    const date = `Le ${d}/${m}/${y} a ${h}:${i}:${s}.`;
    setupddate(date);
  }, [lastUpdateDate]);

  console.log("tdata => ", totalData);

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
      {!no_data && tableMode ? (
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
              Last Update : <b>{upddate}</b>
            </td>
          </tr>
        </div>
      ) : (
        <div>
          {Object.entries(totalData).map((td, i) => (
            <div className="  py-1 border-b border-white/15">
              <div className=" text-[21pt] ">{td[0]}</div>
              <div>
                <div>{td[1].sacs} sacs</div>
                {i !== 4 && (
                  <progress className=" progress progress-warning  w-full  " />
                )}
              </div>
              <div>
                <div>{td[1].bonus}</div>
                {i !== 4 && (
                  <progress className=" progress progress-success w-full  " />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </table>
  );
}
