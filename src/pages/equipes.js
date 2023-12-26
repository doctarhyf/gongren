import React, { useEffect, useRef, useState } from "react";
import { EQUIPES, POSTE, SECTIONS } from "../helpers/flow";
import { LoadAllItems } from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import AgentsNamesTable from "../comps/AgentsNamesTable";

export default function Equipes() {
  const [agents, setagents] = useState([]);
  const [agentsf, setagentsf] = useState([]);

  const ref_equipe = useRef();
  const ref_section = useRef();
  const ref_sp_equipe = useRef();
  const ref_sp_section = useRef();

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    let items = await LoadAllItems(TABLES_NAMES.AGENTS);

    setagents(items);
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

    const itemsf = FilterAgents(agents, section, equipe);

    console.log(itemsf[0]);
    setagentsf(itemsf);
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
        </tbody>
      </table>

      <div className="text-3xl">
        Equipe <span ref={ref_sp_equipe}></span> -{" "}
        <span ref={ref_sp_section}></span>
      </div>

      <div>
        <AgentsNamesTable agentsArray={agentsf} onAgentClick={onAgentClick} />
      </div>
    </div>
  );
}
