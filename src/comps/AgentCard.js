import React, { useContext, useEffect, useState } from "react";
import {
  ACCESS_CODES,
  CLASS_BTN,
  CONTRATS,
  EQUIPES,
  POSTE,
  SECTIONS,
  USER_LEVEL,
} from "../helpers/flow";
import { FFD, formatFrenchDate, UserHasAccessCode } from "../helpers/func";
import FormAddAgent from "./FormAddAgent";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "./Loading";
import shield from "../img/shield.png";
import ico_user from "../img/user.png";
import ItemNotSelected from "./ItemNotSelected";
import { UserContext } from "../App";

export const AGENT_CARD_EVENT = {
  DELETED: "ag_del",
  UPDATED: "ag_upd",
  ERROR: "ag_err",
};

const COLUMNS_TO_HIDE = [
  "photo",
  "list_priority",
  "page",
  "access_codes",
  //"is_exp",
];

export default function AgentCard({
  agent,
  onShowRoulement,
  onAgentCardEvent,
  agentCardEditMode,
  setAgentCardEditMode,
  reloadComponents,
}) {
  const [, , user, setuser] = useContext(UserContext);
  const [access_codes, set_access_codes] = useState([]);

  const [loading, setloading] = useState(false);

  async function onFormUpdate(agent_data) {
    agent_data.id = agent.id;

    if (
      window.confirm(
        `Update agent? "${agent_data.nom} - ${agent_data.postnom}", no undo!`
      )
    ) {
      setloading(true);
      const res = await SB.UpdateItem(TABLES_NAMES.AGENTS, agent_data);

      if (res) {
        //alert(`Error delete ${res}`);
        onAgentCardEvent(AGENT_CARD_EVENT.ERROR, res);
        setloading(false);
        return;
      }

      //alert(`Agent deleted " ${agent_data.nom} - ${agent_data.prenom} "`);
      onAgentCardEvent(AGENT_CARD_EVENT.UPDATED, agent_data);
      setloading(false);
      return;
    }
  }

  function onFormCancel() {
    setAgentCardEditMode(false);
  }

  async function deleteAgent(agent_data) {
    if (
      window.confirm(
        `Delete agent? "${agent_data.nom} - ${agent_data.postnom}", no undo!`
      )
    ) {
      setloading(true);
      const res_del_agent = await SB.DeleteItem(
        TABLES_NAMES.AGENTS,
        agent_data
      );
      const res_del_all_rld = await SB.DeleteItemByColEqVal(
        TABLES_NAMES.AGENTS_RLD,
        "agent_id",
        agent_data.id
      );

      if (res_del_agent || res_del_all_rld) {
        onAgentCardEvent(AGENT_CARD_EVENT.ERROR, res_del_agent);
        setloading(false);
        return;
      }

      //alert(`Agent deleted " ${agent_data.nom} - ${agent_data.prenom} "`);
      onAgentCardEvent(AGENT_CARD_EVENT.DELETED, agent_data);
      setloading(false);
      return;
    }
  }

  useEffect(() => {
    if (agent) set_access_codes(agent.access_codes);
  }, [agent]);

  const [showAccessCode, setShowAccessCode] = useState(false);

  useEffect(() => {
    console.log("ac => ", access_codes);
  }, [access_codes]);

  function onChangeAccessCode(user, sel_access_code, activated) {
    const ac = sel_access_code[1];
    let o_access_codes = [...access_codes];
    const idx_ac = o_access_codes.findIndex((it) => it === ac);

    if (activated) {
      if (idx_ac === -1) o_access_codes.push(ac);
    } else {
      o_access_codes = o_access_codes.filter((it, i) => it !== ac);
    }

    set_access_codes(o_access_codes);
  }

  function onUpdateAccessCodes(agent) {
    //console.log(agent);
    setloading(true);
    SB.UpdateItem(
      TABLES_NAMES.AGENTS,
      { id: agent.id, access_codes: access_codes },
      (s) => {
        alert("Access codes updated");
        setloading(false);
        setShowAccessCode(false);
        if (reloadComponents) reloadComponents();
      },
      (e) => {
        alert("Error :\n" + JSON.stringify(e));
        setloading(false);
      }
    );
  }

  return (
    <section>
      <Loading isLoading={loading} />
      {agent && !agentCardEditMode && (
        <div className="agent-card p-2 border-neutral-400 border rounded-md ml-2">
          <a href={agent.photo || null}>
            {" "}
            <div className="text-center w-44 mx-auto rounded-md  md:h-[200pt] max-h-36  overflow-hidden ">
              <img
                className="mx-auto"
                src={agent.photo || ico_user}
                width="100%"
                height="100%"
              />
            </div>
          </a>
          <div>
            {UserHasAccessCode(user, ACCESS_CODES.ROOT) && (
              <div>
                SHOW ACCESS CODES
                <input
                  type="checkbox"
                  className="toggle toggle-xs"
                  checked={showAccessCode}
                  onChange={(e) => setShowAccessCode(e.target.checked)}
                />
              </div>
            )}

            <table>
              {!agentCardEditMode &&
                (showAccessCode ? (
                  <div>
                    {Object.entries(ACCESS_CODES).map((ac, i) => (
                      <div>
                        {ac[0]}
                        <input
                          type="checkbox"
                          checked={access_codes.includes(ac[1])}
                          onChange={(e) =>
                            onChangeAccessCode(agent, ac, e.target.checked)
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <tbody>
                    <tr>
                      <td></td>
                      <td className="flex justify-center">
                        {" "}
                        {agent.chef_deq === "OUI" && (
                          <span className="mx-2">
                            <img src={shield} width={20} height={20} />
                          </span>
                        )}
                      </td>
                    </tr>
                    {Object.entries(agent).map((agent_data, i) =>
                      COLUMNS_TO_HIDE.includes(agent_data[0]) ? null : (
                        <tr key={i}>
                          <td
                            align="right"
                            className="text-neutral-400 text-sm"
                          >
                            {agent_data[0]}
                          </td>
                          <td className="text-sky-500 p-1 font-bold ">
                            {agent_data[0] === "created_at" &&
                              formatFrenchDate(agent_data[1])}
                            {agent_data[0] !== "created_at" && agent_data[1]}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                ))}

              {agentCardEditMode && (
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
            {showAccessCode && (
              <div>
                <button
                  onClick={(e) => {
                    onUpdateAccessCodes(agent);
                  }}
                  className={CLASS_BTN}
                >
                  UPDATE ACCESS CODES
                </button>
                <button
                  onClick={(e) => {
                    if (
                      window.confirm(
                        "Are you sure you want to reset all access codes?"
                      )
                    ) {
                      set_access_codes([]);
                    }
                  }}
                  className={CLASS_BTN}
                >
                  CLEAR ALL
                </button>
                <button
                  onClick={(e) => setShowAccessCode(false)}
                  className={CLASS_BTN}
                >
                  ANNULER
                </button>
              </div>
            )}

            {!agentCardEditMode && !showAccessCode && (
              <>
                {user.user_level >= USER_LEVEL.ADMIN && (
                  <>
                    {/* <button
                      onClick={(e) => onShowRoulement(agent)}
                      className={CLASS_BTN}
                    >
                      VOIR ROULEMENT
                    </button> */}

                    {UserHasAccessCode(user, ACCESS_CODES.UPDATE_AGENT) && (
                      <button
                        onClick={(e) =>
                          setAgentCardEditMode(!agentCardEditMode)
                        }
                        className={CLASS_BTN}
                      >
                        UPDATE
                      </button>
                    )}

                    {UserHasAccessCode(user, ACCESS_CODES.DELETE_AGENT) && (
                      <button
                        onClick={(e) => deleteAgent(agent)}
                        className={CLASS_BTN}
                      >
                        DELETE
                      </button>
                    )}
                  </>
                )}
              </>
            )}

            {agentCardEditMode && (
              <>
                <button
                  onClick={(e) => setAgentCardEditMode(!agentCardEditMode)}
                  className={CLASS_BTN}
                >
                  ANNULER
                </button>
                <button
                  onClick={(e) => setAgentCardEditMode(!agentCardEditMode)}
                  className={CLASS_BTN}
                >
                  ENREGISTER
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {agent && agentCardEditMode && (
        <FormAddAgent
          agentDataToUpdate={agent}
          onFormUpdate={onFormUpdate}
          onFormCancel={onFormCancel}
        />
      )}
      {agent === null && <ItemNotSelected show={agent} itemName={"agent"} />}
    </section>
  );
}
