import React, { useEffect, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import AgentCard from "../comps/AgentCard";
import AgentsList from "../comps/AgentsList";

export default function Agents() {
  const [curAgent, setCurAgent] = useState(null);
  const [showFormAddNewAgent, setShowFormAddNewAgent] = useState(false);

  const agent = {
    id: 36,
    created_at: "2023-09-08T17:42:53.34043+00:00",
    contrat: "BNC",
    equipe: "C",
    mingzi: "",
    nationalite: "CD",
    nom: "KALENGA",
    poste: "NET",
    postnom: "WA UMBA",
    prenom: "DEKALE",
    section: "ENSACHAGE",
    phone: "0995439973",
    matricule: "305",
    page: 2,
  };

  function onShowRoulement() {
    console.log("On Show Roulement ...");
  }

  return (
    <div>
      {!showFormAddNewAgent && (
        <button
          onClick={(e) => setShowFormAddNewAgent(true)}
          className="p-1 rounded-md border my-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
        >
          NEW AGENT
        </button>
      )}

      {!showFormAddNewAgent && (
        <div className="flex ">
          <AgentsList curAgent={curAgent} onAgentClick={setCurAgent} />
          <AgentCard onShowRoulement={onShowRoulement} agent={curAgent} />
        </div>
      )}

      {showFormAddNewAgent && (
        <div>
          {[
            ["contrat", agent.contrat, ["BNC", "KAY"]],
            ["equipe", agent.equipe, ["JR", "A", "B", "C", "D"]],
            ["mingzi", agent.mingzi],
            ["nom", agent.nom],
            ["poste", agent.poste, ["EXP", "NET", "OPE", "CHARG"]],
            ["postnom", agent.postnom],
            ["prenom", agent.prenom],
            ["section", agent.section, ["BROYAGE", "EMBALLAGE"]],
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
          <button
            onClick={(e) => setShowFormAddNewAgent(!showFormAddNewAgent)}
            className="p-1 rounded-md border my-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
          >
            ANNULER
          </button>
          <button
            onClick={undefined}
            className="p-1 rounded-md border my-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
          >
            SAVE
          </button>
        </div>
      )}
    </div>
  );
}
