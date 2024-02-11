import React from "react";
import { CLASS_TD } from "../helpers/flow";

export default function TableLoadsTotals({ totalData, date }) {
  const no_data = totalData.length === 0;

  return (
    <table>
      <tr className="  font-bold">
        <td colSpan={5} align="center" className={CLASS_TD}>
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
      {!no_data && (
        <>
          <tr>
            <td className={CLASS_TD}>"EQ. 班组"</td>
            <td className={CLASS_TD}>"SAC 袋袋数"</td>
            <td className={CLASS_TD}>"T 吨"</td>
            <td className={CLASS_TD}>"BONUS 奖金"</td>
            <td className={CLASS_TD}>"CDF 钢狼"</td>
          </tr>
          {Object.entries(totalData).map((td, i) => (
            <>
              {" "}
              {td[0] !== "TOTAL" && (
                <tr>
                  <td className={CLASS_TD}>{td[0]}</td>
                  <td className={CLASS_TD}>{td[1].sacs}</td>
                  <td className={CLASS_TD}> {td[1].tonnage.toFixed(2)}</td>
                  <td className={CLASS_TD}>{td[1].bonus}</td>
                  <td className={CLASS_TD}>{td[1].bonus * 1000}</td>
                </tr>
              )}{" "}
              {td[0] === "TOTAL" && (
                <tr className="font-bold">
                  <td className={CLASS_TD}>{td[0]}</td>
                  <td className={CLASS_TD}>{td[1].sacs}</td>
                  <td className={CLASS_TD}> {td[1].tonnage.toFixed(2)}</td>
                  <td className={CLASS_TD}>{td[1].bonus}</td>
                  <td className={CLASS_TD}>
                    {Number(td[1].bonus * 1000).toFixed(2)}
                  </td>
                </tr>
              )}
            </>
          ))}
        </>
      )}
    </table>
  );
}
