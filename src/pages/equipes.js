import React, { useEffect, useRef, useState } from "react";

import {
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  CLASS_SELECT,
  CLASS_SELECT_TITLE,
  CLASS_TD,
  EQUIPES,
  K_POSTE_AIDE_OPERATEUR,
  K_POSTE_CHARGEUR,
  K_POSTE_NETTOYEUR,
  K_POSTE_OPERATEUR,
  MONTHS,
  SECTIONS,
} from "../helpers/flow";
import { LoadAllItems } from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import shield from "../img/shield.png";
import sup from "../img/sup.png";
import pdf from "../img/pdf.png";
import {
  CountAgentsByPostType,
  getDaysInMonth,
  getRouelemtDaysLetters,
  getRouelemtDaysLetters2,
  printPDF1,
} from "../helpers/func";
import Loading from "../comps/Loading";
import { GetRandomArray, doc, print_agents_rl } from "../helpers/funcs_print";
import AgentsTable from "../comps/AgentsTable";

/* function AgentsTable({
  agentsf,
  ref_sp_equipe,
  ref_sp_section,
  ref_sp_m,
  ref_sp_y,
  list_title,
  daysLetters,
}) {
  const COL_SPAN = 4;
  const nb_op = CountAgentsByPostType(agentsf, K_POSTE_OPERATEUR);
  const nb_charg = CountAgentsByPostType(agentsf, K_POSTE_CHARGEUR);
  const nb_net = CountAgentsByPostType(agentsf, K_POSTE_NETTOYEUR);
  const nb_aide_op = CountAgentsByPostType(agentsf, K_POSTE_AIDE_OPERATEUR);
  const chef_deq = agentsf.find((it, i) => it.chef_deq === "OUI");
  let daysCount = 31;

  if (agentsf.length > 0) {
    let ag = agentsf[0];

    const [mc, agent_id, y, m] = ag.rld.month_code.split("_");

    daysCount = new Date(Number(y), Number(m) + 1, 0).getDate();
  }

  function printPDF(agents_array) {
    if (agents_array.length === 0) {
      alert("Agents list cant be empty!");
      return;
    }

    printPDF1(agents_array);
  }

  function printAgentsRoulementPDF(agents_array) {
    if (agents_array.length === 0) {
      alert("Agents list cant be empty!");
      return;
    }

    const agents_rld_parsed_data = PrepareAgentsPrintRLD(agents_array); //GetRandomArray(20);
    print_agents_rl(agents_rld_parsed_data);
  }

  function PrepareAgentsPrintRLD(array) {
    if (array.length === 0) {
      alert("Error agents array must not have length of 0!");
      return;
    }

    const res = array.map((ag, index) => {
      let [mc, rl_id, y, m] = ag.rld.month_code.split("_");
      m = Number(m) + 1;
      y = Number(y);

      const num_days_in_month = getDaysInMonth(y, m, true);
      const rld = ag.rld.rl.slice(0, num_days_in_month);

      let ad = {
        nom: {
          fr: `${ag.nom} ${ag.postnom} ${ag.prenom}`,
          zh: ` ${ag.mingzi}`,
        },
        rld: rld,
        month: m,
        year: y,
        poste: ag.poste,
        id: index + 1,
        contrat: ag.contrat,
        matricule: ag.matricule, //matricule: "L0501",
      };

      return ad;
    });

    let ag_zero = { ...res[0] };
    const daysLetters = getRouelemtDaysLetters(
      Number(ag_zero.year),
      Number(ag_zero.month)
    );

    ag_zero = {
      ...ag_zero,
      id: "",
      nom: { fr: list_title || "", zh: "" },
      contrat: "",
      rld: daysLetters.join(""),
      matricule: "",
    };

    const final_data = [...res, ag_zero];

    return final_data;
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <td
              className={CLASS_TD}
              colSpan={
                agentsf[0] && agentsf[0].rld.rl.split("").length + COL_SPAN
              }
            >
              <div className="text-2xl text-center">
                Equipe <span ref={ref_sp_equipe}></span> -{" "}
                <span ref={ref_sp_section}></span> /{" "}
                <span ref={ref_sp_m}></span> - <span ref={ref_sp_y}></span>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={CLASS_TD} colSpan={COL_SPAN}></td>
            {daysLetters.map((d, i) => (
              <td key={i} className={CLASS_TD}>
                {d}
              </td>
            ))}
          </tr>
          <tr>
            <td className={` ${CLASS_TD} w-min `}>
              <b>No</b>
            </td>
            <td className={CLASS_TD}>
              <b>Nom et Postnom</b>
            </td>
            <td className={CLASS_TD}>
              <b>Agent</b>
            </td>
            <td className={CLASS_TD}>
              <b>Poste</b>
            </td>
            {[...Array(daysCount)].map((d, i) => (
              <td key={i} className={CLASS_TD}>
                {21 + i > daysCount ? (daysCount - i - 20 - 1) * -1 : 21 + i}
              </td>
            ))}
          </tr>
          {agentsf.map((ag, i) => (
            <tr
              key={i}
              className={` ${
                ag.chef_deq === "OUI" && "bg-neutral-200/60 font-bold"
              }   ${ag.poste === "SUP" && "bg-neutral-200/60 font-bold"}  `}
            >
              <td className={` ${CLASS_TD} w-min `}>{i + 1}</td>
              <td className={CLASS_TD}>
                <div className="flex">
                  {ag.nom} {ag.postnom}
                  <b>{ag.mingzi}</b>
                  {ag.chef_deq === "OUI" && (
                    <span className="mx-2">
                      <img alt="shield" src={shield} width={20} height={20} />
                    </span>
                  )}
                  {ag.poste === "SUP" && (
                    <span className="mx-2">
                      <img alt="sup" src={sup} width={20} height={20} />
                    </span>
                  )}
                </div>
              </td>
              <td className={CLASS_TD}>
                {ag.contrat}
                {ag.matricule && `- ${ag.matricule}`}
              </td>
              <td className={CLASS_TD}>{ag.poste}</td>
              {ag.rld.rl
                .slice(0, daysCount)
                .split("")
                .map((r, i) => (
                  <td className={CLASS_TD}>{r}</td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>

      <tr>
        <td className={COL_SPAN}>
          {agentsf.length !== 0 && (
            <div className="flex gap-4">
              <button
                onClick={(e) => printPDF(agentsf)}
                className={`${CLASS_BTN} flex text-sm my-2`}
              >
                <img src={pdf} alt="pdf" width={20} height={30} /> IMPRIMER
                LISTE
              </button>
              <button
                onClick={(e) => printAgentsRoulementPDF(agentsf)}
                className={`${CLASS_BTN} flex text-sm my-2`}
              >
                <img alt="pdf" src={pdf} width={20} height={30} /> IMPRIMER
                ROULEMENT
              </button>
            </div>
          )}
          <div>
            {" "}
            D'equipe:
            <b>{chef_deq && `${chef_deq.nom} ${chef_deq.postnom}`}</b>
          </div>
          <div>
            {" "}
            Operateurs:<b>{nb_op}</b>
          </div>
          <div>
            {" "}
            Aide Operateurs:<b>{nb_aide_op}</b>
          </div>
          <div>
            {" "}
            Chargeurs:<b>{nb_charg}</b>
          </div>
          <div>
            {" "}
            Nettoyeurs:<b>{nb_net}</b>
          </div>
        </td>
      </tr>
    </>
  );
}
 */
