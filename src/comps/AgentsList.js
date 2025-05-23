import React, { useContext, useEffect, useState } from "react";
import Loading from "./Loading";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import AgentsNamesTable from "./AgentsNamesTable";
import shield from "../img/shield.png";
import {
  CustomSortByListPriority,
  GroupBySectionAndEquipe,
} from "../helpers/func";
import { GetTransForTokensArray, LANG_TOKENS } from "../helpers/lang_strings";
import { UserContext } from "../App";

function SavedAgentsList({ agents, lists, onSavedAgentsSelected }) {
  function onListSelected(e) {
    const list_data = e.target.value;

    if (list_data === "N/A") {
      return;
    }
    onSavedAgentsSelected(agents, list_data);
    console.log("fucking", list_data);
  }
  return (
    <div>
      <div className=" text-sm font-bold">
        <select onChange={onListSelected}>
          <option key={-1} value={"N/A"}>
            - Selected list -
          </option>
          {lists.map((list, i) => (
            <option key={i} value={JSON.stringify(list)}>
              {list.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function AgentsList({
  onAgentClick,
  curAgent,
  onTeamClick,
  showToggleTableMode,
  showToggleTeamsView,
  onlyActive = true,
  perPage = 10,
  onlyShowCurrentAgent,
  onCustomListSelected,
}) {
  const [q, setq] = useState("");

  const [, , user] = useContext(UserContext);
  const [agents, setagents] = useState([]);
  const [agentsf, setagentf] = useState([]);
  const [curPage, setCurPage] = useState(1);
  const [loading, setloading] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [showNamesInTable, setshowNamesInTable] = useState(false);
  const [showTeamMode, setShowTeamMode] = useState(false);
  const [teams, setteams] = useState([]);
  const [showOnlyActive, setShowOnlyActive] = useState(onlyActive);
  const [custom_agents_list, set_custom_agents_list] = useState([]);

  useEffect(() => {
    loadAgents(onlyShowCurrentAgent);
  }, [showOnlyActive, onlyShowCurrentAgent]);

  useEffect(() => {
    loadCustomAgentsList();
  }, []);

  async function loadCustomAgentsList() {
    setloading(true);
    set_custom_agents_list([]);
    const lists = await SB.LoadAllItems(TABLES_NAMES.CUSTOM_AGENTS_LISTS);

    if (lists.length === 0) {
      setloading(false);
      return;
    }

    const nl = lists.map((l) => ({
      id: l.id,
      name: l.list_name,
      ids: l.list_ids.split(","),
    }));

    // console.log("lists : ", nl);
    set_custom_agents_list(nl);

    // console.log(lists);
    setloading(false);
  }

  function GetSplittedItemsIntoPages(items_raw, items_per_page) {
    let items = [];
    let i = 1;
    let pg = 1;

    while (items_raw.length > 0) {
      if (i > items_per_page) {
        i = 1;
        pg++;
      }
      let it = { ...items_raw.pop(), page: pg };
      i++;
      items.push(it);
    }

    return items;
  }

  async function loadAgents(matricule) {
    setloading(true);
    setagents([]);
    setagentf([]);
    setteams([]);
    let items_raw = await SB.LoadAllItems(TABLES_NAMES.AGENTS);

    // const showActive = showOnlyActive ? "OUI" : "NON";

    if (showOnlyActive) {
      items_raw = items_raw.filter((it, i) => it.active === "OUI");
    }

    if (matricule) {
      items_raw = items_raw.filter((it, i) => it.matricule === matricule);
      console.warn("Only showing : ", matricule);
    }
    console.log("Matr : ", matricule);

    setteams(GroupBySectionAndEquipe(items_raw));
    const items_len = items_raw.length;
    const num_pages = Math.ceil(items_len / perPage);
    setNumPages(num_pages);

    items_raw = items_raw.sort(CustomSortByListPriority);
    //console.log("atarow", items_raw[0]);
    let items = GetSplittedItemsIntoPages(items_raw, perPage);
    setagents(items);

    setagentf(items.slice(0, perPage));
    setloading(false);
  }

  function GetItemsAtPage(pg) {
    return agents.filter((it, i) => it.page === pg);
  }

  function onPageSelect(pg) {
    setCurPage(pg);
    setagentf(GetItemsAtPage(pg));
  }

  function onSearch(s = "") {
    let query = s.toLowerCase().trim();

    if (query === "") {
      setagentf(GetItemsAtPage(curPage));
      return;
    }

    let agents_filtered = agents.filter((agent, i) => {
      const qlc = query.toLowerCase();
      const nom = agent.nom.toLowerCase();
      const postnom = agent.postnom.toLowerCase();
      const prenom = agent.prenom.toLowerCase();
      const mingzi = agent.mingzi.toLowerCase();

      const fullname = `${nom} ${postnom} ${prenom}`;
      const cfullname = fullname.includes(qlc);
      const cmingzi = mingzi.includes(qlc);
      const cmat = agent.matricule.toLowerCase().includes(qlc);

      return cfullname || cmingzi || cmat;
    });

    setagentf(agents_filtered);
  }

  function onSavedAgentsSelected(agents, customList) {
    customList = JSON.parse(customList);
    const { id, name: list_name, ids } = customList;
    console.log("da fucking id:", customList);

    const agents_ids = ids.map((it) =>
      agents.find((a) => a.id === parseInt(it))
    );
    console.log(agents_ids);
    onCustomListSelected({ id: id, list_name, agents: agents_ids });
  }

  return (
    <section className="p-1  w-full md:w-min  ">
      <Loading isLoading={loading} />{" "}
      <div>
        <input
          className="mb-2  w-full md:w-min border-sky-500 outline-none border rounded-md p-1"
          type="search"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div>
        {GetTransForTokensArray(LANG_TOKENS.SHOW_ONLY_ACTIVE, user.lang)}
        <input
          type="checkbox"
          className="toggle toggle-xs"
          checked={showOnlyActive}
          onChange={(e) => setShowOnlyActive(e.target.checked)}
        />
      </div>
      {showToggleTableMode && (
        <div>
          TABLE MODE ON/OFF
          <input
            type="checkbox"
            className="toggle toggle-xs"
            checked={showNamesInTable}
            onChange={(e) => setshowNamesInTable(e.target.checked)}
          />
        </div>
      )}
      {showToggleTeamsView && (
        <div>
          TEAM ON/OFF
          <input
            type="checkbox"
            className="toggle toggle-xs"
            checked={showTeamMode}
            onChange={(e) => setShowTeamMode(e.target.checked)}
          />
        </div>
      )}
      <div className=" space-y-2 py-2 ">
        <div>SAVE LISTS</div>
        <SavedAgentsList
          agents={agents}
          lists={custom_agents_list}
          onSavedAgentsSelected={onSavedAgentsSelected}
        />
      </div>
      {!showTeamMode && (
        <div className="">
          {!showNamesInTable && (
            <div className="">
              {agentsf.map((agent, i) => (
                <button
                  onClick={(e) => onAgentClick(agent)}
                  key={i}
                  className={` block w-full hover:text-white hover:bg-sky-500 border border-neutral-50  p-2  rounded-md border-b-sky-300 hover:border-sky-500 cursor-pointer mb-1
            
            ${
              curAgent && agent.id === curAgent.id
                ? "text-white bg-sky-500 "
                : ""
            }
            
            `}
                >
                  <div className="flex   justify-between">
                    <div>
                      <div>
                        {agent.nom} {agent.postnom} {agent.prenom}{" "}
                        {agent.mingzi}
                      </div>
                      <div className="text-xs text-neutral-300">
                        <div>
                          {agent.section}, Eq.: {agent.equipe}, Mat.:
                          {agent.matricule}
                        </div>
                      </div>
                      {agent.chef_deq === "OUI" && (
                        <span className="mx-2">
                          <img src={shield} width={20} height={20} />
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {showNamesInTable && (
            <AgentsNamesTable
              curAgent={curAgent}
              agentsArray={agentsf}
              onAgentClick={(a) => onAgentClick(a)}
            />
          )}
        </div>
      )}
      {showTeamMode && (
        <div>
          {" "}
          {Object.entries(teams).map((section, i) => (
            <div>
              {Object.entries(section[1])
                .sort()
                .map((team, i) => (
                  <div
                    onClick={(e) => onTeamClick && onTeamClick(team[1])}
                    className=" p-1 border rounded-md my-1 hover:bg-sky-500 hover:text-white cursor-pointer"
                  >
                    {section[0]}, Equipe {team[0]} : {team[1].length}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
      {!showTeamMode && (
        <div className="text-center ">
          <div className="md:max-w-44">
            {[...Array(numPages).fill(0)].map((it, i) => (
              <button
                key={i}
                className={` text-sm mx-1 p-1 px-2 hover:bg-sky-400 hover:text-white border rounded-md ${
                  i + 1 === curPage ? "bg-sky-500 text-white" : ""
                } `}
                name="options"
                onClick={(e) => onPageSelect(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
