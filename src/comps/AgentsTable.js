import React from "react";

import shield from "../img/shield.png";
import sup from "../img/sup.png";
import pdf from "../img/pdf.png";
import {
  CountAgentsByPostType,
  getDaysInMonth,
  getRouelemtDaysLetters,
  getRouelemtDaysLetters2,
  printPDF1,
} from "../helpers/func";
import { GetRandomArray, doc, print_agents_rl } from "../helpers/funcs_print";
import {
  K_POSTE_AIDE_OPERATEUR,
  K_POSTE_CHARGEUR,
  K_POSTE_NETTOYEUR,
  CLASS_TD,
  CLASS_BTN,
  K_POSTE_OPERATEUR,
} from "../helpers/flow";

export default function AgentsTable({
  agentsf,
  ref_sp_equipe,
  ref_sp_section,
  ref_sp_m,
  ref_sp_y,
  list_title,
  daysLetters,
}) {
  const COL_SPAN = 4;
  const nb_op = CountAgentsByPostType(agentsf, K_POSTE_OPERATEUR);
  const nb_charg = CountAgentsByPostType(agentsf, K_POSTE_CHARGEUR);
  const nb_net = CountAgentsByPostType(agentsf, K_POSTE_NETTOYEUR);
  const nb_aide_op = CountAgentsByPostType(agentsf, K_POSTE_AIDE_OPERATEUR);
  const chef_deq = agentsf.find((it, i) => it.chef_deq === "OUI");
  let daysCount = 31;

  if (agentsf.length > 0) {
    let ag = agentsf[0];

    const [mc, agent_id, y, m] = ag.rld.month_code.split("_");

    daysCount = new Date(Number(y), Number(m) + 1, 0).getDate();
  }

  function printPDF(agents_array) {
    if (agents_array.length === 0) {
      alert("Agents list cant be empty!");
      return;
    }

    printPDF1(agents_array);
  }

  function printAgentsRoulementPDF(agents_array) {
    if (agents_array.length === 0) {
      alert("Agents list cant be empty!");
      return;
    }

    const agents_rld_parsed_data = PrepareAgentsPrintRLD(agents_array); //GetRandomArray(20);
    print_agents_rl(agents_rld_parsed_data);
  }

  function PrepareAgentsPrintRLD(array) {
    if (array.length === 0) {
      alert("Error agents array must not have length of 0!");
      return;
    }

    const res = array.map((ag, index) => {
      let [mc, rl_id, y, m] = ag.rld.month_code.split("_");
      m = Number(m) + 1;
      y = Number(y);

      const num_days_in_month = getDaysInMonth(y, m, true);
      const rld = ag.rld.rl.slice(0, num_days_in_month);

      let ad = {
        nom: {
          fr: `${ag.nom} ${ag.postnom} ${ag.prenom}`,
          zh: ` ${ag.mingzi}`,
        },
        rld: rld,
        month: m,
        year: y,
        poste: ag.poste,
        id: index + 1,
        contrat: ag.contrat,
        matricule: ag.matricule, //matricule: "L0501",
      };

      return ad;
    });

    let ag_zero = { ...res[0] };
    const daysLetters = getRouelemtDaysLetters(
      Number(ag_zero.year),
      Number(ag_zero.month)
    );

    ag_zero = {
      ...ag_zero,
      id: "",
      nom: { fr: list_title || "", zh: "" },
      contrat: "",
      rld: daysLetters.join(""),
      matricule: "",
    };

    const final_data = [...res, ag_zero];

    return final_data;
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <td
              className={CLASS_TD}
              colSpan={
                agentsf[0] && agentsf[0].rld.rl.split("").length + COL_SPAN
              }
            >
              <div className="text-2xl text-center">
                Equipe <span ref={ref_sp_equipe}></span> -{" "}
                <span ref={ref_sp_section}></span> /{" "}
                <span ref={ref_sp_m}></span> - <span ref={ref_sp_y}></span>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={CLASS_TD} colSpan={COL_SPAN}></td>
            {daysLetters.map((d, i) => (
              <td key={i} className={CLASS_TD}>
                {d}
              </td>
            ))}
          </tr>
          <tr>
            <td className={` ${CLASS_TD} w-min `}>
              <b>No</b>
            </td>
            <td className={CLASS_TD}>
              <b>Nom et Postnom</b>
            </td>
            <td className={CLASS_TD}>
              <b>Agent</b>
            </td>
            <td className={CLASS_TD}>
              <b>Poste</b>
            </td>
            {[...Array(daysCount)].map((d, i) => (
              <td key={i} className={CLASS_TD}>
                {21 + i > daysCount ? (daysCount - i - 20 - 1) * -1 : 21 + i}
              </td>
            ))}
          </tr>
          {agentsf.map((ag, i) => (
            <tr
              key={i}
              className={` ${
                ag.chef_deq === "OUI" && "bg-neutral-200/60 font-bold"
              }   ${ag.poste === "SUP" && "bg-neutral-200/60 font-bold"}  `}
            >
              <td className={` ${CLASS_TD} w-min `}>{i + 1}</td>
              <td className={CLASS_TD}>
                <div className="flex">
                  {ag.nom} {ag.postnom}
                  <b>{ag.mingzi}</b>
                  {ag.chef_deq === "OUI" && (
                    <span className="mx-2">
                      <img alt="shield" src={shield} width={20} height={20} />
                    </span>
                  )}
                  {ag.poste === "SUP" && (
                    <span className="mx-2">
                      <img alt="sup" src={sup} width={20} height={20} />
                    </span>
                  )}
                </div>
              </td>
              <td className={CLASS_TD}>
                {ag.contrat}
                {ag.matricule && `- ${ag.matricule}`}
              </td>
              <td className={CLASS_TD}>{ag.poste}</td>
              {ag.rld.rl
                .slice(0, daysCount)
                .split("")
                .map((r, i) => (
                  <td className={CLASS_TD}>{r}</td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>

      <tr>
        <td className={COL_SPAN}>
          {agentsf.length !== 0 && (
            <div className="flex gap-4">
              <button
                onClick={(e) => printPDF(agentsf)}
                className={`${CLASS_BTN} flex text-sm my-2`}
              >
                <img src={pdf} alt="pdf" width={20} height={30} /> IMPRIMER
                LISTE
              </button>
              <button
                onClick={(e) => printAgentsRoulementPDF(agentsf)}
                className={`${CLASS_BTN} flex text-sm my-2`}
              >
                <img alt="pdf" src={pdf} width={20} height={30} /> IMPRIMER
                ROULEMENT
              </button>
            </div>
          )}
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
        </td>
      </tr>
    </>
  );
}