export default function Equipes() {
  const [agents, setagents] = useState([]);
  const [agentsf, setagentsf] = useState([]);
  const [rld, setrld] = useState([]);
  const [loading, setloading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState();
  const [list_title, set_list_title] = useState();
  const [daysLetters, setDaysLetters] = useState([]);

  const ref_equipe = useRef();
  const ref_section = useRef();
  const ref_sp_equipe = useRef();
  const ref_sp_section = useRef();
  const ref_sp_y = useRef();
  const ref_sp_m = useRef();
  const ref_year = useRef();
  const ref_month = useRef();

  const ref_gck_agents = useRef();
  const ref_mor_agents = useRef();
  const ref_full_team = useRef();
  const ref_all_gck_stuff = useRef();
  const ref_all_cd_stuff = useRef();
  const ref_all_zh_stuff = useRef();
  const ref_all_sup = useRef();

  const FILTERS = [
    { name: "GCK AGENTS", ref: ref_gck_agents },
    { name: "MOR AGENTS", ref: ref_mor_agents },
    { name: "FULL TEAM", ref: ref_full_team },
    { name: "ALL GCK STUFF", ref: ref_all_gck_stuff },
    { name: "ALL CD GCK STUFF", ref: ref_all_cd_stuff },
    { name: "ALL ZH GCK STUFF", ref: ref_all_zh_stuff },
    { name: "ALL SUPERVISORS", ref: ref_all_sup },
  ];

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    setloading(true);

    let items = await LoadAllItems(TABLES_NAMES.AGENTS);
    let rlds = await LoadAllItems(TABLES_NAMES.AGENTS_RLD);

    setagents(items);
    setrld(rlds);
    //console.log(items, rlds);

    setloading(false);
  }

  function FilterAgents(items_raw, section, equipe, filter) {
    set_list_title(undefined);

    let items = items_raw.filter((ag, i) => {
      const by_equipe = ag.equipe === equipe;
      const by_section = ag.section === section;
      const gck = ag.contrat === "GCK";
      const mor = ag.contrat !== "GCK";
      const cd = ag.nationalite === "CD";
      const zh = ag.nationalite === "ZH";

      const equipe_section = by_equipe && by_section;
      const eq_sec_gck = equipe_section && gck;
      const eq_sec_mor = equipe_section && mor;
      const all_gck = gck;
      const all_zh = all_gck && zh;
      const all_cd = all_gck && cd;
      const all_sup =
        all_gck && !zh && ag.poste === "SUP" && ag.section === "ENSACHAGE";

      if (filter) {
        if ("GCK AGENTS" === filter.name) {
          set_list_title("AGENTS GCK");
          return eq_sec_gck;
        }
        if ("MOR AGENTS" === filter.name) return eq_sec_mor;
        if ("FULL TEAM" === filter.name) return equipe_section;
        if ("ALL CHINESE STUFF" === filter.name) return all_zh;
        if ("ALL GCK STUFF" === filter.name) return all_gck;
        if ("ALL CD GCK STUFF" === filter.name) return all_cd;
        if ("ALL ZH GCK STUFF" === filter.name) return all_zh;
        if ("ALL SUPERVISORS" === filter.name) return all_sup;
      }

      return equipe_section;
    });

    return items;
  }

  function onFilterAgents() {
    setagentsf([]);
    setDaysLetters([]);

    let y = ref_year.current.value;
    let m = ref_month.current.value;

    const dl = getRouelemtDaysLetters2(y, m);
    console.log(dl);
    setDaysLetters(dl);

    const section = ref_section.current.value;
    const equipe = ref_equipe.current.value;

    ref_sp_section.current.textContent = section;
    ref_sp_equipe.current.textContent = equipe;
    ref_sp_y.current.textContent = y;
    ref_sp_m.current.textContent = MONTHS[m];

    const arr_agents = FilterAgents(agents, section, equipe, selectedFilter);

    let arr_agents_with_rld = [];

    arr_agents.map((agent, i) => {
      const { id: agent_id } = agent;

      let mc = `mc_${agent_id}_${y}_${m}`;

      const roulement_data = rld.find((it, i) => it.month_code === mc);

      agent.rld = roulement_data;

      if (roulement_data === undefined) {
        console.error(`rld for ${mc} is undefinded`);
        const data = { rl: [...Array(31).fill("-")].join(""), month_code: mc };
        agent.rld = data;
      } else {
        console.info(`rld for ${mc}\n`, agent);
      }
      arr_agents_with_rld.push(agent);
      return agent;
    });

    setagentsf([...arr_agents_with_rld]);
  }

  useEffect(() => {
    onFilterAgents();
  }, [selectedFilter]);

  function onSetFilter(e) {
    setSelectedFilter(e);
  }

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div>
      <Loading isLoading={loading} />

      {!loading && (
        <>
          <div>
            <div>
              <span className={CLASS_SELECT_TITLE}>SECTION</span>

              <select
                className={CLASS_SELECT}
                name="section"
                ref={ref_section}
                defaultValue={SECTIONS[0]}
                onChange={onFilterAgents}
              >
                {SECTIONS.map((it, i) => (
                  <option key={i}>{it}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <span className={CLASS_SELECT_TITLE}>EQUIPE</span>

            <select
              className={CLASS_SELECT}
              name="equipe"
              defaultValue={EQUIPES[0]}
              ref={ref_equipe}
              onChange={onFilterAgents}
            >
              {EQUIPES.map((it, i) => (
                <option key={i}>{it}</option>
              ))}
            </select>
          </div>

          <div>
            <span className={CLASS_SELECT_TITLE}>Year:</span>
            <select
              onChange={onFilterAgents}
              ref={ref_year}
              className={CLASS_SELECT}
            >
              {[...Array(10)].map((it, i) => (
                <option key={i}>{new Date().getFullYear() + i}</option>
              ))}
            </select>
          </div>
          <div>
            <span className={CLASS_SELECT_TITLE}>Month:</span>
            <select
              className={CLASS_SELECT}
              onChange={onFilterAgents}
              ref={ref_month}
            >
              {[...Array(12)].map((it, i) => (
                <option key={i} value={i}>
                  {MONTHS[i]}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div>
        <button
          className={CLASS_BTN}
          onClick={(e) => setShowFilters(!showFilters)}
        >
          {" "}
          SHOW/HIDE FILTERS{" "}
        </button>

        <div
          className={`p-2 border w-auto ${showFilters ? "block" : "hidden"}`}
        >
          {FILTERS.map((f, i) => (
            <div>
              <label>
                <input
                  onChange={(e) => onSetFilter(f)}
                  ref={f.ref}
                  type="radio"
                  name="filter"
                  value={f.name.replaceAll(" ", "_")}
                />
                {f.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <AgentsTable
          agentsf={agentsf}
          ref_sp_equipe={ref_sp_equipe}
          ref_sp_section={ref_sp_section}
          ref_sp_m={ref_sp_m}
          ref_sp_y={ref_sp_y}
          list_title={list_title}
          daysLetters={daysLetters}
        />
      </div>
    </div>
  );
}
