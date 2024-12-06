import React, { useContext, useState } from "react";
import { UserContext } from "../App";
import {
  ACCESS_CODES,
  CLASS_BTN,
  CLASS_TD,
  CLASS_TODAY,
  getFrenchDayName,
  KAOQIN,
  WEEK_DAYS_TRAD,
} from "../helpers/flow";
import { AddOneToRoulementCurMonth, UserHasAccessCode } from "../helpers/func";
import { GFMN } from "../helpers/GetRoulemenDaysData.mjs";
import {
  GetLangIndexByLangCode,
  GetTransForTokenName,
  GetTransForTokensArray,
  GTFT,
  LANG_TOKENS,
} from "../helpers/lang_strings";
import chart from "../img/chart.png";
import save from "../img/save.png";
import sync from "../img/sync.png";
import ActionButton from "./ActionButton";
import Loading from "./Loading";

/* const POINTAGES_HOURS_LEN = {
  J: 10,
  N: 14,
  R: 0,
};
 */

export default function AgentRoulementTable({
  agentData,
  daysData,
  agentRoulementData,
  loading,
  hideHeaders,
  onChangeRoulement,
  onSaveRoulement,
  onSaveRoulementAndApplyToWholeTeam,
  errors,
}) {
  const [editRoulement, setEditRoulement] = useState(false);
  const [, , user] = useContext(UserContext);
  const [showStats, setShowHideStats] = useState(false);

  let pointage = [];
  let stats = {};

  if (agentRoulementData && agentRoulementData.rl && daysData && agentData) {
    const { nom, postnom, prenom, mingzi, matricule } = agentData;
    const { dates, daysNames } = daysData;
    const rl = agentRoulementData.rl.split("");

    dates.forEach((p, i) => {
      pointage.push({ idx: i, date: p, dayName: daysNames[i], rl: rl[i] });
    });

    const JOURS_OUVRABLES = pointage.filter(
      (it, i) => it.dayName !== "D" && it.rl === "J"
    ).length;

    const DIMANCHES_FERIES = pointage.filter(
      (it, i) => it.dayName === "D" && (it.rl === "J" || it.rl === "N")
    ).length;

    const NUITS = pointage.filter((it, i) => it.rl === "N").length;
    const REPOS = pointage.filter((it, i) => it.rl === "R").length;

    stats.NOM = `${nom} ${postnom} ${prenom} ${mingzi}`;
    stats.MATRICULE = matricule;
    stats.JOURS_OUVRABLES = [JOURS_OUVRABLES, 10 * JOURS_OUVRABLES];
    stats.DIMANCHES_FERIES = [DIMANCHES_FERIES, DIMANCHES_FERIES * 10];
    stats.NUITS = [NUITS, NUITS * 14];
    stats.REPOS = [REPOS, 0];
  }

  console.log("daysData : ", daysData);
  return (
    <div>
      <div className={`m-1 ${errors.length === 0 ? "hidden" : "block"} `}>
        <span className="p-1 m-1 rounded-md bg-red-700 border-red-400 border  text-white">
          Veuillez selection le mot pour afficher le roulement!
        </span>
      </div>
      <table>
        {!hideHeaders && (
          <>
            {" "}
            {daysData && (
              <tr>
                <td colSpan={3} className={CLASS_TD}></td>
                <td
                  align="center"
                  colSpan={daysData.firstMonthDates.length}
                  className={CLASS_TD}
                >
                  <b>
                    {GetTransForTokenName(GFMN(daysData.firstMonth), user.lang)}{" "}
                    - {daysData.date.y}
                  </b>
                </td>
                <td
                  align="center"
                  colSpan={daysData.secondMonthDates.length}
                  className={CLASS_TD}
                >
                  <b>
                    {" "}
                    {GetTransForTokenName(
                      GFMN(daysData.secondMonth),
                      user.lang
                    )}{" "}
                    - {daysData.date.y}
                  </b>
                </td>
              </tr>
            )}
            <tr>
              <td className={CLASS_TD}></td>
              <td className={CLASS_TD}>
                <div
                  className={` ${errors.length === 0 ? "block" : "hidden"} `}
                >
                  {(UserHasAccessCode(user, ACCESS_CODES.UPDATE_ROULEMENT) ||
                    UserHasAccessCode(user, ACCESS_CODES.ROOT)) && (
                    <div className={` ${!editRoulement ? "block" : "hidden"} `}>
                      <ActionButton
                        icon={sync}
                        title={GetTransForTokensArray(
                          LANG_TOKENS.UPDATE,
                          user.lang
                        )}
                        onClick={(e) => setEditRoulement(true)}
                      />
                    </div>
                  )}

                  <div
                    className={`${CLASS_BTN} ${
                      editRoulement ? "block" : "hidden"
                    } `}
                  >
                    <ActionButton
                      icon={save}
                      title={GetTransForTokensArray(
                        LANG_TOKENS.SAVE,
                        user.lang
                      )}
                      onClick={(e) => {
                        setEditRoulement(false);
                        onSaveRoulement();
                      }}
                    />
                  </div>

                  {UserHasAccessCode(
                    user,
                    ACCESS_CODES.CAN_SAVE_ROULEMENT_FOR_WHOLE_TEAM
                  ) && (
                    <div
                      className={`${CLASS_BTN} ${
                        editRoulement ? "block" : "hidden"
                      } `}
                    >
                      <ActionButton
                        icon={save}
                        title={GetTransForTokensArray(
                          LANG_TOKENS.SAVE_WHOLE_TEAM,
                          user.lang
                        )}
                        onClick={(e) => {
                          setEditRoulement(false);
                          onSaveRoulementAndApplyToWholeTeam();
                        }}
                      />
                    </div>
                  )}

                  <button
                    className={`${CLASS_BTN} ${
                      editRoulement ? "block" : "hidden"
                    } `}
                    onClick={(e) => setEditRoulement(false)}
                  >
                    {GTFT(LANG_TOKENS.CANCEL, user.lang)}
                  </button>
                </div>
              </td>
              <td className={CLASS_TD}></td>
              {daysData &&
                daysData.daysNames.map((d, i) => (
                  <td
                    className={`${CLASS_TD}  ${
                      i === daysData.dates.indexOf(new Date().getDate()) &&
                      daysData.date.m ===
                        new Date().getMonth() + AddOneToRoulementCurMonth()
                        ? CLASS_TODAY
                        : ""
                    } ${["S", "D"].includes(d) ? "bg-black text-white" : ""} `}
                  >
                    {editRoulement
                      ? GetTransForTokenName(
                          getFrenchDayName(
                            daysData.date.y,
                            i < daysData.firstMonthRoulementDaysCount
                              ? daysData.date.m
                              : daysData.secondMonth,
                            daysData.dates[i]
                          ),
                          user.lang
                        )
                      : d}
                  </td>
                ))}
            </tr>
            <tr>
              <td className={CLASS_TD}>No</td>
              <td className={CLASS_TD}>Agent/员工</td>
              <td className={CLASS_TD}>Mat./工号</td>
              {daysData &&
                daysData.dates.map((d, i) => (
                  <td
                    className={`${CLASS_TD}  ${
                      i === daysData.dates.indexOf(new Date().getDate()) &&
                      daysData.date.m ===
                        new Date().getMonth() + +AddOneToRoulementCurMonth()
                        ? CLASS_TODAY
                        : ""
                    } `}
                  >
                    {d}
                  </td>
                ))}
            </tr>{" "}
          </>
        )}

        <tr>
          <td className={CLASS_TD}>1</td>
          <td className={`${CLASS_TD}   `}>
            {agentData.nom} {agentData.postnom} {agentData.prenom}
          </td>
          <td className={CLASS_TD}>{agentData.matricule}</td>

          {!loading &&
            agentRoulementData.rl &&
            agentRoulementData.rl.split("").map((r, i) => (
              <td
                className={`${CLASS_TD}  ${
                  i === daysData.dates.indexOf(new Date().getDate()) &&
                  daysData.date.m ===
                    new Date().getMonth() + AddOneToRoulementCurMonth()
                    ? CLASS_TODAY
                    : ""
                } `}
              >
                {!editRoulement && `${(KAOQIN[r] && KAOQIN[r].printSym) || r}`}

                {editRoulement && (
                  <select
                    className={`${CLASS_TD} texts-xs text-black dark:text-white   ${
                      i === daysData.dates.indexOf(new Date().getDate()) &&
                      daysData.date.m === new Date().getMonth() + 1
                        ? "text-green-500"
                        : ""
                    } `}
                    defaultValue={r}
                    onChange={(e) => onChangeRoulement(i, e.target.value)}
                  >
                    {Object.entries(KAOQIN).map((d, i) => (
                      <option
                        value={d[0]}
                        selected={d[0] === r}
                        className=" text-black dark:text-white  "
                      >
                        {d[1].printSym} :{" "}
                        {d[1].trad[GetLangIndexByLangCode(user.lang)]} -{" "}
                        {d[1].h}
                      </option>
                    ))}
                  </select>
                )}
              </td>
            ))}

          {loading && agentRoulementData.rl && (
            <td
              className={CLASS_TD}
              colSpan={agentRoulementData.rl.length}
              align="center"
            >
              <Loading isLoading={loading} />
            </td>
          )}
        </tr>
      </table>

      <ActionButton
        icon={chart}
        title={"SHOW/HIDE STATS"}
        onClick={(e) => setShowHideStats(!showStats)}
      />
      {showStats && (
        <div>
          {stats &&
            Object.entries(stats).map((it, i) => (
              <div>
                <span className="font-bold">{it[0]}:</span>
                {JSON.stringify(it[1])}
              </div>
            ))}
        </div>
      )}

      {editRoulement && (
        <div className=" w-fit p-2 bg-white rounded-md shadow-md dark:text-black   ">
          <div className=" text-xl font-thin text-center text-slate-800  ">
            LEGENDE
          </div>
          {stats &&
            Object.entries(KAOQIN).map((it, i) => (
              <div className=" border-b mb-1 border-gray-300 ">
                {it[1].printSym !== "-" && (
                  <>
                    {" "}
                    <span className="font-bold"> {it[1].printSym}:</span>
                    {it[1].trad[GetLangIndexByLangCode(user.lang)]}
                    {it[1].h && (
                      <span className="  text-xs bg-slate-700 text-white p-1 rounded-md mx-2  ">
                        {" "}
                        {it[1].h}{" "}
                      </span>
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
