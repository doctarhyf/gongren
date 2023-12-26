import React, { useEffect, useRef, useState } from "react";
import { EQUIPES, POSTE, SECTIONS } from "../helpers/flow";
import { LoadAllItems } from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";

export default function Equipes() {
  const [agents, setagents] = useState([]);
  const [agentsf, setagentsf] = useState([]);

  const ref_equipe = useRef();
  const ref_section = useRef();

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

    const itemsf = FilterAgents(agents, section, equipe);

    setagentsf(itemsf);
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

      <div className="text-3xl">Equipe ... - ...</div>

      <div>
        {agentsf.map((it, i) => (
          <div key={i}>{it.nom}</div>
        ))}
      </div>
    </div>
  );
}
