import React, { useContext, useEffect, useRef, useState } from "react";

import { UserContext } from "../App";
import ActionButton from "../comps/ActionButton";
import AgentsList from "../comps/AgentsList";
import AgentsTable from "../comps/AgentsTable";
import Loading from "../comps/Loading";
import TeamStats from "../comps/TeamStats";
import {
  ACCESS_CODES,
  CLASS_INPUT_TEXT,
  CLASS_SELECT,
  CLASS_SELECT_TITLE,
  EQUIPES,
  EQUIPES_NAMES,
  MONTHS,
  SECTIONS,
} from "../helpers/flow";
import {
  CustomSortByListPriority,
  getRouelemtDaysLetters2,
  UserHasAccessCode,
} from "../helpers/func";
import * as SB from "../helpers/sb";
import { LoadAllItems } from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import eraser from "../img/eraser.png";

function AgentCard({ agent }) {
  return (
    agent && (
      <div className=" flex flex-col justify-center items-center gap-2 p-2 ">
        <div className=" w-8 h-8 md:w-10 md:h-10 bg-slate-600 rounded-full  "></div>
        <div>
          <div>{`${agent.nom} ${agent.postnom} ${agent.prenom}`}</div>
          <div>
            {agent.mingzi} - {agent.matricule}
          </div>
          <div className=" bg-slate-700 rounded-md text-xs  text-white inline-block p-1  ">
            {agent.poste}
            {agent.chef_deq === "OUI" && " - DEQ"}
          </div>
        </div>
      </div>
    )
  );
}

