import React, { useEffect, useRef, useState } from "react";
import { CLASS_TD, EQUIPES, MONTHS, POSTE, SECTIONS } from "../helpers/flow";
import { LoadAllItems } from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import AgentsNamesTable from "../comps/AgentsNamesTable";

export default function Equipes() {
  const [agents, setagents] = useState([]);
  const [agentsf, setagentsf] = useState([]);
  const [rld, setrld] = useState([]);
  const [rldf, setrldf] = useState([]);

  const ref_equipe = useRef();
  const ref_section = useRef();
  const ref_sp_equipe = useRef();
  const ref_sp_section = useRef();
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
    const section = ref_section.current.value;
    const equipe = ref_equipe.current.value;

    ref_sp_section.current.textContent = section;
    ref_sp_equipe.current.textContent = equipe;

    const arr_agents = FilterAgents(agents, section, equipe);

    setagentsf(arr_agents);
  }

  function onAgentClick(agent) {
    console.log(agent);
  }

  function onChangeDate(e) {
    console.log(e);
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
                <select onChange={onChangeDate} ref={ref_year}>
                  {[...Array(10)].map((it, i) => (
                    <option>{new Date().getFullYear() + i}</option>
                  ))}
                </select>
              </div>
              <div>
                Month:
                <select onChange={onChangeDate} ref={ref_year}>
                  {[...Array(12)].map((it, i) => (
                    <option value={i}>{MONTHS[i]}</option>
                  ))}
                </select>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="text-3xl">
        Equipe <span ref={ref_sp_equipe}></span> -{" "}
        <span ref={ref_sp_section}></span>
      </div>

      <div>
        {/* {false && (
          <AgentsNamesTable agentsArray={agentsf} onAgentClick={onAgentClick} />
        )} */}

        <table>
          <tbody>
            {agentsf.map((ag, i) => (
              <tr>
                <td className={CLASS_TD}>{i + 1}</td>
                <td className={CLASS_TD}>
                  {ag.nom} - {ag.postnom}
                </td>
                <td className={CLASS_TD}>{ag.matricule}</td>
                {}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
