import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";

const NEXT_PAGE = "+";
const PREV_PAGE = "-";

export default function AgentsList({ onAgentClick, curAgent }) {
  const [q, setq] = useState("");
  const [agentsf, setagentf] = useState([]);
  const [curPage, setCurPage] = useState(1);
  const [agents, setagents] = useState([]);
  const [loading, setloading] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const per_page = 5;

  useEffect(() => {
    loadAgents(1);
  }, []);

  async function loadAgents(curPage) {
    setloading(true);
    setagents([]);

    const items = await SB.LoadItems(TABLES_NAMES.AGENTS, curPage);

    setNumPages(Number.parseInt(items.length) / Number.parseInt(per_page));
    setagents(items);
    setagentf(items);
    setloading(false);
  }

  function onSearch(s = "") {
    let query = s.toLowerCase().trim();

    if (query === "") {
      setagentf(agents);
      return;
    }

    let agents_filtered = agents.filter((agent, i) => {
      const check_nom = agent.nom.toLowerCase().includes(query);
      return check_nom;
    });

    setagentf(agents_filtered);
  }

  function onPageChange(op, num_pages) {
    num_pages = Number.parseInt(num_pages);

    setCurPage((old) => {
      console.log(old);
      let cur_page = Number.parseFloat(old);

      if (NEXT_PAGE === op) cur_page++;
      if (PREV_PAGE === op) cur_page--;

      /*   if (cur_page > num_pages) cur_page = 0;
      if (cur_page < 1) cur_page = num_pages; */

      loadAgents(cur_page);

      return cur_page;
    });
  }

  return (
    <section className="p-1  ">
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
      <div>
        <div className="join">
          <button
            className="join-item btn"
            onClick={(e) => onPageChange(PREV_PAGE, numPages)}
          >
            «
          </button>
          <button className="join-item btn">Page {curPage}</button>
          <button
            className="join-item btn"
            onClick={(e) => onPageChange(NEXT_PAGE, numPages)}
          >
            »
          </button>
        </div>
      </div>
      <Loading isLoading={loading} />{" "}
    </section>
  );
}
