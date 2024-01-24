import React, { useEffect, useRef, useState } from "react";

import {
  CLASS_BTN,
  CLASS_TD,
  EQUIPES,
  K_POSTE_AIDE_OPERATEUR,
  K_POSTE_CHARGEUR,
  K_POSTE_NETTOYEUR,
  K_POSTE_OPERATEUR,
  MONTHS,
  SECTIONS,
} from "../helpers/flow";
import { LoadAllItems } from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import shield from "../img/shield.png";
import sup from "../img/sup.png";
import pdf from "../img/pdf.png";
import {
  CountAgentsByPostType,
  getDaysInMonth,
  printPDF1,
} from "../helpers/func";
import Loading from "../comps/Loading";
import { GetRandomArray, doc, print_agents_rl } from "../helpers/funcs_print";

function AgentsTable({
  agentsf,
  ref_sp_equipe,
  ref_sp_section,
  ref_sp_m,
  ref_sp_y,
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

  console.log("daysCount", daysCount);

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
    console.log(printAgentsRoulementPDF);
  }

  function PrepareAgentsPrintRLD(array) {
    return array.map((ag, index) => {
      let [mc, rl_id, y, m] = ag.rld.month_code.split("_");

      console.log(ag);

      let ad = {
        nom: {
          fr: `${ag.nom} ${ag.postnom} ${ag.prenom}`,
          zh: ` ${ag.mingzi}`,
        },
        rld: ag.rld.rl,
        month: m,
        year: y,
        poste: ag.poste,
        id: index + 1,
        contrat: ag.contrat,
        matricule: ag.matricule, //matricule: "L0501",
      };

      return ad;
    });
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <td className={COL_SPAN}>
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
            </td>
          </tr>
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
            {/* {agentsf[0] &&
              agentsf[0].rld.rl.split("").map((it, i) => (
                <td key={i} className={CLASS_TD}>
                  {i + 1}
                </td>
              ))} */}

            {[...Array(daysCount)].map((d, i) => (
              <td key={i} className={CLASS_TD}>
                {21 + i > daysCount ? (daysCount - i - 20 - 1) * -1 : 21 + i}
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
    </>
  );
}

export default function Equipes() {
  const [agents, setagents] = useState([]);
  const [agentsf, setagentsf] = useState([]);
  const [rld, setrld] = useState([]);
  const [showOnlyGCKAgents, setShowOnlyGCKAgents] = useState(false);

  const [loading, setloading] = useState(false);

  const ref_equipe = useRef();
  const ref_section = useRef();
  const ref_sp_equipe = useRef();
  const ref_sp_section = useRef();
  const ref_sp_y = useRef();
  const ref_sp_m = useRef();
  const ref_year = useRef();
  const ref_month = useRef();

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    setloading(true);

    let items = await LoadAllItems(TABLES_NAMES.AGENTS);
    let rlds = await LoadAllItems(TABLES_NAMES.AGENTS_RLD);

    setagents(items);
    setrld(rlds);
    //console.log(items, rlds);

    setloading(false);
  }

  function FilterAgents(items_raw, section, equipe) {
    let items = items_raw.filter((ag, i) => {
      const check_equipe = ag.equipe === equipe;
      const check_section = ag.section === section;

      if (showOnlyGCKAgents) return ag.contrat === "GCK";

      return check_equipe && check_section;
    });

    return items;
  }

  function onFilterAgents(e) {
    let y = ref_year.current.value;
    let m = ref_month.current.value;

    const section = ref_section.current.value;
    const equipe = ref_equipe.current.value;

    ref_sp_section.current.textContent = section;
    ref_sp_equipe.current.textContent = equipe;
    ref_sp_y.current.textContent = y;
    ref_sp_m.current.textContent = MONTHS[m];

    const arr_agents = FilterAgents(agents, section, equipe);

    let arr_agents_with_rld = [];

    arr_agents.map((agent, i) => {
      const { id: agent_id } = agent;

      let mc = `mc_${agent_id}_${y}_${m}`;

      const roulement_data = rld.find((it, i) => it.month_code === mc);

      agent.rld = roulement_data;

      if (roulement_data === undefined) {
        console.error(`rld for ${mc} is undefinded`);
        const data = { rl: [...Array(31).fill("-")].join(""), month_code: mc };
        agent.rld = data;
      } else {
        console.info(`rld for ${mc}\n`, agent);
      }
      arr_agents_with_rld.push(agent);
      return agent;
    });

    //console.log(arr_agents_with_rld);

    setagentsf(arr_agents_with_rld);
  }

  return (
    <div>
      <Loading isLoading={loading} />
      {!loading && (
        <table>
          <tbody>
            <div className={` ${showOnlyGCKAgents ? "hidden" : "block"} `}>
              <tr>
                <td>SECTION</td>
                <td>
                  <select
                    name="section"
                    ref={ref_section}
                    defaultValue={SECTIONS[0]}
                    onChange={onFilterAgents}
                  >
                    {SECTIONS.map((it, i) => (
                      <option key={i}>{it}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td>EQUIPE</td>
                <td>
                  {" "}
                  <select
                    name="equipe"
                    defaultValue={EQUIPES[0]}
                    ref={ref_equipe}
                    onChange={onFilterAgents}
                  >
                    {EQUIPES.map((it, i) => (
                      <option key={i}>{it}</option>
                    ))}
                  </select>
                </td>
              </tr>
            </div>

            <tr>
              <td colSpan={2}>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Only Agents GCK</span>
                    <input
                      onChange={(e) => {
                        const show = e.target.checked;
                        setShowOnlyGCKAgents(show);
                      }}
                      type="checkbox"
                      className="toggle"
                      checked={showOnlyGCKAgents}
                    />
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <td>Date</td>
              <td>
                <div>
                  Year:
                  <select onChange={onFilterAgents} ref={ref_year}>
                    {[...Array(10)].map((it, i) => (
                      <option key={i}>{new Date().getFullYear() + i}</option>
                    ))}
                  </select>
                </div>
                <div>
                  Month:
                  <select onChange={onFilterAgents} ref={ref_month}>
                    {[...Array(12)].map((it, i) => (
                      <option key={i} value={i}>
                        {MONTHS[i]}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      <div>
        <AgentsTable
          agentsf={agentsf}
          ref_sp_equipe={ref_sp_equipe}
          ref_sp_section={ref_sp_section}
          ref_sp_m={ref_sp_m}
          ref_sp_y={ref_sp_y}
        />
      </div>
    </div>
  );
}
