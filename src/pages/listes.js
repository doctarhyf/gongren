import React, { useEffect, useRef, useState } from "react";
import AgentList2 from "../comps/AgentList2";
import ActionButton from "../comps/ActionButton";
import print from "../img/pdf.png";
import del from "../img/delete.png";
import { printTable } from "../helpers/print";
import { CLASS_INPUT_TEXT } from "../helpers/flow";
import AgentsList from "../comps/AgentsList";

export default function Listes() {
  const [agents, setagents] = useState([]);
  const [selagent, setselagent] = useState(undefined);
  const [propsToPrint, setPropsToPrint] = useState([
    "nom",
    "postnom",
    "prenom",
    "section",
    "equipe",
  ]);

  function onAgentClick(agent, showModal = true) {
    setselagent(agent);
    const idx = agents.findIndex((it) => agent.id === it.id);

    if (-1 === idx) {
      const new_agents = [...agents, agent];
      setagents(new_agents);
    } else {
      showModal && document.getElementById("my_modal_5").showModal();
    }
  }

  function removeAgent(agent) {
    setagents(agents.filter((it) => it.id !== agent.id));
  }

  const reftitle = useRef();

  function parseAgentsToPrintList(agents, selprops) {
    return agents.map((item) => {
      let el = [];
      selprops.map((prop) => {
        if (Object.keys(item).includes(prop)) el.push(item[prop]);
      });

      return el;
    });
  }

  function printList(agents, selprops) {
    const headers = [selprops];
    const title = listtitle;
    const data = parseAgentsToPrintList(agents, selprops);

    console.log(data);

    printTable(data, title, headers);
  }

  function onTeamClick(team) {
    let new_agents = [...agents];

    team.forEach((agent, i) => {
      const idx = agents.findIndex((it) => agent.id === it.id);

      if (-1 === idx) {
        new_agents.push(agent);
      }
    });

    setagents(new_agents);
  }

  const [listtitle, setlisttitle] = useState("LISTE AGENT CIMENTERIE");

  return (
    <div className=" container  ">
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            The agent {selagent?.nom} {selagent?.postnom} {selagent?.prenom}, is
            already in the list!
          </p>
          <p>Do you want to remove him?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
              <button className="btn" onClick={(e) => removeAgent(selagent)}>
                Remove{" "}
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <div>
        <div className="my-2 flex flex-wrap">
          {agents[0] &&
            Object.keys(agents[0]).map((prop, i) => (
              <span
                onClick={(e) => {
                  const idx = propsToPrint.findIndex((item) => item === prop);

                  if (-1 === idx) {
                    const nprops = [...propsToPrint, prop];
                    setPropsToPrint(nprops);
                  } else {
                    setPropsToPrint(propsToPrint.filter((it) => it !== prop));
                  }
                }}
                key={i}
                className={`

                ${propsToPrint.includes(prop) && "bg-sky-500 text-white"}

                  hover:bg-sky-500 hover:text-white  
                
                mb-1 cursor-pointer  p-1 border rounded-md mx-1  `}
              >
                <span>{prop}</span>
                <input type="checkbox" hidden />
              </span>
            ))}
        </div>
        <input
          type="text"
          placeholder="LISTE AGENTS CIMENTERIE"
          className={CLASS_INPUT_TEXT}
          value={listtitle}
          onChange={(e) => setlisttitle(e.target.value)}
        />

        <div className=" flex ">
          {/* <AgentList2 onAgentClick={onAgentClick} selectedAgents={agents} /> */}
          <AgentsList
            onAgentClick={onAgentClick}
            showToggleTeamsView
            onTeamClick={onTeamClick}
          />

          <div className=" bg-slate-700 text-white p-2 ">
            <ActionButton
              icon={print}
              onClick={(e) => printList(agents, propsToPrint)}
              title={"PRINT"}
            />
            <ActionButton
              icon={del}
              onClick={(e) => {
                if (window.confirm("Delete all agents")) {
                  setagents([]);
                }
              }}
              title={"CLEAR LIST"}
            />
            <div className=" font-bold text-xl underline  ">
              {listtitle} ({agents.length})
            </div>

            <table class="table-fixed">
              <thead>
                <tr>
                  {propsToPrint.map((prop) => (
                    <th>{prop}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {parseAgentsToPrintList(agents, propsToPrint).map((ag) => (
                  <tr>
                    {ag.map((it) => (
                      <td>{it}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
