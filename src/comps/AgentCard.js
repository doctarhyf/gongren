import React from "react";

export default function AgentCard({ agent }) {
  return (
    <section>
      {agent && (
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
                {Object.entries(agent).map((agent_data, i) => (
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
          <div className="flex">
            <button>VOIR ROULEMENT</button>
            <button>UPDATE</button>
          </div>
        </div>
      )}
      {agent === null && <div>Select an agent!</div>}
    </section>
  );
}
