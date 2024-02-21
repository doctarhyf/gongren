import React, { useContext, useState } from "react";
import { CLASS_BTN, CLASS_TD, CLASS_TODAY, USER_LEVEL } from "../helpers/flow";
import Loading from "./Loading";
import { GFMN } from "../helpers/GetRoulemenDaysData.mjs";
import { UserContext } from "../App";

export default function AgentRoulementTable({
  agentData,
  daysData,
  agentRoulementData,
  loading,
  hideHeaders,
  onChangeRoulement,
  onSaveRoulement,
  errors,
}) {
  const [editRoulement, setEditRoulement] = useState(false);
  const [, , user] = useContext(UserContext);

  //console.log("dbg", daysData, new Date().getMonth(), new Date().getDate());

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
                    {GFMN(daysData.firstMonth)} - {daysData.date.y}
                  </b>
                </td>
                <td
                  align="center"
                  colSpan={daysData.secondMonthDates.length}
                  className={CLASS_TD}
                >
                  <b>
                    {" "}
                    {GFMN(daysData.secondMonth)} - {daysData.date.y}
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
                  {user.user_level >= USER_LEVEL.ADMIN && (
                    <button
                      className={`${CLASS_BTN} ${
                        !editRoulement ? "block" : "hidden"
                      } `}
                      onClick={(e) => setEditRoulement(true)}
                    >
                      UPDATE
                    </button>
                  )}
                  <button
                    className={`${CLASS_BTN} ${
                      editRoulement ? "block" : "hidden"
                    } `}
                    onClick={(e) => {
                      setEditRoulement(false);
                      onSaveRoulement();
                    }}
                  >
                    SAVE
                  </button>
                  <button
                    className={`${CLASS_BTN} ${
                      editRoulement ? "block" : "hidden"
                    } `}
                    onClick={(e) => setEditRoulement(false)}
                  >
                    CANCEL
                  </button>
                </div>
              </td>
              <td className={CLASS_TD}></td>
              {daysData &&
                daysData.daysNames.map((d, i) => (
                  <td
                    className={`${CLASS_TD}  ${
                      i === daysData.dates.indexOf(new Date().getDate()) &&
                      daysData.date.m === new Date().getMonth() + 1
                        ? CLASS_TODAY
                        : ""
                    } `}
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
                      daysData.date.m === new Date().getMonth() + 1
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
                  daysData.date.m === new Date().getMonth() + 1
                    ? CLASS_TODAY
                    : ""
                } `}
              >
                {!editRoulement && r}{" "}
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
                    {["J", "P", "N", "R", "-"].map((d, i) => (
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
