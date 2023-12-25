import React, { useEffect, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import AgentCard from "../comps/AgentCard";
import AgentsList from "../comps/AgentsList";

export default function Agents() {
  const [agents, setagents] = useState([]);
  const [agentsf, setagentsf] = useState([]);
  const [loading, setloading] = useState(false);
  const [curAgent, setCurAgent] = useState(null);

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    setloading(true);
    setagents([]);
    setagentsf([]);
    const items = await SB.LoadItems(TABLES_NAMES.AGENTS);
    setagents(items);
    setagentsf(items);
    setloading(false);

    //console.log(items);
  }

  return (
    <div className="flex ">
      <AgentsList onAgentClick={setCurAgent} agents={agentsf} />
      <AgentCard agent={curAgent} />
    </div>
  );
}
