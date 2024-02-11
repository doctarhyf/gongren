import React from "react";
import { CLASS_TD } from "../helpers/flow";

export default function TableLoadsTotals({ data, date }) {
  let teamsData = {
    A: {
      sacs: 0,
      retours: 0,
      ajouts: 0,
      tonnage: 0,
      camions: 26,
      dechires: 17,
      bonus: 0,
    },
    B: {
      sacs: 0,
      retours: 0,
      ajouts: 0,
      tonnage: 0,
      camions: 26,
      dechires: 17,
      bonus: 0,
    },
    C: {
      sacs: 0,
      retours: 0,
      ajouts: 0,
      tonnage: 0,
      camions: 26,
      dechires: 17,
      bonus: 0,
    },
    D: {
      sacs: 0,
      retours: 0,
      ajouts: 0,
      tonnage: 0,
      camions: 26,
      dechires: 17,
      bonus: 0,
    },
    TOTAL: {
      sacs: 0,
      retours: 0,
      ajouts: 0,
      tonnage: 0,
      camions: 26,
      dechires: 17,
      bonus: 0,
    },
  };

  const entries = Object.entries(data);
  const no_data = entries.length === 0;

  entries.forEach((d_entry, di) => {
    const d = d_entry[0];
    const d_data = d_entry[1];

    d_data.forEach((s_data, si) => {
      const { sacs, retours, ajouts, code, camions, dechires } = s_data;
      const [t, s, y, m, d] = code.split("_");

      let new_sacs = Number(sacs);
      let new_tonnage = Number(sacs) / 20;
      let new_retours = Number(retours);
      let new_ajouts = Number(ajouts);
      let new_camions = Number(camions);
      let new_dechires = Number(dechires);
      let new_bonus = new_tonnage < 600 ? 0 : new_tonnage - 600;

      teamsData[t].sacs += new_sacs;
      teamsData[t].tonnage += new_tonnage;
      teamsData[t].retours += new_retours;
      teamsData[t].ajouts += new_ajouts;
      teamsData[t].camions += new_camions;
      teamsData[t].dechires += new_dechires;
      teamsData[t].bonus += new_bonus;

      teamsData.TOTAL.sacs += new_sacs;
      teamsData.TOTAL.tonnage += new_tonnage;
      teamsData.TOTAL.retours += new_retours;
      teamsData.TOTAL.ajouts += new_ajouts;
      teamsData.TOTAL.camions += new_camions;
      teamsData.TOTAL.dechires += new_dechires;
      teamsData.TOTAL.bonus += new_bonus;
    });
  });

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
          {Object.entries(teamsData).map((td, i) => (
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
