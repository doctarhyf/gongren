import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchAllItemFromTable } from "../api/queries";
import { CLASS_INPUT_TEXT, POSTES } from "../helpers/flow";

function FlatList({ items, renderItem, perpage, q }) {
  //
  const [data, setdata] = useState([]);
  const [dataf, setdataf] = useState([]);
  const [curpage, setcurpage] = useState(0);
  const [numpages, setnumpages] = useState(1);

  useEffect(() => {
    setdata(items);

    setdataf([...items].slice(0, 10));
  }, [items]);

  useEffect(() => {
    const a = [...data];
    const start = curpage * perpage;
    const end = curpage * perpage + perpage;
    const af = a.slice(start, end);

    setdataf([...af]);
  }, [curpage, data]);

  useEffect(() => {
    const af = data.filter((it) => {
      const cnom = it.nom.toLowerCase().includes(q.toLowerCase());
      const cpostnom = it.postnom.toLowerCase().includes(q.toLowerCase());
      const cprenom = it.prenom.toLowerCase().includes(q.toLowerCase());

      return cnom || cpostnom || cprenom;
    });

    setdataf([...af]);
  }, [q]);

  return (
    <div className="  ">
      <select value={curpage} onChange={(e) => setcurpage(e.target.value)}>
        {[...Array(Math.ceil(items.length / perpage)).fill(0)].map((it, i) => (
          <option key={i} value={i}>
            Page {i + 1}
          </option>
        ))}
      </select>
      <div>{dataf.map((item, i) => renderItem(item))}</div>
    </div>
  );
}

export default function AgentList2({ onAgentClick }) {
  const [selected, setselected] = useState();
  const [curitem, setcuritem] = useState(0);
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

  function renderItem(item, idx) {
    return (
      <div
        onClick={(e) => {
          setselected(item);
          onAgentClick(item);
        }}
        key={item?.id}
        className={` ${
          selected?.id === item.id && "bg-sky-500 text-white"
        } group p-1 border-b  hover:bg-sky-500 hover:text-white cursor-pointer `}
      >
        <div>
          {item.idx}. {item.nom} {item.postnom}, {item.prenom}
        </div>
        <div
          className={` ${
            selected?.id === item.id && "text-slate-800 font-bold"
          } group-hover:text-slate-800  group-hover:font-bold text-xs text-gray-400  `}
        >
          {item.section} - Eq. {item.equipe}, {POSTES[item.poste].fr}
        </div>
      </div>
    );
  }

  return (
    <div className="  w-full md:w-64 ">
      <input
        className={CLASS_INPUT_TEXT}
        type="text"
        value={q}
        onChange={(e) => onSearch(e.target.value)}
      />
      <FlatList
        q={q}
        perpage={10}
        items={data}
        onItemSelected={(it) => onAgentClick(it)}
        renderItem={renderItem}
      />
    </div>
  );
}
