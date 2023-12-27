import React, { useState } from "react";
import { CLASS_BTN, CONTRATS, EQUIPES, POSTE, SECTIONS } from "../helpers/flow";
import { FFD, formatFrenchDate } from "../helpers/func";
import FormAddAgent from "./FormAddAgent";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";

export default function AgentCard({ agent, onShowRoulement }) {
  const [editMode, setEditMode] = useState(false);

  function onFormUpdate(d) {
    console.log("update form ", d);
  }

  function onFormCancel() {
    setEditMode(false);
  }

  async function deleteAgent(agent_data) {
    let yes = confirm(
      `Delete agent? "${agent_data.nom} - ${agent_data.postnom}", no undo!`
    );

    if (yes) {
      const res = await SB.DeleteItem(TABLES_NAMES.AGENTS, agent_data);

      if (res) alert(`Error delete ${res}`);

      return;
    }
  }

  return (
    <section>
      {agent && !editMode && (
        <div className="agent-card p-2 border-neutral-400 border rounded-md ml-2">
          <div className="text-center">
            <img
              className="mx-auto"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpeN_JyQ6AUHZ3TGvJhlkL17RF6DYel89sNJ0D7rTHfg&s"
              width={80}
              height={80}
            />
          </div>
          <div>
            <table>
              {!editMode && (
                <tbody>
                  {Object.entries(agent).map((agent_data, i) => (
                    <tr key={i}>
                      <td align="right" className="text-neutral-400 text-sm">
                        {agent_data[0]}
                      </td>
                      <td className="text-sky-500 p-1 font-bold ">
                        {agent_data[0] === "created_at" &&
                          formatFrenchDate(agent_data[1])}
                        {agent_data[0] !== "created_at" && agent_data[1]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}

              {editMode && (
                <tbody>
                  {[
                    ["contrat", agent.contrat, CONTRATS],
                    ["equipe", agent.equipe, EQUIPES],
                    ["mingzi", agent.mingzi],
                    ["nom", agent.nom],
                    ["poste", agent.poste, POSTE],
                    ["postnom", agent.postnom],
                    ["prenom", agent.prenom],
                    ["section", agent.section, SECTIONS],
                    ["phone", agent.phone],
                    ["matricule", agent.matricule],
                  ].map((agent_data, i) => (
                    <tr key={i}>
                      <td align="right" className="text-neutral-400 text-sm">
                        {agent_data[0]}
                      </td>
                      <td className=" ">
                        <input
                          className=" outline-none border border-sky-500  rounded-md "
                          type="text"
                          defaultValue={agent_data[1]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
          <div className="flex justify-center items-center text-center ">
            {!editMode && (
              <>
                <button
                  onClick={(e) => onShowRoulement(agent)}
                  className={CLASS_BTN}
                >
                  VOIR ROULEMENT
                </button>
                <button
                  onClick={(e) => setEditMode(!editMode)}
                  className={CLASS_BTN}
                >
                  UPDATE
                </button>
                <button
                  onClick={(e) => deleteAgent(agent)}
                  className={CLASS_BTN}
                >
                  DELETE
                </button>
              </>
            )}

            {editMode && (
              <>
                <button
                  onClick={(e) => setEditMode(!editMode)}
                  className={CLASS_BTN}
                >
                  ANNULER
                </button>
                <button
                  onClick={(e) => setEditMode(!editMode)}
                  className={CLASS_BTN}
                >
                  ENREGISTER
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {agent && editMode && (
        <FormAddAgent
          agentDataToUpdate={agent}
          onFormUpdate={onFormUpdate}
          onFormCancel={onFormCancel}
        />
      )}
      {agent === null && <div>Select an agent!</div>}
    </section>
  );
}
