import React, { useEffect, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import AgentCard from "../comps/AgentCard";
import AgentsList from "../comps/AgentsList";
import FormNewAgent from "../comps/FormNewAgent";

export default function Agents() {
  const [curAgent, setCurAgent] = useState(null);
  const [showFormAddNewAgent, setShowFormAddNewAgent] = useState(false);

  function onShowRoulement() {
    console.log("On Show Roulement ...");
  }

  function onFormNewAgentSave() {
    setShowFormAddNewAgent(false);
  }

  function onFormNewAgentCancel() {
    setShowFormAddNewAgent(false);
  }

  return (
    <div>
      {!showFormAddNewAgent && (
        <button
          onClick={(e) => setShowFormAddNewAgent(true)}
          className="p-1 rounded-md border my-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
        >
          NEW AGENT
        </button>
      )}

      {!showFormAddNewAgent && (
        <div className="flex ">
          <AgentsList curAgent={curAgent} onAgentClick={setCurAgent} />
          <AgentCard onShowRoulement={onShowRoulement} agent={curAgent} />
        </div>
      )}

      {showFormAddNewAgent && (
        <FormNewAgent
          onFormNewAgentSave={onFormNewAgentSave}
          onFormNewAgentCancel={onFormNewAgentCancel}
        />
      )}
    </div>
  );
}
