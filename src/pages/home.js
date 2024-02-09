import React, { useEffect, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "../comps/Loading";
import { GroupBySectionAndEquipe } from "../helpers/func";

export default function Home() {
  const [agents, setagents] = useState([]);
  const [loading, setloading] = useState(false);
  const [agents_by_teams, set_agents_by_teams] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setloading(true);
    set_agents_by_teams({});

    let agents = await SB.LoadAllItems(TABLES_NAMES.AGENTS);

    let agents_grouped_by_teams = GroupBySectionAndEquipe(agents);

    console.log(agents_grouped_by_teams);

    const rlds = await SB.LoadAllItems(TABLES_NAMES.AGENTS_RLD);

    const agents_with_rld = agents.map((agent, i) => {
      let rld = rlds.find((it, i) => it.agent_id === agent.id);

      if (rld) {
        agent.rld = rld;
        //console.log(agent.id);
      } else {
        agent.rld = {
          rl: "--------------------------------",
          agent_id: agent.id,
        };
      }

      return agent;
    });

    set_agents_by_teams(agents_grouped_by_teams);
    setagents(agents_with_rld);
    setloading(false);
  }

  return (
    <div className="md:w-[980pt] md:mx-auto ">
      <Loading isLoading={loading} />
      <div>Agents count : {agents.length}</div>
      <div className="w-fit ">
        {Object.entries(agents_by_teams).map((section, i) => (
          <details>
            <summary className="cursor-pointer">{section[0]}</summary>
            <div>
              {Object.entries(section[1])
                .sort()
                .map((team, i) => (
                  <div className="ml-8">
                    Equipe {team[0]} : <b>{team[1].length}</b>
                  </div>
                ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
