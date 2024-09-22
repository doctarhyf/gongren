import { useQuery } from "@tanstack/react-query";
import { fetchAllItemFromTable } from "../api/queries";
import { useEffect, useState } from "react";
import { CLASS_INPUT_TEXT, POSTE, POSTES } from "../helpers/flow";

function FlatList({ items, itemSelected }) {
  const [data, setdata] = useState([]);
  const [selected, setselected] = useState();

  useEffect(() => {
    setdata(items);
  }, [items]);

  function filter() {}

  return (
    <div className="  ">
      {data.map((item, i) => (
        <div
          onClick={(e) => {
            setselected(item);
            itemSelected(item);
          }}
          key={i}
          className={` ${
            selected?.id === item.id && "bg-sky-500 text-white"
          } group p-1 border-b  hover:bg-sky-500 hover:text-white cursor-pointer `}
        >
          <div>
            {item.nom} {item.postnom}, {item.prenom}
          </div>
          <div
            className={` ${
              selected?.id === item.id && "text-slate-800 font-bold"
            } group-hover:text-slate-800  group-hover:font-bold text-xs text-gray-400  `}
          >
            {item.section} - Eq. {item.equipe}, {POSTES[item.poste].fr}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AgentList2({ onAgentClick }) {
  const [q, setq] = useState("");
  const queryAgents = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAllItemFromTable,
  });

  const { data, isLoading, isError, error } = queryAgents;

  if (isLoading) return <div>Loading ...</div>;
  if (isError) return <div>Error {JSON.stringify(error)}</div>;

  function onSearch(q) {
    setq(q.toLowerCase());
  }

  return (
    <div className="  w-full md:w-64 ">
      <input
        className={CLASS_INPUT_TEXT}
        type="text"
        value={q}
        onChange={(e) => onSearch(e.target.value)}
      />
      <FlatList items={data} itemSelected={(it) => onAgentClick(it)} />
    </div>
  );
}
