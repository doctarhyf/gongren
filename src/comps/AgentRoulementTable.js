import React, { useState } from "react";
import { CLASS_BTN, CLASS_TD } from "../helpers/flow";
import Loading from "./Loading";

export default function AgentRoulementTable({
  agentData,
  daysData,
  agentRoulementData,
  loading,
  hideHeaders,
  onChangeRoulement,
  onSaveRoulement,
}) {
  const [editRoulement, setEditRoulement] = useState(false);

  return (
    <table>
      {!hideHeaders && (
        <>
          {" "}
          <tr>
            <td className={CLASS_TD}></td>
            <td className={CLASS_TD}>
              <div>
                <button
                  className={`${CLASS_BTN} ${
                    !editRoulement ? "block" : "hidden"
                  } `}
                  onClick={(e) => setEditRoulement(true)}
                >
                  UPDATE
                </button>
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
                <td className={CLASS_TD}>{d}</td>
              ))}
          </tr>
          <tr>
            <td className={CLASS_TD}>No</td>
            <td className={CLASS_TD}>Agent/员工</td>
            <td className={CLASS_TD}>Mat./工号</td>
            {daysData &&
              daysData.dates.map((d, i) => <td className={CLASS_TD}>{d}</td>)}
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
            <td className={CLASS_TD}>
              {!editRoulement && r}{" "}
              {editRoulement && (
                <select
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
  );
}
