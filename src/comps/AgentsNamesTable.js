import React from "react";
import "../App.css";

export default function AgentsNamesTable({
  agentsArray,
  onAgentClick,
  curAgent,
}) {
  return (
    <table class=" print-only w-full ">
      <thead>
        <tr>
          {["No", "Nom", "Agent/Mat.", "Section", "Poste", "Equipe"].map(
            (it, i) => (
              <th className="p-1 border-neutral-400 border" key={i}>
                {it}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody>
        {agentsArray.map((agent, i) => (
          <tr
            onClick={(e) => onAgentClick(agent)}
            key={i}
            className={`hover:bg-neutral-200 cursor-pointer ${
              curAgent &&
              curAgent.id === agent.id &&
              "bg-neutral-500 text-white"
            } `}
          >
            {[
              i + 1,
              `${agent.nom} ${agent.postnom} ${agent.prenom} ${agent.mingzi}`,
              `${agent.contrat} - ${agent.matricule}`,
              agent.section,
              agent.poste,
              agent.equipe,
            ].map((agd, i) => (
              <td key={i} className="p-1 border-neutral-400 border">
                {agd}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
