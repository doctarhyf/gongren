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
  POSTE,
  SECTIONS,
} from "../helpers/flow";
import { LoadAllItems } from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import shield from "../img/shield.png";
import pdf from "../img/pdf.png";
import { CountAgentsByPostType, GeneratePDF, printPDF1 } from "../helpers/func";
import Loading from "../comps/Loading";

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

  function printPDF(agents) {
    if (agents.length === 0) {
      throw new Error("Agents list cant be empty!");
      return;
    }

    /* const names_list = agents.map((el, i) => {
      let name = `${el.nom} ${el.postnom}`;
      return name;
    });

    GeneratePDF(names_list); */
    printPDF1(agents);
  }

  return (
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
              <div>
                <button
                  onClick={(e) => printPDF(agentsf)}
                  className={`${CLASS_BTN} flex text-sm my-2`}
                >
                  <img src={pdf} width={20} height={30} /> IMPRIMER PDF
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
              <span ref={ref_sp_section}></span> / <span ref={ref_sp_m}></span>{" "}
              - <span ref={ref_sp_y}></span>
            </div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={CLASS_TD} colSpan={COL_SPAN}></td>
          {agentsf[0] &&
            agentsf[0].rld.rl.split("").map((it, i) => (
              <td key={i} className={CLASS_TD}>
                {i + 1}
              </td>
            ))}
        </tr>
        <tr>
          <td className={CLASS_TD}>
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
          <tr key={i} className={` ${ag.chef_deq === "OUI" && "bg-sky-200"}  `}>
            <td className={CLASS_TD}>{i + 1}</td>
            <td className={CLASS_TD}>
              <div className="flex">
                {ag.nom} {ag.postnom}
                <b>{ag.mingzi}</b>
                {ag.chef_deq === "OUI" && (
                  <span className="mx-2">
                    <img src={shield} width={20} height={20} />
                  </span>
                )}
              </div>
            </td>
            <td className={CLASS_TD}>{ag.contrat}</td>
            <td className={CLASS_TD}>{ag.poste}</td>
            {ag.rld.rl.split("").map((r, i) => (
              <td className={CLASS_TD}>{r}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Equipes() {
  const [agents, setagents] = useState([]);
  const [agentsf, setagentsf] = useState([]);
  const [rld, setrld] = useState([]);
  const [rldf, setrldf] = useState([]);
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

      return check_equipe && check_section;
    });

    return items;
  }

  function onChange(e) {
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
    });

    //console.log(arr_agents_with_rld);

    setagentsf(arr_agents_with_rld);
  }

  function onAgentClick(agent) {
    console.log(agent);
  }

  return (
    <div>
      <Loading isLoading={loading} />
      {!loading && (
        <table>
          <tbody>
            <tr>
              <td>SECTION</td>
              <td>
                <select
                  name="section"
                  ref={ref_section}
                  defaultValue={SECTIONS[0]}
                  onChange={onChange}
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
                  onChange={onChange}
                >
                  {EQUIPES.map((it, i) => (
                    <option key={i}>{it}</option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>Date</td>
              <td>
                <div>
                  Year:
                  <select onChange={onChange} ref={ref_year}>
                    {[...Array(10)].map((it, i) => (
                      <option key={i}>{new Date().getFullYear() + i}</option>
                    ))}
                  </select>
                </div>
                <div>
                  Month:
                  <select onChange={onChange} ref={ref_month}>
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
