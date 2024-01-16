import React, { useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import AgentCard, { AGENT_CARD_EVENT } from "../comps/AgentCard";
import AgentsList from "../comps/AgentsList";
import FormAddAgent from "../comps/FormAddAgent";
import Loading from "../comps/Loading";

export default function Agents() {
  const [curAgent, setCurAgent] = useState(null);
  const [showFormAddNewAgent, setShowFormAddNewAgent] = useState(false);
  const [updateKey, setUpdateKey] = useState();
  const [agentCardEditMode, setAgentCardEditMode] = useState(false);
  const [showAgentDetails, setShowAgentDetails] = useState(true);
  const [loading, setloading] = useState(false);

  function onShowRoulement() {
    console.log("On Show Roulement ...");
  }

  function reloadComponents() {
    const rdk = Math.random();

    setUpdateKey(rdk);
    setCurAgent(null);
  }

  async function onSaveNewAgent(agent_data) {
    setloading(true);
    reloadComponents();

    const res = await SB.InsertItem(TABLES_NAMES.AGENTS, agent_data);
    if (res === null) {
      alert(`Agent "${agent_data.nom} - ${agent_data.postnom}" saved!`);
      setShowFormAddNewAgent(false);
      setloading(false);
      return;
    }

    const error = `Error saving agent!\n ${JSON.stringify(res)}`;
    alert(error);
    console.log(error);
    setloading(false);
  }

  async function onUpdateAgent(agent_data) {
    console.log(agent_data);
  }

  function onFormNewAgentCancel() {
    setShowFormAddNewAgent(false);
  }

  function onAgentCardEvent(e, data) {
    console.log("onAgentCardEvent()", e, data);

    reloadComponents();

    let msg;

    switch (e) {
      case AGENT_CARD_EVENT.DELETED:
        msg = `Agent " ${data.nom} - ${data.prenom} " deleted successfully!`;
        break;

      case AGENT_CARD_EVENT.UPDATED:
        msg = `Agent " ${data.nom} - ${data.prenom} " updated successfully!`;
        break;
    }

    alert(msg);
    console.log(msg);
  }

  function onAgentClick(agent_data) {
    setCurAgent(agent_data);
    setShowFormAddNewAgent(false);
    setAgentCardEditMode(false);
  }
  return (
    <div>
      {!showFormAddNewAgent && (
        <div>
          <button
            onClick={(e) => setShowFormAddNewAgent(true)}
            className="p-1 rounded-md border my-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
          >
            NEW AGENT
          </button>
          <div>
            Show/Hide Details
            <input
              type="checkbox"
              className="toggle toggle-xs"
              checked={showAgentDetails}
              onChange={(e) => setShowAgentDetails(e.target.checked)}
            />
          </div>
        </div>
      )}

      {!showFormAddNewAgent && (
        <div className="flex ">
          <AgentsList
            key={updateKey}
            curAgent={curAgent}
            onAgentClick={(agent_data) => onAgentClick(agent_data)}
          />
          {showAgentDetails && (
            <AgentCard
              agentCardEditMode={agentCardEditMode}
              setAgentCardEditMode={setAgentCardEditMode}
              onShowRoulement={onShowRoulement}
              agent={curAgent}
              onAgentCardEvent={onAgentCardEvent}
            />
          )}
        </div>
      )}

      {showFormAddNewAgent && (
        <div>
          <Loading isLoading={loading} />
          <FormAddAgent
            onFormSave={onSaveNewAgent}
            onFormUpdate={onUpdateAgent}
            onFormCancel={onFormNewAgentCancel}
          />
        </div>
      )}
    </div>
  );
}
