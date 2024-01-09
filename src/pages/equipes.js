import React, { useEffect, useRef, useState } from "react";
import { CLASS_TD, EQUIPES, MONTHS, POSTE, SECTIONS } from "../helpers/flow";
import { LoadAllItems } from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";

function AgentsTable({
  agentsf,
  ref_sp_equipe,
  ref_sp_section,
  ref_sp_m,
  ref_sp_y,
}) {
  const COL_SPAN = 4;

  return (
    <table>
      <thead>
        <tr>
          <td className={COL_SPAN}>
            <div>
              {" "}
              D'equipe:<b>nom</b>
            </div>
            <div>
              {" "}
              Nb. Ope.:<b>0</b>
            </div>
            <div>
              {" "}
              Nb. Charg.:<b>0</b>
            </div>
            <div>
              {" "}
              Nb. Net.:<b>0</b>
            </div>
          </td>
        </tr>
        <tr>
          <td
            className={CLASS_TD}
            colSpan={
              agentsf[0] && agentsf[0].rld.rl.split("").length + COL_SPAN
            }
          >
            <div className="text-2xl">
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
          <tr>
            <td className={CLASS_TD}>{i + 1}</td>
            <td className={CLASS_TD}>
              {ag.nom} {ag.postnom}
              <b>{ag.mingzi}</b>
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
    let items = await LoadAllItems(TABLES_NAMES.AGENTS);
    let rlds = await LoadAllItems(TABLES_NAMES.AGENTS_RLD);

    setagents(items);
    setrld(rlds);
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

      <div>
        {/* {false && (
          <AgentsNamesTable agentsArray={agentsf} onAgentClick={onAgentClick} />
        )} */}

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
