import React from "react";

export default function FormNewAgent({
  onFormNewAgentSave,
  onFormNewAgentCancel,
  agentData,
}) {
  let agent = agentData || {
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

  return (
    <div>
      {[
        [`id`, agent.id, , ,],
        [`created_at`, agent.created_at, , ,],
        ["contrat", agent.contrat, ["BNC", "KAY"]],
        ["equipe", agent.equipe, ["JR", "A", "B", "C", "D"]],
        ["mingzi", agent.mingzi],
        ["nationalite", agent.nationalite, ["CD", "ZH"]],
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
            {agent_data.length == 2 && (
              <input
                className=" outline-none border border-sky-500  rounded-md "
                type="text"
                defaultValue={agent_data[1]}
              />
            )}

            {agent_data.length == 3 && (
              <select
                className=" outline-none border border-sky-500  rounded-md "
                type="text"
                defaultValue={agent_data[1]}
              >
                {agent_data[2].map((it, i) => (
                  <option key={i}>{it}</option>
                ))}
              </select>
            )}
            {agent_data.length == 4 && <div>{agent_data[1]}</div>}
          </td>
        </tr>
      ))}
      <button
        onClick={(e) => onFormNewAgentCancel()}
        className="p-1 rounded-md border my-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
      >
        ANNULER
      </button>
      <button
        onClick={(e) => onFormNewAgentSave()}
        className="p-1 rounded-md border my-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
      >
        SAVE
      </button>
    </div>
  );
}
