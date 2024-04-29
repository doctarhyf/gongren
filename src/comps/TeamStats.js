import React from "react";
import { CountAgentsByPostType } from "../helpers/func";
import {
  K_POSTE_AIDE_OPERATEUR,
  K_POSTE_CHARGEUR,
  K_POSTE_NETTOYEUR,
  K_POSTE_OPERATEUR,
} from "../helpers/flow";

export default function TeamStats({ agentsf }) {
  const nb_op = CountAgentsByPostType(agentsf, K_POSTE_OPERATEUR);
  const nb_charg = CountAgentsByPostType(agentsf, K_POSTE_CHARGEUR);
  const nb_net = CountAgentsByPostType(agentsf, K_POSTE_NETTOYEUR);
  const nb_aide_op = CountAgentsByPostType(agentsf, K_POSTE_AIDE_OPERATEUR);
  const chef_deq = agentsf.find((it, i) => it.chef_deq === "OUI");
  const agent_zero = agentsf[0]
  
  let cur_equipe = '';
  let cur_section = '';
  let agents_count = agentsf.length;
  
  if(agent_zero){
  	const { equipe, section } = agent_zero
  	cur_equipe = equipe;
  	cur_section = section;
  }

  return (
    <di className="mx-2">
      <div className="border-b mb-1 text-lg text-sky-500  pb-1 ">
        {`Equipe ${cur_equipe}, ${cur_section} (${agents_count} agents`})
      </div>
      <div>
        {" "}
        D'equipe:
        <b>{chef_deq && `${chef_deq.nom} ${chef_deq.postnom}`}</b>
      </div>
      <div>
        {" "}
        Operateurs:<b>{nb_op}</b>
      </div>
      <div>
        {" "}
        Aide Operateurs:<b>{nb_aide_op}</b>
      </div>
      <div>
        {" "}
        Chargeurs:<b>{nb_charg}</b>
      </div>
      <div>
        {" "}
        Nettoyeurs:<b>{nb_net}</b>
      </div>
    </di>
  );
}
