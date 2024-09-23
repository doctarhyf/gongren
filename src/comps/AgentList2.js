import { useQuery } from "@tanstack/react-query";
import { fetchAllItemFromTable } from "../api/queries";
import { useEffect, useState } from "react";
import { CLASS_INPUT_TEXT, POSTE, POSTES } from "../helpers/flow";

function FlatList({ items, renderItem, perpage }) {
  const [data, setdata] = useState([]);
  const [dataf, setdataf] = useState([]);
  const [curpage, setcurpage] = useState(0);
  const [numpages, setnumpages] = useState(1);

  useEffect(() => {
    const numpages = data.length / perpage;
    console.log("numpages => ", numpages);
    setnumpages(numpages);
  }, [data]);

  useEffect(() => {
    setdata(items);

    //console.log(curpage);

    const filtered = items.splice(
      curpage * perpage,
      perpage + perpage * curpage
    );

    setdataf(filtered);
    console.log("filtered => ", filtered);
  }, [perpage, items, curpage]);

  return (
    <div className="  ">
      <select value={curpage} onChange={(e) => setcurpage(e.target.value)}>
        {[...Array(dataf.length).fill(0)].map((it, i) => (
          <option key={i} value={i}>
            Page {i + 1}
          </option>
        ))}
      </select>
      <div>{dataf.map((item, i) => renderItem({ idx: i, ...item }))}</div>
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
          {item.id}. {item.nom} {item.postnom}, {item.prenom}
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
        perpage={10}
        items={data}
        onItemSelected={(it) => onAgentClick(it)}
        renderItem={renderItem}
      />
    </div>
  );
}
