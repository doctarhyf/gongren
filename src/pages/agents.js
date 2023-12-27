import React, { useEffect, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import AgentCard from "../comps/AgentCard";
import AgentsList from "../comps/AgentsList";
import FormAddAgent from "../comps/FormAddAgent";

export default function Agents() {
  const [curAgent, setCurAgent] = useState(null);
  const [showFormAddNewAgent, setShowFormAddNewAgent] = useState(false);

  function onShowRoulement() {
    console.log("On Show Roulement ...");
  }

  async function onSaveNewAgent(agent_data) {
    //setShowFormAddNewAgent(false);

    /* let res = await SB.InsertItem(TABLES_NAMES.AGENTS, agent_data);

    if (res === null) {
      onFormNewAgentCancel();
      alert("Agent added!");
    } else {
      alert(res);
    } */
    console.log("save agent ", agent_data);
  }

  async function onUpdateAgent(agent_data) {
    console.log(agent_data);

    /*let res = await SB.UpdateItem(TABLES_NAMES.AGENTS, agent_data);

    if (res === null) {
      onFormNewAgentCancel();
      alert("Agent added!");
    } else {
      alert(res);
    }*/
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
        <FormAddAgent
          onFormSave={onSaveNewAgent}
          onFormUpdate={onUpdateAgent}
          onFormCancel={onFormNewAgentCancel}
        />
      )}
    </div>
  );
}
