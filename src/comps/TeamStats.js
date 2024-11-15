import React, { useContext } from "react";
import { CountAgentsByPostType } from "../helpers/func";
import {
  K_POSTE_AIDE_OPERATEUR,
  K_POSTE_CHARGEUR,
  K_POSTE_NETTOYEUR,
  K_POSTE_OPERATEUR,
} from "../helpers/flow";
import {
  GetTransForTokenName,
  GetTransForTokensArray,
  LANG_TOKENS,
} from "../helpers/lang_strings";
import { UserContext } from "../App";

export default function TeamStats({ agentsf }) {
  const [, , user] = useContext(UserContext);
  const nb_op = CountAgentsByPostType(agentsf, K_POSTE_OPERATEUR);
  const nb_charg = CountAgentsByPostType(agentsf, K_POSTE_CHARGEUR);
  const nb_net = CountAgentsByPostType(agentsf, K_POSTE_NETTOYEUR);
  const nb_aide_op = CountAgentsByPostType(agentsf, K_POSTE_AIDE_OPERATEUR);
  const chef_deq = agentsf.find((it, i) => it.chef_deq === "OUI");
  const agent_zero = agentsf[0];

  let cur_equipe = "";
  let cur_section = "";
  let agents_count = agentsf.length;

  if (agent_zero) {
    const { equipe, section } = agent_zero;
    cur_equipe = equipe;
    cur_section = section;
  }

  return (
    <di className="mx-2">
      <div className="border-b mb-1 text-lg text-sky-500  pb-1 ">
        {`${GetTransForTokensArray(
          LANG_TOKENS.TEAM,
          user.lang
        )} ${GetTransForTokenName(
          cur_equipe,
          user.lang
        )}, ${GetTransForTokenName(
          cur_section,
          user.lang
        )} (${agents_count} ${GetTransForTokensArray(
          LANG_TOKENS.AGENTS,
          user.lang
        )})`}
      </div>
      <div>
        {" "}
        {GetTransForTokensArray(LANG_TOKENS.chef_deq, user.lang)}:
        <b>{chef_deq && `${chef_deq.nom} ${chef_deq.postnom}`}</b>
      </div>
      <div>
        {" "}
        {GetTransForTokensArray(LANG_TOKENS.OPE, user.lang)}:<b>{nb_op}</b>
      </div>
      <div>
        {" "}
        {GetTransForTokensArray(LANG_TOKENS.AIDOP, user.lang)}:
        <b>{nb_aide_op}</b>
      </div>
      <div>
        {" "}
        {GetTransForTokensArray(LANG_TOKENS.CHARG, user.lang)}:<b>{nb_charg}</b>
      </div>
      <div>
        {" "}
        {GetTransForTokensArray(LANG_TOKENS.NET, user.lang)}:<b>{nb_net}</b>
      </div>
    </di>
  );
}
