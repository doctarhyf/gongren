import React, { useContext, useEffect, useState } from "react";
import { ACCESS_CODES, CLASS_TD, COLUMNS_TO_HIDE } from "../helpers/flow";
import {
  formatAsMoney,
  AddLeadingZero,
  ParseDate,
  UserHasAccessCode,
  printTotalsTable,
  calculateTotalsFromLoadsArray,
} from "../helpers/func";
import { UserContext } from "../App";

import * as SB from "../helpers/sb";
import congo from "../img/congo.png";
import china from "../img/china.png";
import pdf from "../img/pdf.png";
import { TABLES_NAMES } from "../helpers/sb.config";
import { GetTransForTokensArray, LANG_TOKENS } from "../helpers/lang_strings";
import ActionButton from "./ActionButton";
import { printTeamMonthlyRepport } from "../helpers/funcs_print";

function AgentsByTeam({ agents_by_team, team }) {
  //const [agents_by_team, set_agents_by_team] = useState(undefined);

  if (agents_by_team === undefined) return null;

  const data = agents_by_team[team];

  if (data === undefined) return null;

  delete data.team;
  const tot = data.congo + data.china;
  console.log("agents_by_team", agents_by_team, "team", team, " data ", data);

  return (
    <div className=" flex text-xs font-mono gap-1  ">
      {" "}
      {Object.entries(data).map((it, i) => (
        <span className=" flex gap-1 items-center  ">
          {it[1]}
          <span className=" w-4 h-4 overflow-hidden inline-block ">
            <img src={i === 0 ? congo : china} />
          </span>
        </span>
      ))}
    </div>
  );
}

export default function TableLoadsTotals({
  totalData,
  date,
  columnsToHide = [],
  lastUpdateDate,
  tableMode = true,
  agents_by_team,
}) {
  const [, , user, setuser] = useContext(UserContext);
  const [upddate, setupddate] = useState("");
  const no_data = totalData.length === 0;

  useEffect(() => {
    const { y, m, d, h, i, s } = ParseDate(lastUpdateDate);
    const date = `Le ${d}/${m}/${y} a ${h}:${i}:${s}.`;
    setupddate(date);
  }, [lastUpdateDate]);

  let dt = Object.entries(totalData);

  function print(td, date) {
    console.log("print", td);

    printTeamMonthlyRepport(td, date);
  }

  return (
    <table className=" w-full rounded-md   ">
      <tr className="  font-bold"></tr>{" "}
      {no_data && (
        <tr>
          <td colSpan={5} className={CLASS_TD} align="center">
            <div className="text-red-400">
              {GetTransForTokensArray(LANG_TOKENS.MSG_NO_DATA, user.lang)}
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
              <td className={`  ${CLASS_TD} hidden md:table-cell  `}>
                CDF 钢狼
              </td>
            )}
          </tr>
          {Object.entries(totalData)
            //.sort((a, b) => -a[1].bonus + b[1].bonus)
            .map((td, i) => (
              <>
                {" "}
                {td[0] !== "TOTAL" && (
                  <tr className=" hover:bg-slate-500 hover:cursor-pointer ">
                    <td className={CLASS_TD}>{`${i + 1}). ${td[0]}`}</td>
                    {!columnsToHide.includes(COLUMNS_TO_HIDE.SACS) && (
                      <td className={CLASS_TD}>{td[1].sacs}</td>
                    )}
                    {!columnsToHide.includes(COLUMNS_TO_HIDE.TONNAGE) && (
                      <td className={CLASS_TD}> {td[1].tonnage.toFixed(2)}</td>
                    )}
                    {!columnsToHide.includes(COLUMNS_TO_HIDE.BONUS) && (
                      <td className={CLASS_TD}>
                        <div className=" flex justify-between">
                          <span>{td[1].bonus.toFixed(2)} </span>
                          <span className="  md:hidden inline-block ">
                            <ActionButton
                              icon={pdf}
                              title={""}
                              onClick={(e) => {
                                console.log(td);
                                print(td);
                              }}
                            />
                          </span>
                        </div>
                      </td>
                    )}

                    {!columnsToHide.includes(COLUMNS_TO_HIDE.CDF) && (
                      <td
                        className={` ${CLASS_TD} hidden md:flex gap-3 justify-between    `}
                      >
                        <span>
                          {formatAsMoney((td[1].bonus * 1000).toFixed(2))}
                        </span>
                        <span>
                          <ActionButton
                            icon={pdf}
                            title={""}
                            onClick={(e) => {
                              // alert("La fonction n'est pas encore faite ...");
                              print(td, date);
                            }}
                          />
                        </span>
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
                      <td
                        className={` ${CLASS_TD} hidden md:flex gap-3 justify-between  `}
                      >
                        <span>
                          {" "}
                          {formatAsMoney(Number(td[1].bonus * 1000).toFixed(2))}
                        </span>
                      </td>
                    )}
                  </tr>
                )}
              </>
            ))}

          <tr>
            <td className={CLASS_TD} colSpan={5 - columnsToHide.length}>
              {GetTransForTokensArray(LANG_TOKENS.LAST_UPDATE, user.lang)} :{" "}
              <b>{upddate}</b>
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
                UserHasAccessCode(
                  user,
                  ACCESS_CODES.CAN_SEE_ALL_TEAMS_LOADS_PROGRESS
                ) ||
                user.poste === "INT") && (
                <div className=" border-b border-white/15 ">
                  <div className=" flex justify-between ">
                    <div className=" font-bold  ">
                      {td[0]}
                      {td[0] !== "TOTAL" && (
                        <>
                          {" "}
                          {" - "}(
                          <span className="  text-xs  rounded-full  font-bold font-mono  ">
                            {agents_by_team[td[0]]
                              ? agents_by_team[td[0]].congo +
                                agents_by_team[td[0]].china
                              : ""}
                          </span>
                          ){" "}
                          {UserHasAccessCode(user, ACCESS_CODES.BONUS_BASE) && (
                            <>
                              <span className=" bg-green-950 text-green-200 p-1 rounded-md mx-[.75rem]  text-[.68rem] ">
                                {formatAsMoney(
                                  (
                                    (td[1].bonus * 1000) /
                                    (agents_by_team[td[0]].congo +
                                      agents_by_team[td[0]].china)
                                  ).toFixed(2)
                                )}
                              </span>
                            </>
                          )}
                          <AgentsByTeam
                            agents_by_team={agents_by_team}
                            team={td[0]}
                          />{" "}
                        </>
                      )}
                    </div>
                    <div className=" text-end   ">
                      <div className=" text-[12pt]  text-xs p-1 rounded-md   ">
                        <span className="  font-bold ">
                          {td[1].sacs} SACS / {(td[1].sacs / 20).toFixed(2)} T
                        </span>
                        <span className="  opacity-50  "> - CHARG</span>
                      </div>

                      {UserHasAccessCode(
                        user,
                        ACCESS_CODES.CAN_SEE_HOME_PAGE_BONUS_DATA
                      ) && (
                        <div className=" text-[14pt]  text-xs p-1 rounded-md  ">
                          <span className=" font-black bg-emerald-950 p-1 mx-1 rounded-md  ">
                            {formatAsMoney((td[1].bonus * 1000).toFixed(2))}
                          </span>{" "}
                          <span className="  opacity-50 "> - BONUS</span>
                        </div>
                      )}
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
            {GetTransForTokensArray(LANG_TOKENS.LAST_UPDATE, user.lang)} :{" "}
            <b>{upddate}</b>
          </div>
        </div>
      )}
    </table>
  );
}
