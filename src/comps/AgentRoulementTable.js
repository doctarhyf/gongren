import React, { useContext, useState } from "react";
import { UserContext } from "../App";
import {
  ACCESS_CODES,
  CLASS_BTN,
  CLASS_TD,
  CLASS_TODAY,
} from "../helpers/flow";
import { AddOneToRoulementCurMonth, UserHasAccessCode } from "../helpers/func";
import { GFMN } from "../helpers/GetRoulemenDaysData.mjs";
import {
  GetTransForTokenName,
  GetTransForTokensArray,
  GTFT,
  LANG_TOKENS,
} from "../helpers/lang_strings";
import chart from "../img/chart.png";
import sync from "../img/sync.png";
import ActionButton from "./ActionButton";
import Loading from "./Loading";
import save from "../img/save.png";

const POINTAGES_HOURS_LEN = {
  J: 10,
  N: 14,
  R: 0,
};

const KAOQIN = {
  J: { desc: "Jour" },
  P: { desc: "Apres-midi" },
  N: { desc: "Nuit" },
  R: { desc: "Repos" },
  A: { desc: "Absent" },
  M: { desc: "Malade" },
  C: { desc: "Conge conditionel" },
  "-": { desc: "-" },
};

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

  return (
    <div>
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
                    {d}
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
                {!editRoulement && r}

                {editRoulement && (
                  <select
                    className={`${CLASS_TD} texts-xs  ${
                      i === daysData.dates.indexOf(new Date().getDate()) &&
                      daysData.date.m === new Date().getMonth() + 1
                        ? "text-green-500"
                        : ""
                    } `}
                    defaultValue={r}
                    onChange={(e) => onChangeRoulement(i, e.target.value)}
                  >
                    {Object.keys(KAOQIN).map((d, i) => (
                      <option selected={d === r}>{d}</option>
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
      <div className={`m-1 ${errors.length === 0 ? "hidden" : "block"} `}>
        <span className="p-1 m-1 rounded-full bg-red-700 border-red-400 border text-xs text-white">
          {errors.map((e, i) => (
            <span>
              {i + 1}. {e.msg}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