function AgentsMap({ agentsf }) {
  function findAgentsByPoste(agents, poste, unique = false) {
    let foundAgents = agents.filter((it) => it.poste === poste);

    if (foundAgents.length === 0) foundAgents = undefined;

    if (unique && Array.isArray(foundAgents) && foundAgents.length > 0)
      return foundAgents[0];

    return foundAgents;
  }

  const sup = findAgentsByPoste(agentsf, "SUP");
  const deq = [agentsf.find((it) => it.chef_deq === "OUI")];
  agentsf = agentsf.filter((it) => it.chef_deq === "NON" && it.poste !== "SUP");
  const ops = findAgentsByPoste(agentsf, "OPE");
  const aidops = findAgentsByPoste(agentsf, "AIDOP");
  const chargs = findAgentsByPoste(agentsf, "CHARG");
  const nets = findAgentsByPoste(agentsf, "NET");

  let chart = [sup, deq, ops, aidops, chargs, nets];

  console.log("b4 fil chart => ", chart);
  chart = chart.filter((it) => it !== undefined);

  console.log("afta fil chart => ", chart);

  return (
    <div className=" bg-slate-100   ">
      {chart &&
        chart.map((lev) => (
          <div className=" p-1 flex-wrap border-t border-t-slate-400 flex gap-4 justify-center items-center  ">
            {lev.map((agent) => (
              <AgentCard agent={agent} />
            ))}
          </div>
        ))}
    </div>
  );
}

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
  const [showTeamStats, setShowTeamStats] = useState(false);
  const [showMap, setShowMap] = useState(false);

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

  const FILTERS_KEYS = {
    GCK_AGENTS: { fr: "GCK AGENTS", zh: "正式工" },
    AGENTS_ONLY_NO_SUP: { fr: "AGENTS ONLY, NO SUP", zh: "不包括班长" },
    MOR_AGENTS: { fr: "MOR AGENTS", zh: "临时工" },
    FULL_TEAM: { fr: "FULL TEAM", zh: "全班" },
    ALL_GCK_STUFF: { fr: "ALL GCK STUFF", zh: "所有正式工" },
    ALL_MOR: { fr: "ALL MOR", zh: "所有临时工" },
    ALL_BINIC: { fr: "ALL BINIC", zh: "所有 BINIC 临时工" },
    ALL_KAYTRADING: { fr: "ALL KAYTRADING", zh: "所有 KAYTRADING 临时工" },
    ALL_CD_GCK_STUFF: { fr: "ALL CD GCK STUFF", zh: "所有刚方正式工" },
    ALL_ZH_GCK_STUFF: { fr: "ALL ZH GCK STUFF", zh: "所有中方正式工" },
    ALL_DEQ: { fr: "ALL DEQ", zh: "所有小班长" },
    ALL_SUPERVISORS: { fr: "ALL SUPERVISORS", zh: "所有班长" },
    INTERPRETES: { fr: "INTERPRETES", zh: "所有翻译" },
  };

  const FILTERS = [
    {
      name: FILTERS_KEYS.GCK_AGENTS.fr,
      ref: ref_gck_agents,
      zh: FILTERS_KEYS.GCK_AGENTS.zh,
    },
    {
      name: FILTERS_KEYS.AGENTS_ONLY_NO_SUP.fr,
      ref: ref_agents_only_no_sup,
      zh: FILTERS_KEYS.AGENTS_ONLY_NO_SUP.zh,
    },
    {
      name: FILTERS_KEYS.MOR_AGENTS.fr,
      ref: ref_mor_agents,
      zh: FILTERS_KEYS.MOR_AGENTS.zh,
    },
    {
      name: FILTERS_KEYS.FULL_TEAM.fr,
      ref: ref_full_team,
      zh: FILTERS_KEYS.FULL_TEAM.zh,
    },
    {
      name: FILTERS_KEYS.ALL_GCK_STUFF.fr,
      ref: ref_all_gck_stuff,
      zh: FILTERS_KEYS.ALL_GCK_STUFF.zh,
    },
    {
      name: FILTERS_KEYS.ALL_MOR.fr,
      ref: ref_all_mor,
      zh: FILTERS_KEYS.ALL_MOR.zh,
    },
    {
      name: FILTERS_KEYS.ALL_BINIC.fr,
      ref: ref_all_bnc,
      zh: FILTERS_KEYS.ALL_BINIC.zh,
    },
    {
      name: FILTERS_KEYS.ALL_KAYTRADING.fr,
      ref: ref_all_kay,
      zh: FILTERS_KEYS.ALL_KAYTRADING.zh,
    },
    {
      name: FILTERS_KEYS.ALL_CD_GCK_STUFF.fr,
      ref: ref_all_cd_stuff,
      zh: FILTERS_KEYS.ALL_CD_GCK_STUFF.zh,
    },
    {
      name: FILTERS_KEYS.ALL_ZH_GCK_STUFF.fr,
      ref: ref_all_zh_stuff,
      zh: FILTERS_KEYS.ALL_ZH_GCK_STUFF.zh,
    },
    {
      name: FILTERS_KEYS.ALL_DEQ.fr,
      ref: ref_all_deq,
      zh: FILTERS_KEYS.ALL_DEQ.zh,
    },
    {
      name: FILTERS_KEYS.ALL_SUPERVISORS.fr,
      ref: ref_all_sup,
      zh: FILTERS_KEYS.ALL_SUPERVISORS.zh,
    },
    {
      name: FILTERS_KEYS.INTERPRETES.fr,
      ref: ref_int,
      zh: FILTERS_KEYS.INTERPRETES.zh,
    },
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
        if (FILTERS_KEYS.GCK_AGENTS.fr === filter.name) {
          set_list_title("AGENTS GCK");
          return eq_sec_gck;
        }
        if (FILTERS_KEYS.MOR_AGENTS.fr === filter.name) return eq_sec_mor;
        if (FILTERS_KEYS.FULL_TEAM.fr === filter.name) return equipe_section;
        if (FILTERS_KEYS.ALL_ZH_GCK_STUFF.fr === filter.name) return all_zh;
        if (FILTERS_KEYS.ALL_GCK_STUFF.fr === filter.name) return all_gck;
        if (FILTERS_KEYS.ALL_MOR.fr === filter.name) return all_mor;
        if (FILTERS_KEYS.ALL_BINIC.fr === filter.name) return all_bnc;
        if (FILTERS_KEYS.ALL_KAYTRADING.fr === filter.name) return all_kay;
        if (FILTERS_KEYS.ALL_CD_GCK_STUFF.fr === filter.name) return all_cd;
        if (FILTERS_KEYS.ALL_ZH_GCK_STUFF.fr === filter.name) return all_zh;
        if (FILTERS_KEYS.ALL_SUPERVISORS.fr === filter.name) return all_sup;
        if (FILTERS_KEYS.ALL_DEQ.fr === filter.name) return all_deq;
        if (FILTERS_KEYS.AGENTS_ONLY_NO_SUP.fr === filter.name)
          return agents_only_no_sup;
        if (FILTERS_KEYS.INTERPRETES.fr === filter.name)
          return interpretes_only;
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

    if (ref_sp_section.current) ref_sp_section.current.textContent = section;
    if (ref_sp_equipe.current) ref_sp_equipe.current.textContent = equipe;
    if (ref_sp_y.current) ref_sp_y.current.textContent = y;
    if (ref_sp_m.current) ref_sp_m.current.textContent = MONTHS[m];

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
                <input
                  type="checkbox"
                  className="toggle toggle-xs"
                  defaultChecked={isCustomList}
                  onChange={(e) => setIsCustomList(e.target.checked)}
                />
                Custom List
              </div>

              <div
                className={` border border-slate-200  bg-slate-100/50 p-2 rounded-md  outline-none w-fit mb-1 ${
                  isCustomList ? "block" : "hidden"
                } `}
              >
                <input
                  className={` ${CLASS_INPUT_TEXT} `}
                  type="text"
                  value={customTableName}
                  onChange={(e) =>
                    setCustomTableName(e.target.value.toUpperCase())
                  }
                  placeholder="LIST TITLE"
                />
                <div>
                  <ActionButton
                    icon={eraser}
                    title={"Clear Custom List"}
                    onClick={(e) => {
                      if (window.confirm("Clear custom list?")) {
                        setCustomAgents([]);
                        alert("Custom list cleared");
                      }
                    }}
                  />
                </div>
              </div>

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
                      <option
                        key={i}
                        value={i}
                        selected={i === new Date().getMonth() - 1}
                      >
                        {MONTHS[i]}
                      </option>
                    ))}
                  </select>
                </div>

                {UserHasAccessCode(user, ACCESS_CODES.ROOT) && (
                  <div>
                    {!isCustomList && (
                      <ActionButton
                        icon={null}
                        title={"CLEAR CURRENT TEAM"}
                        onClick={onClearTeam}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className={` ${isCustomList ? "block" : "hidden"} `}>
                <AgentsList onAgentClick={onAgentClick} />
              </div>
            </div>
          </>
        )}
      </div>

      <div className=" ">
        <div>
          <div>
            <input
              type="checkbox"
              className="toggle toggle-xs"
              defaultChecked={showTeamStats}
              onChange={(e) => setShowTeamStats(e.target.checked)}
            />
            Team Stats
          </div>
          {showTeamStats && (
            <div
              className={` ${
                showTeamStats &&
                "  border border-slate-200  bg-slate-100/50 p-2 "
              } `}
            >
              {" "}
              <TeamStats agentsf={agentsf} />{" "}
            </div>
          )}
        </div>

        <div className={`   `}>
          <div>
            <input
              type="checkbox"
              className="toggle toggle-xs"
              defaultChecked={showTeamStats}
              onChange={(e) => setShowFilters(e.target.checked)}
            />
            Team Filters
          </div>

          <select
            className={` ${CLASS_SELECT}  ${
              showFilters
                ? "block  border border-slate-200  bg-slate-100/50 p-2   "
                : "hidden"
            }    `}
            onChange={(e) =>
              onSetFilter(FILTERS.filter((it) => it.name === e.target.value)[0])
            }
          >
            {FILTERS.map((f, i) => (
              <option
                value={f.name}
                selected={selectedFilter && f.name === selectedFilter.name}
                key={i}
              >
                {f.name} -{" "}
                <span className=" inline-block text-xs bg-black text-white rounded-md p-1  ">
                  {f.zh}
                </span>
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <input
          type="checkbox"
          className="toggle toggle-xs"
          defaultChecked={showMap}
          onChange={(e) => setShowMap(e.target.checked)}
        />
        Show Map
      </div>

      <div>
        {showMap ? (
          <div>
            <AgentsMap agentsf={agentsf} />
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
