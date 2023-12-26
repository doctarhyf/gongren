import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";

const PER_PAGE = 7;

export default function AgentsList({ onAgentClick, curAgent }) {
  const [q, setq] = useState("");

  const [agents, setagents] = useState([]);
  const [agentsf, setagentf] = useState([]);
  const [curPage, setCurPage] = useState(1);
  const [loading, setloading] = useState(false);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    loadAgents();
  }, []);

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

  async function loadAgents() {
    setloading(true);
    setagents([]);
    setagentf([]);
    const items_raw = await SB.LoadAllItems(TABLES_NAMES.AGENTS);
    const items_len = items_raw.length;
    const num_pages = Math.ceil(items_len / PER_PAGE);
    setNumPages(num_pages);

    let items = GetSplittedItemsIntoPages(items_raw, PER_PAGE);
    setagents(items);
    setagentf(GetItemsAtPage(1));

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
      const check_nom = agent.nom.toLowerCase().includes(query);

      return check_nom;
    });

    setagentf(agents_filtered);
  }

  return (
    <section className="p-1  ">
      <Loading isLoading={loading} />{" "}
      <div>
        <input
          className="mb-2 border-sky-500 outline-none border rounded-md p-1"
          type="search"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div>
        {agentsf.map((agent, i) => (
          <button
            onClick={(e) => onAgentClick(agent)}
            key={i}
            className={` block w-full hover:text-white hover:bg-sky-500  p-1 border rounded-md border-sky-300 hover:border-sky-500 cursor-pointer mb-1
            
            ${
              curAgent && agent.id === curAgent.id
                ? "text-white bg-sky-500 "
                : ""
            }
            
            `}
          >
            {agent.nom} - {agent.postnom}
          </button>
        ))}
      </div>
      <div className="text-center">
        <div className="max-w-44">
          {[...Array(numPages).fill(0)].map((it, i) => (
            <button
              key={i}
              className={` mx-1 p-1 px-2 hover:bg-sky-400 hover:text-white border rounded-md ${
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
    </section>
  );
}
