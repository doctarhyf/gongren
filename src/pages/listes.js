import React, { useRef, useState } from "react";
import AgentsList from "../comps/AgentsList";
import { GeneratePDF } from "../helpers/func";
import { CLASS_BTN, CLASS_TD } from "../helpers/flow";
import pdf from "../img/pdf.png";

export default function Listes() {
  const [agents, setagents] = useState([]);
  const ref_title = useRef();

  function onAgentClick(ag) {
    console.log(ag);
    setagents((old) => {
      let i = old.findIndex((it, i) => it.id === ag.id);
      if (i === -1) return [...old, ag];
      alert(`Agent "${ag.nom} ${ag.postnom}" already added!`);
      return old;
    });
  }

  function printPDF(agents) {
    if (agents.length === 0) {
      const msg = "Agents list cant be empty!";
      alert(msg);
      throw new Error(msg);
      return;
    }

    const names_list = agents.map((el, i) => {
      let name = `${el.nom} ${el.postnom}`;
      return name;
    });

    const list_title = ref_title.current.value;
    GeneratePDF(names_list, list_title);
  }

  function onDelAgent(ag) {
    const yes = window.confirm(
      `Remove " ${ag.nom} ${ag.postnom} ${ag.prenom} " ?`
    );
    let newd = [];
    if (yes) {
      agents.forEach((it, i) => {
        if (it.id !== ag.id) {
          newd.push(it);
        }
      });
      setagents(newd);
    }
  }

  function onTeamClick(team) {
    console.log(team);

    team.forEach((ag, i) => {
      setagents((old) => {
        let i = old.findIndex((it, i) => it.id === ag.id);
        if (i === -1) return [...old, ag];
        console.log(`Agent "${ag.nom} ${ag.postnom}" already added!`);
        return old;
      });
    });
  }

  return (
    <div className="flex">
      <div>
        <div className="text-green-500">Click on name to add it</div>
        <AgentsList onTeamClick={onTeamClick} onAgentClick={onAgentClick} />
      </div>
      <div>
        <div className="font-bold">Count : {agents.length}</div>
        <div>
          <div>Liste title:</div>
          <div>
            <input
              placeholder="Nom de l'equipe"
              className={CLASS_TD}
              type="text"
              ref={ref_title}
            />
          </div>
        </div>
        <div className="flex">
          <button
            onClick={(e) => printPDF(agents)}
            className={`${CLASS_BTN} flex text-sm my-2`}
          >
            <img src={pdf} width={20} height={30} /> IMPRIMER PDF
          </button>
          <button
            onClick={(e) => {
              if (window.confirm("Clear all data?")) {
                setagents([]);
              }
            }}
            className={`${CLASS_BTN} flex text-sm my-2`}
          >
            <img src={pdf} width={20} height={30} /> CLEAR
          </button>
        </div>
        <div className="text-red-500">Click on name to remove it</div>
        <div>
          {agents.map((it, i) => (
            <div
              onClick={(e) => onDelAgent(it)}
              className="px-2 py-1 border-2
             hover:border-red-600
             rounded-full
             border-transparent
             hover:bg-red-200 hover:text-red-500 cursor-pointer"
            >
              {`${i + 1}. ${it.nom} ${it.postnom}`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
