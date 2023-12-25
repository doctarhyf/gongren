import React, { useState } from "react";
import { CLASS_BTN } from "../helpers/flow";
import { FFD, formatFrenchDate } from "../helpers/func";

export default function AgentCard({ agent, onShowRoulement }) {
  const [editMode, setEditMode] = useState(false);

  return (
    <section>
      {agent && (
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
                  {Object.entries(agent).map((agent_data, i) => (
                    <tr key={i}>
                      <td align="right" className="text-neutral-400 text-sm">
                        {agent_data[0]}
                      </td>
                      <td className=" ">
                        <input
                          className=" outline-none border border-sky-500 p-1 rounded-md "
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
              <button
                onClick={(e) => onShowRoulement(agent)}
                className={CLASS_BTN}
              >
                VOIR ROULEMENT
              </button>
            )}
            <button
              onClick={(e) => setEditMode(!editMode)}
              className={CLASS_BTN}
            >
              UPDATE
            </button>
          </div>
        </div>
      )}
      {agent === null && <div>Select an agent!</div>}
    </section>
  );
}
