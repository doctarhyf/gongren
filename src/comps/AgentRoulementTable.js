import React, { useState } from "react";
import { CLASS_BTN, CLASS_TD } from "../helpers/flow";
import Loading from "./Loading";

export default function AgentRoulementTable({
  agentData,
  daysData,
  agentRoulementData,
  loading,
  hideHeaders,
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
                <input
                  type="checkbox"
                  value={editRoulement}
                  onChange={(e) => setEditRoulement(!e.target.checked)}
                />{" "}
                EDIT ROULEMENT
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
              {editRoulement && r}{" "}
              {!editRoulement && (
                <select>
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
