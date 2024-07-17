import React, { useContext, useEffect, useState } from "react";
import { ACCESS_CODES, CLASS_TD, COLUMNS_TO_HIDE } from "../helpers/flow";
import {
  formatAsMoney,
  AddLeadingZero,
  ParseDate,
  UserHasAccessCode,
} from "../helpers/func";
import { UserContext } from "../App";

export default function TableLoadsTotals({
  totalData,
  date,
  columnsToHide = [],
  lastUpdateDate,
  tableMode = true,
}) {
  const [, , user, setuser] = useContext(UserContext);
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
            <div className="  py-1 ">
              {(td[0] === user.equipe ||
                UserHasAccessCode(user, ACCESS_CODES.ROOT) ||
                user.poste === "INT") && (
                <div className=" border-b border-white/15 ">
                  <div className=" flex justify-between ">
                    <div className=" font-bold  ">{td[0]}</div>
                    <div className=" text-end   ">
                      <div className=" text-[12pt]  text-xs p-1 rounded-md   ">
                        <span className="  font-bold ">
                          {td[1].sacs} SACS / {(td[1].sacs / 20).toFixed(2)} T
                        </span>
                        <span className="  opacity-50  "> - CHARG.</span>
                      </div>
                      <div className=" text-[14pt]  text-xs p-1 rounded-md  ">
                        {/* <span className=" font-black bg-emerald-950 p-1 mx-1 rounded-md  ">
                      {td[1].bonus.toFixed(2)} T
                    </span>{" "} */}
                        <span className=" font-black bg-emerald-950 p-1 mx-1 rounded-md  ">
                          {formatAsMoney((td[1].bonus * 1000).toFixed(2))}
                        </span>{" "}
                        <span className="  opacity-50 "> - BONUS</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {/* {i !== 4 && (
                  <progress
                    className=" progress progress-warning  w-full  "
                    max={totalData.TOTAL.sacs}
                    value={
                      (td[1].sacs / totalData.TOTAL.sacs) * totalData.TOTAL.sacs
                    }
                  />
                )} */}
                    {i !== 4 && (
                      <progress
                        className=" progress progress-success w-full  "
                        max={totalData.TOTAL.bonus}
                        value={
                          (td[1].bonus / totalData.TOTAL.bonus) *
                          totalData.TOTAL.bonus
                        }
                      />
                    )}{" "}
                  </div>{" "}
                </div>
              )}
            </div>
          ))}
          <div>
            Last Update : <b>{upddate}</b>
          </div>
        </div>
      )}
    </table>
  );
}
