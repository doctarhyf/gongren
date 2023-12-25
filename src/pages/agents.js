import React, { useEffect, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";

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
      <section className="p-1  ">
        <div>
          <input
            className="mb-2 border-sky-500 outline-none border rounded-md p-1"
            type="search"
          />
        </div>
        <div>
          {" "}
          {agentsf.map((ag, i) => (
            <button
              onClick={(e) => setCurAgent(ag)}
              key={i}
              className=" block w-full hover:text-white hover:bg-sky-500  p-1 border rounded-md border-sky-300 hover:border-sky-500 cursor-pointer mb-1"
            >
              {ag.nom}
            </button>
          ))}
        </div>
      </section>
      <section>
        {curAgent && (
          <div className="agent-card p-2 border-neutral-400 border rounded-md ml-2">
            <div className="text-center">
              <img
                className="mx-auto"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpeN_JyQ6AUHZ3TGvJhlkL17RF6DYel89sNJ0D7rTHfg&s"
                width={80}
                height={80}
              />
            </div>
            <div>
              <table>
                <tbody>
                  {Object.entries(curAgent).map((agent_data, i) => (
                    <tr key={i}>
                      <td align="right" className="text-neutral-400 text-sm">
                        {agent_data[0]}
                      </td>
                      <td className="text-sky-500 p-1 font-bold ">
                        {agent_data[1]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {curAgent === null && <div>Select an agent!</div>}
      </section>
    </div>
  );
}
