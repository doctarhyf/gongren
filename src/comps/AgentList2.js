import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { fetchAllItemFromTable } from "../api/queries";
import { CLASS_INPUT_TEXT, POSTES } from "../helpers/flow";
import Loading from "./Loading";
import { UserContext } from "../App";
import {
  GetTransForTokenName,
  GetTransForTokensArray,
  LANG_TOKENS,
} from "../helpers/lang_strings";

function FlatList({ items, renderItem, perpage, q }) {
  //
  const [data, setdata] = useState([]);
  const [dataf, setdataf] = useState([]);
  const [curpage, setcurpage] = useState(0);
  const [numpages, setnumpages] = useState(1);
  const [activeOnly, setActiveOnly] = useState(true);
  const [, , user] = useContext(UserContext);

  useEffect(() => {
    setdata(items);
    setnumpages(Math.ceil(items.length / perpage));
    setdataf([...items].slice(0, 10));
  }, [items]);

  useEffect(() => {
    initSlice(activeOnly);
  }, [curpage, data, activeOnly]);

  useEffect(() => {
    if (curpage > numpages) {
      setcurpage(0);
    }
  }, [numpages]);

  function initSlice(activeOnly) {
    let a = [...data];
    if (activeOnly) a = a.filter((it) => it.active === "OUI");
    const numpages = Math.ceil(a.length / perpage);
    setnumpages(numpages);
    const start = curpage * perpage;
    const end = curpage * perpage + perpage;
    const af = a.slice(start, end);

    setdataf([...af]);
  }

  useEffect(() => {
    if (q.trim() === "") {
      initSlice(activeOnly);
      return;
    }

    let af = data.filter((it) => {
      const qlc = q.toLowerCase().trim();
      const nom = it.nom.toLowerCase();
      const postnom = it.postnom.toLowerCase();
      const prenom = it.prenom.toLowerCase();
      const mingzi = it.mingzi;

      const fullname = `${nom} ${postnom} ${prenom}`;
      const cfullname = fullname.includes(qlc);
      const cmingzi = mingzi.includes(qlc);
      const cmat = it.matricule.toLowerCase().includes(qlc);

      return cfullname || cmat || cmingzi;
    });

    let aff = [...af];

    if (activeOnly) aff = aff.filter((it) => it.active === "OUI");

    setdataf([...aff]);
  }, [q]);

  return (
    <div className="  ">
      <select
        className={CLASS_INPUT_TEXT}
        value={curpage}
        onChange={(e) => setcurpage(e.target.value)}
      >
        {[...Array(numpages).fill(0)].map((it, i) => (
          <option key={i} value={i}>
            {GetTransForTokensArray(LANG_TOKENS.Page, user.lang, { p: i + 1 })}
          </option>
        ))}
      </select>
      <div>
        <input
          defaultChecked
          type="checkbox"
          value={activeOnly}
          onChange={(e) => setActiveOnly(e.target.checked)}
        />{" "}
        {GetTransForTokensArray(LANG_TOKENS.SHOW_ONLY_ACTIVE, user.lang)}
      </div>
      <div>
        {dataf.map((item, i) => renderItem(item, i + curpage * perpage + 1))}
      </div>
    </div>
  );
}

function Agents2teams(agents = []) {
  let teams = {};

  agents.forEach((it) => {
    const { section, equipe } = it;

    const path = `${section} ${equipe}`;

    if (!!teams[path]) {
      teams[path].push(it);
    } else {
      teams[path] = [it];
    }
  });

  return teams;
}

export default function AgentList2({
  onAgentClick,
  selectedAgents = [],
  showToggleTeamsView,
}) {
  const [selected, setselected] = useState();
  const [teamMode, setTeamMode] = useState(false);
  const [, , user] = useContext(UserContext);
  const [q, setq] = useState("");

  const queryAgents = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAllItemFromTable,
  });

  const { data: agents, isLoading, isError, error } = queryAgents;

  if (isLoading)
    return (
      <div>
        <Loading isLoading={true} />
      </div>
    );
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
        className={`
          
          ${
            selectedAgents.map((it) => it.id).includes(item.id) &&
            " bg-sky-900/20 border border-sky-700   "
          }
          

          ${
            selected?.id === item.id &&
            !selectedAgents.map((it) => it.id).includes(item.id) &&
            "text-white"
          }

          ${
            selected?.id === item.id && "bg-sky-500 "
          } group p-1 border-b  hover:bg-sky-500 hover:text-white cursor-pointer `}
      >
        <div>
          {idx}. {item.nom} {item.postnom}, {item.prenom}
        </div>
        <div
          className={` ${
            selected?.id === item.id && "text-slate-800 font-bold"
          } group-hover:text-slate-800  group-hover:font-bold text-xs text-gray-400  `}
        >
          {GetTransForTokenName(item.section, user.lang)} -{" "}
          {GetTransForTokensArray(LANG_TOKENS.EQ, user.lang)}.{" "}
          {GetTransForTokenName(item.equipe, user.lang)},{" "}
          {GetTransForTokenName(item.poste, user.lang)}
        </div>
      </div>
    );
  }

  function onItemSelected(it) {
    //console.log(it);
    //(it) => onAgentClick(it);
  }

  return (
    <div className="  w-full md:w-64 ">
      <input
        className={`  ${CLASS_INPUT_TEXT} w-full `}
        type="text"
        value={q}
        onChange={(e) => onSearch(e.target.value)}
      />

      <FlatList
        q={q}
        perpage={10}
        items={agents}
        onItemSelected={onItemSelected}
        renderItem={renderItem}
      />
    </div>
  );
}
