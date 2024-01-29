import React, { useEffect, useRef, useState } from "react";

import {
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  CLASS_SELECT,
  CLASS_SELECT_TITLE,
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
  CustomSortByListPriority,
  getDaysInMonth,
  getRouelemtDaysLetters,
  getRouelemtDaysLetters2,
  printPDF1,
} from "../helpers/func";
import Loading from "../comps/Loading";
import { GetRandomArray, doc, print_agents_rl } from "../helpers/funcs_print";
import AgentsTable from "../comps/AgentsTable";

export default function Equipes() {
  const [agents, setagents] = useState([]);
  const [agentsf, setagentsf] = useState([]);
  const [rld, setrld] = useState([]);
  const [loading, setloading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState();
  const [list_title, set_list_title] = useState();
  const [daysLetters, setDaysLetters] = useState([]);

  const ref_equipe = useRef();
  const ref_section = useRef();
  const ref_sp_equipe = useRef();
  const ref_sp_section = useRef();
  const ref_sp_y = useRef();
  const ref_sp_m = useRef();
  const ref_year = useRef();
  const ref_month = useRef();

  const ref_gck_agents = useRef();
  const ref_mor_agents = useRef();
  const ref_full_team = useRef();
  const ref_all_gck_stuff = useRef();
  const ref_all_cd_stuff = useRef();
  const ref_all_zh_stuff = useRef();
  const ref_all_sup = useRef();

  const FILTERS = [
    { name: "GCK AGENTS", ref: ref_gck_agents },
    { name: "MOR AGENTS", ref: ref_mor_agents },
    { name: "FULL TEAM", ref: ref_full_team },
    { name: "ALL GCK STUFF", ref: ref_all_gck_stuff },
    { name: "ALL CD GCK STUFF", ref: ref_all_cd_stuff },
    { name: "ALL ZH GCK STUFF", ref: ref_all_zh_stuff },
    { name: "ALL SUPERVISORS", ref: ref_all_sup },
  ];

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    setloading(true);

    let items = await LoadAllItems(TABLES_NAMES.AGENTS);

    console.log("not sorted", items);

    items = items.sort(CustomSortByListPriority);

    console.log("sorted ", items);

    let rlds = await LoadAllItems(TABLES_NAMES.AGENTS_RLD);

    setagents(items);
    setrld(rlds);

    setloading(false);
  }

  function FilterAgents(items_raw, section, equipe, filter) {
    set_list_title(undefined);

    let items = items_raw.filter((ag, i) => {
      const by_equipe = ag.equipe === equipe;
      const by_section = ag.section === section;
      const gck = ag.contrat === "GCK";
      const mor = ag.contrat !== "GCK";
      const cd = ag.nationalite === "CD";
      const zh = ag.nationalite === "ZH";

      const equipe_section = by_equipe && by_section;
      const eq_sec_gck = equipe_section && gck;
      const eq_sec_mor = equipe_section && mor;
      const all_gck = gck;
      const all_zh = all_gck && zh;
      const all_cd = all_gck && cd;
      const all_sup =
        all_gck && !zh && ag.poste === "SUP" && ag.section === "ENSACHAGE";

      if (filter) {
        if ("GCK AGENTS" === filter.name) {
          set_list_title("AGENTS GCK");
          return eq_sec_gck;
        }
        if ("MOR AGENTS" === filter.name) return eq_sec_mor;
        if ("FULL TEAM" === filter.name) return equipe_section;
        if ("ALL CHINESE STUFF" === filter.name) return all_zh;
        if ("ALL GCK STUFF" === filter.name) return all_gck;
        if ("ALL CD GCK STUFF" === filter.name) return all_cd;
        if ("ALL ZH GCK STUFF" === filter.name) return all_zh;
        if ("ALL SUPERVISORS" === filter.name) return all_sup;
      }

      return equipe_section;
    });

    return items;
  }

  function onFilterAgents() {
    setagentsf([]);
    setDaysLetters([]);

    let y = ref_year.current.value;
    let m = ref_month.current.value;

    const dl = getRouelemtDaysLetters2(y, m);
    console.log(dl);
    setDaysLetters(dl);

    const section = ref_section.current.value;
    const equipe = ref_equipe.current.value;

    ref_sp_section.current.textContent = section;
    ref_sp_equipe.current.textContent = equipe;
    ref_sp_y.current.textContent = y;
    ref_sp_m.current.textContent = MONTHS[m];

    const arr_agents = FilterAgents(agents, section, equipe, selectedFilter);

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

    setagentsf([...arr_agents_with_rld]);
  }

  useEffect(() => {
    onFilterAgents();
  }, [selectedFilter]);

  function onSetFilter(e) {
    setSelectedFilter(e);
  }

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div>
      <Loading isLoading={loading} />

      {!loading && (
        <>
          <div>
            <div>
              <span className={CLASS_SELECT_TITLE}>SECTION</span>

              <select
                className={CLASS_SELECT}
                name="section"
                ref={ref_section}
                defaultValue={SECTIONS[0]}
                onChange={onFilterAgents}
              >
                {SECTIONS.map((it, i) => (
                  <option key={i}>{it}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <span className={CLASS_SELECT_TITLE}>EQUIPE</span>

            <select
              className={CLASS_SELECT}
              name="equipe"
              defaultValue={EQUIPES[0]}
              ref={ref_equipe}
              onChange={onFilterAgents}
            >
              {EQUIPES.map((it, i) => (
                <option key={i}>{it}</option>
              ))}
            </select>
          </div>

          <div>
            <span className={CLASS_SELECT_TITLE}>Year:</span>
            <select
              onChange={onFilterAgents}
              ref={ref_year}
              className={CLASS_SELECT}
            >
              {[...Array(10)].map((it, i) => (
                <option key={i}>{new Date().getFullYear() + i}</option>
              ))}
            </select>
          </div>
          <div>
            <span className={CLASS_SELECT_TITLE}>Month:</span>
            <select
              className={CLASS_SELECT}
              onChange={onFilterAgents}
              ref={ref_month}
            >
              {[...Array(12)].map((it, i) => (
                <option key={i} value={i}>
                  {MONTHS[i]}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div>
        <button
          className={CLASS_BTN}
          onClick={(e) => setShowFilters(!showFilters)}
        >
          {" "}
          SHOW/HIDE FILTERS{" "}
        </button>

        <div
          className={`p-2 border w-auto ${showFilters ? "block" : "hidden"}`}
        >
          {FILTERS.map((f, i) => (
            <div>
              <label>
                <input
                  onChange={(e) => onSetFilter(f)}
                  ref={f.ref}
                  type="radio"
                  name="filter"
                  value={f.name.replaceAll(" ", "_")}
                />
                {f.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <AgentsTable
          agentsf={agentsf}
          ref_sp_equipe={ref_sp_equipe}
          ref_sp_section={ref_sp_section}
          ref_sp_m={ref_sp_m}
          ref_sp_y={ref_sp_y}
          list_title={list_title}
          daysLetters={daysLetters}
        />
      </div>
    </div>
  );
}
