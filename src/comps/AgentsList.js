import React from "react";

export default function AgentsList({ agents, onAgentClick }) {
  return (
    <section className="p-1  ">
      <div>
        <input
          className="mb-2 border-sky-500 outline-none border rounded-md p-1"
          type="search"
        />
      </div>
      <div>
        {" "}
        {agents.map((agent, i) => (
          <button
            onClick={(e) => onAgentClick(agent)}
            key={i}
            className=" block w-full hover:text-white hover:bg-sky-500  p-1 border rounded-md border-sky-300 hover:border-sky-500 cursor-pointer mb-1"
          >
            {agent.nom}
          </button>
        ))}
      </div>
    </section>
  );
}
