import React, { useContext, useEffect, useState } from "react";
import { ACCESS_CODES, CLASS_TD, COLUMNS_TO_HIDE } from "../helpers/flow";
import {
  formatAsMoney,
  AddLeadingZero,
  ParseDate,
  UserHasAccessCode,
} from "../helpers/func";
import { UserContext } from "../App";

import * as SB from "../helpers/sb";
import congo from "../img/congo.png";
import china from "../img/china.png";
import { TABLES_NAMES } from "../helpers/sb.config";

function AgentsByTeam({ agents_by_team, team }) {
  //const [agents_by_team, set_agents_by_team] = useState(undefined);

  if (agents_by_team === undefined) return null;

  const data = agents_by_team[team];

  if (data === undefined) return null;

  delete data.team;
  console.log("agents_by_team", agents_by_team, "team", team, " data ", data);

  return (
    <div className=" flex text-sm font-mono gap-1  ">
      [{" "}
      {Object.entries(data).map((it, i) => (
        <span className=" flex gap-1 items-center  ">
          {it[1]}
          <span className=" w-4 h-4 overflow-hidden inline-block ">
            <img src={i === 0 ? congo : china} />
          </span>
        </span>
      ))}{" "}
      ]
    </div>
  );
}

export default function TableLoadsTotals({
  totalData,
  date,
  columnsToHide = [],
  lastUpdateDate,
  tableMode = true,
}) {
  const [, , user, setuser] = useContext(UserContext);
  const [upddate, setupddate] = useState("");
  const [agents_by_team, set_agents_by_team] = useState(undefined);
  const no_data = totalData.length === 0;

  useEffect(() => {
    const { y, m, d, h, i, s } = ParseDate(lastUpdateDate);
    const date = `Le ${d}/${m}/${y} a ${h}:${i}:${s}.`;
    setupddate(date);
  }, [lastUpdateDate]);

  let dt = Object.entries(totalData);

  useEffect(() => {
    loadData();
  }, []);

  function groupAgentsByTeam(agents) {
    let equipes = { A: 0, B: 0, C: 0, D: 0 };

    agents.forEach((cur_agent) => {
      const { equipe, active, section } = cur_agent;

      Object.keys(equipes).forEach((cur_equipe) => {
        if (
          equipe === cur_equipe &&
          active === "OUI" &&
          section === "ENSACHAGE"
        )
          equipes[cur_equipe]++;
      });
    });

    console.log("Equipes => ", equipes);

    return equipes;
  }

  function groupCurMonthLoadsByTeam(loads) {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const filter = `${y}_${m}`;
    const floads = loads.filter((it) => it.code.includes(filter));

    const totals_by_team = { A: 0, B: 0, C: 0, D: 0 };

    floads.forEach((it) => {
      const { code, sacs } = it;
      const team = code[0];
      totals_by_team[team] += sacs;
    });

    const values = Object.values(totals_by_team);
    const keys = Object.keys(totals_by_team);
    const max = Math.max(...values);
    const max_idx = values.findIndex((it) => it === max);
    const max_team = keys[max_idx];

    totals_by_team.MAX = { team: max_team, sacs: max };

    console.log(totals_by_team);
    return totals_by_team;
  }

  async function loadData() {
    const agents = await SB.LoadAllItems(TABLES_NAMES.AGENTS);
    const loads = await SB.LoadAllItems(TABLES_NAMES.LOADS);
    const agents_by_team = groupAgentsByTeam(agents);
    const month_loads_by_team = groupCurMonthLoadsByTeam(loads);

    let acbt = {};
    Object.entries(agents_by_team).forEach((team) => {
      const [equipe, count] = team;
      const china = equipe === month_loads_by_team.MAX.team ? 2 : 1;

      console.log("equipe ", equipe, " congo ", count, " china ", china);
      const data = { team: equipe, congo: count, china: china };

      acbt[equipe] = data;
    });

    set_agents_by_team(acbt);

    console.log(acbt);
  }

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
          {Object.entries(totalData)
            .sort((a, b) => -a[1].bonus + b[1].bonus)
            .map((td, i) => (
              <>
                {" "}
                {td[0] !== "TOTAL" && (
                  <tr>
                    <td className={CLASS_TD}>{`${i + 1}). ${td[0]}`}</td>
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
          {dt.map((td, i) => (
            <div
              className={`  ${
                Math.max(
                  ...dt.map((it) => it[1].sacs).filter((it, i) => i < 4)
                ) === td[1].sacs && " bg-black/30"
              }  py-1 `}
            >
              {(td[0] === user.equipe ||
                UserHasAccessCode(user, ACCESS_CODES.ROOT) ||
                UserHasAccessCode(user, ACCESS_CODES.CAN_SEE_ALL_BONUS) ||
                user.poste === "INT") && (
                <div className=" border-b border-white/15 ">
                  <div className=" flex justify-between ">
                    <div className=" font-bold  ">
                      {td[0]}{" "}
                      <AgentsByTeam
                        agents_by_team={agents_by_team}
                        team={td[0]}
                      />
                    </div>
                    <div className=" text-end   ">
                      <div className=" text-[12pt]  text-xs p-1 rounded-md   ">
                        <span className="  font-bold ">
                          {td[1].sacs} SACS / {(td[1].sacs / 20).toFixed(2)} T
                        </span>
                        <span className="  opacity-50  "> - CHARG</span>
                      </div>
                      <div className=" text-[14pt]  text-xs p-1 rounded-md  ">
                        <span className=" font-black bg-emerald-950 p-1 mx-1 rounded-md  ">
                          {formatAsMoney((td[1].bonus * 1000).toFixed(2))}
                        </span>{" "}
                        <span className="  opacity-50 "> - BONUS</span>
                      </div>
                    </div>
                  </div>
                  <div>
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
