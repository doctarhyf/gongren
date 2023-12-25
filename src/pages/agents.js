import React, { useEffect, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import AgentCard from "../comps/AgentCard";
import AgentsList from "../comps/AgentsList";

export default function Agents() {
  const [curAgent, setCurAgent] = useState(null);

  return (
    <div className="flex ">
      <AgentsList curAgent={curAgent} onAgentClick={setCurAgent} />
      <AgentCard agent={curAgent} />
    </div>
  );
}
