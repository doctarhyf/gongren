import React, { useContext, useEffect, useRef, useState } from "react";

import {
  ACCESS_CODES,
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  CLASS_SELECT,
  CLASS_SELECT_TITLE,
  CLASS_TD,
  EQUIPES,
  EQUIPES_NAMES,
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
  UserHasAccessCode,
} from "../helpers/func";
import Loading from "../comps/Loading";
import { GetRandomArray, doc, print_agents_rl } from "../helpers/funcs_print";
import AgentsTable from "../comps/AgentsTable";
import AgentsList from "../comps/AgentsList";
import TeamStats from "../comps/TeamStats";
import ActionButton from "../comps/ActionButton";
import * as SB from "../helpers/sb";
import { UserContext } from "../App";

export default function Equipes() {
  const [, , user] = useContext(UserContext);
  const [agents, setagents] = useState([]);
  const [agentsf, setagentsf] = useState([]);
  const [customAgents, setCustomAgents] = useState([]);
  const [isCustomList, setIsCustomList] = useState(false);

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
  const ref_all_mor = useRef();
  const ref_all_bnc = useRef();
  const ref_all_kay = useRef();
  const ref_all_cd_stuff = useRef();
  const ref_all_zh_stuff = useRef();
  const ref_all_sup = useRef();
  const ref_all_deq = useRef();
  const ref_int = useRef();
  const ref_agents_only_no_sup = useRef();

  const FILTERS = [
    { name: "GCK AGENTS", ref: ref_gck_agents },
    { name: "AGENTS ONLY, NO SUP", ref: ref_agents_only_no_sup },
    { name: "MOR AGENTS", ref: ref_mor_agents },
    { name: "FULL TEAM", ref: ref_full_team },
    { name: "ALL GCK STUFF", ref: ref_all_gck_stuff },
    { name: "ALL MOR", ref: ref_all_mor },
    { name: "ALL BINIC", ref: ref_all_bnc },
    { name: "ALL KAYTRADING", ref: ref_all_kay },
    { name: "ALL CD GCK STUFF", ref: ref_all_cd_stuff },
    { name: "ALL ZH GCK STUFF", ref: ref_all_zh_stuff },
    { name: "ALL DEQ", ref: ref_all_deq },
    { name: "ALL SUPERVISORS", ref: ref_all_sup },
    { name: "INTERPRETES", ref: ref_int },
  ];

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    setloading(true);

    let items = await LoadAllItems(TABLES_NAMES.AGENTS);

    items = items.filter((it, i) => it.active === "OUI");

    items = items.sort(CustomSortByListPriority);

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
      const bnc = ag.contrat === "BNC";
      const kay = ag.contrat === "KAY";

      const equipe_section = by_equipe && by_section;
      const eq_sec_gck = equipe_section && gck;
      const eq_sec_mor = equipe_section && mor;
      const all_gck = gck;
      const all_zh = all_gck && zh;
      const all_cd = all_gck && cd;
      const all_mor = mor;
      const all_bnc = bnc;
      const all_kay = kay;
      const all_sup =
        all_gck && !zh && ag.poste === "SUP" && ag.section === "ENSACHAGE";
      const agents_only_no_sup = ag.poste !== "SUP" && equipe_section;
      const interpretes_only = ag.poste === "INT";
      const all_deq = ag.chef_deq === "OUI";

      if (filter) {
        if ("GCK AGENTS" === filter.name) {
          set_list_title("AGENTS GCK");
          return eq_sec_gck;
        }
        if ("MOR AGENTS" === filter.name) return eq_sec_mor;
        if ("FULL TEAM" === filter.name) return equipe_section;
        if ("ALL CHINESE STUFF" === filter.name) return all_zh;
        if ("ALL GCK STUFF" === filter.name) return all_gck;
        if ("ALL MOR" === filter.name) return all_mor;
        if ("ALL BINIC" === filter.name) return all_bnc;
        if ("ALL KAYTRADING" === filter.name) return all_kay;
        if ("ALL CD GCK STUFF" === filter.name) return all_cd;
        if ("ALL ZH GCK STUFF" === filter.name) return all_zh;
        if ("ALL SUPERVISORS" === filter.name) return all_sup;
        if ("ALL DEQ" === filter.name) return all_deq;
        if ("AGENTS ONLY, NO SUP" === filter.name) return agents_only_no_sup;
        if ("INTERPRETES" === filter.name) return interpretes_only;
      }

      return equipe_section;
    });

    return items;
  }

  function CheckAgentRLDData(agent, y, m) {
    const { id: agent_id } = agent;

    let mc = `mc_${agent_id}_${y}_${m}`;

    const roulement_data = rld.find((it, i) => it.month_code === mc);

    agent.rld = roulement_data;

    if (roulement_data === undefined) {
      //console.error(`rld for ${mc} is undefinded`);
      const data = { rl: [...Array(31).fill("-")].join(""), month_code: mc };
      agent.rld = data;
    } else {
      console.info(`rld for ${mc}\n`, agent);
    }

    return agent;
  }

  const CheckAgentRoulementData = (agent, i, arr, y, m) => {
    //console.log("old ag", agent);
    const final_agent = { ...CheckAgentRLDData(agent, y, m) };
    //console.log("new ag", final_agent);

    return final_agent;
  };

  function onFilterAgents(e) {
    setagentsf([]);
    setDaysLetters([]);

    let y = ref_year.current.value;
    let m = ref_month.current.value;

    const dl = getRouelemtDaysLetters2(y, m);

    setDaysLetters(dl);

    const section = ref_section.current.value;
    const equipe = ref_equipe.current.value;

    const table_name = `${EQUIPES_NAMES[equipe] || equipe}, ${section}`;

    setCustomTableName(table_name);

    ref_sp_section.current.textContent = section;
    ref_sp_equipe.current.textContent = equipe;
    ref_sp_y.current.textContent = y;
    ref_sp_m.current.textContent = MONTHS[m];

    const arr_agents = FilterAgents(agents, section, equipe, selectedFilter);
    let arr_agents_with_rld = arr_agents.map((agent, index, arr) =>
      CheckAgentRoulementData(agent, index, arr, y, m)
    );
    const custom_arr_with_rld = customAgents.map((agent, index, arr) =>
      CheckAgentRoulementData(agent, index, arr, y, m)
    );

    let fianl_data = [...arr_agents_with_rld];

    fianl_data.sort(CustomSortByListPriority);

    //console.log("ksort", fianl_data);

    setagentsf(fianl_data);
    setCustomAgents(custom_arr_with_rld);
  }

  useEffect(() => {
    onFilterAgents();
  }, [selectedFilter]);

  function onSetFilter(e) {
    setSelectedFilter(e);
  }

  function onAgentClick(ag) {
    let y = ref_year.current.value;
    let m = ref_month.current.value;
    const agent_to_add = CheckAgentRLDData(ag, y, m);
    const agentsfz = agentsf[0];

    //if(customAgents && customAgents.length > 0){
    const exists =
      parseInt(customAgents.filter((it) => it.id === agent_to_add.id).length) >
      0;

    if (!exists) {
      setCustomAgents((old) => [...old, agent_to_add]);
    } else {
      alert(`Agent ${agent_to_add.nom}, already added!`);
    }

    //}
  }

  const [showFilters, setShowFilters] = useState(false);
  const [customTableName, setCustomTableName] = useState();

  function onCustomAgentClick(ag) {
    if (window.confirm(`Remove agent : ${ag.nom} from list?`)) {
      setCustomAgents((old_agl) => old_agl.filter((it) => it.id !== ag.id));
    }
  }

  async function onClearTeam() {
    if (window.confirm("Remove all agents in this team?")) {
      try {
        const promises = agentsf.map((it) =>
          SB.UpsertItem(TABLES_NAMES.AGENTS, { id: it.id, equipe: "-" }, "id")
        );

        const res = await Promise.all(promises);

        console.log(res);
      } catch (e) {
        alert("Error:\n" + JSON.stringify(e));
        console.log(e);
      }
    }
  }

  return (
    <div>
      <Loading isLoading={loading} />

      <div className=" md:flex ">
        {!loading && (
          <>
            <div>
              <div>
                <div>
                  {" "}
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const isCustom = e.target.checked;
                      setIsCustomList(isCustom);
                      if (isCustom) {
                        // setCustomAgents((old) => [...old, ...agentsf]);
                      }
                    }}
                  />
                  Custom List{" "}
                </div>

                <div>
                  <button
                    className={CLASS_BTN}
                    onClick={(e) => {
                      if (window.confirm("Clear custom list?")) {
                        setCustomAgents([]);
                        alert("Custom list cleared");
                      }
                    }}
                  >
                    CLEAR CUSTOM LIST
                  </button>
                </div>
              </div>

              <div
                className={` ${CLASS_INPUT_TEXT} outline-none w-fit mb-1 ${
                  isCustomList ? "block" : "hidden"
                } `}
              >
                <input
                  type="text"
                  value={customTableName}
                  onChange={(e) =>
                    setCustomTableName(e.target.value.toUpperCase())
                  }
                  placeholder="list name"
                />
              </div>

              <div className={` ${isCustomList ? "hidden" : "block"} `}>
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
              </div>

              <div>
                <div>
                  <span className={CLASS_SELECT_TITLE}>YEAR:</span>
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
                  <span className={CLASS_SELECT_TITLE}>MONTH:</span>
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

                {UserHasAccessCode(user, ACCESS_CODES.ROOT) && (
                  <div>
                    <ActionButton
                      icon={null}
                      title={"CLEAR"}
                      onClick={onClearTeam}
                    />
                  </div>
                )}
              </div>

              <div className={` ${isCustomList ? "block" : "hidden"} `}>
                <AgentsList onAgentClick={onAgentClick} />
              </div>
            </div>
          </>
        )}

        <TeamStats agentsf={agentsf} />
      </div>

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
          isCustomList={isCustomList}
          customAgentsList={customAgents}
          customAgentsTableName={customTableName}
          onCustomAgentClick={onCustomAgentClick}
        />
      </div>
    </div>
  );
}
