import React, { Children, useEffect, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "../comps/Loading";
import { formatAsMoney, GroupBySectionAndEquipe } from "../helpers/func";
import { LANG_COOKIE_KEY } from "../helpers/flow";
import { useCookies } from "react-cookie";
import {
  GEN_TRANSLATIONS,
  GET_STRINGS_KEYS,
  LANGS,
  PACK_TRANSLATIONS_STRINGS,
  STRINGS,
} from "../helpers/lang_strings";

const COLORS = [
  " bg-orange-700 text-orange-300 border-orange-300 p-2 rounded-md w-full md:w-64 ",
  " bg-green-700 text-green-300 border-green-300 p-2 rounded-md w-full md:w-64 ",
  " bg-purple-700 text-purple-300 border-purple-300 p-2 rounded-md w-full md:w-64 ",
  " bg-red-700 text-red-300 border-red-300 p-2 rounded-md w-full md:w-64 ",
  " bg-sky-700 text-sky-300 border-sky-300 p-2 rounded-md w-full md:w-64 ",
];

const Card = ({ id, title, desc, children }) => {
  return (
    <div className={COLORS[id]}>
      <h1 className=" font-bold  ">{title}</h1>
      {children}
      <h5>{desc}</h5>
    </div>
  );
};

function Tonnage() {
  const date = new Date();
  const m = date.getMonth();
  const y = date.getFullYear();
  const d = date.getDate();
  const [loading, setloading] = useState(false);

  const [loads, setloads] = useState([]);
  const [data, setdata] = useState({
    camions: 100,
    sacs: 200,
    tonnage: 300,
  });

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setloading(true);
    SB.LoadAllItems2(
      TABLES_NAMES.LOADS,
      (s) => {
        setloading(false);
        let mstring = m + 1 < 10 ? "0" + (m + 1) : "" + (m + 1);
        const monthCheck = `${y}-${mstring}-`;

        const curMonthLoads = s.filter(
          (it, i) => it.created_at.split(":")[0].split(`-${mstring}-`)[0] == y
        );
        setloads(curMonthLoads);

        let totCamions = 0;
        let totSacs = 0;
        let totTonnage = 0;

        curMonthLoads.forEach((el) => {
          const {
            ajouts,
            autre,
            camions,
            code,
            created_at,
            dechires,
            id,
            prob_courant,
            prob_machine,
            retours,
            sacs,
          } = el;

          totSacs += parseInt(sacs);
          totTonnage = totSacs / 20;
          totCamions += parseInt(camions);
        });

        setdata({
          camions: totCamions,
          sacs: totSacs,
          tonnage: `${totTonnage} T`,
        });
      },
      (e) => {
        setloading(false);
        console.log(e);
        alert(`Error \n ${JSON.stringify(e)}`);
      }
    );
  }

  return (
    <Card id={3} title={`PROD./生产 年${y}月${m}日${d} `} desc={""}>
      {loading ? (
        <Loading isLoading={true} />
      ) : (
        <div className="">
          {[
            ["CAMIONS/车数", data.camions],
            ["SACS/袋数", data.sacs],
            ["TON./吨数", data.tonnage],
          ].map((it, i) => (
            <div>
              <div className=" text-xs  ">{it[0]}</div>
              <div className=" text-[24pt] ">{it[1]}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default function Home() {
  const [agents, setagents] = useState([]);
  const [loading, setloading] = useState(false);
  const [agents_by_teams, set_agents_by_teams] = useState({});

  const [cookies, setCookie, removeCookie] = useCookies([LANG_COOKIE_KEY]);

  const TRANSLATIONS = PACK_TRANSLATIONS_STRINGS([
    STRINGS["Agents count"],
    STRINGS.Team,
  ]);
  const [trads, settrads] = useState({});
  const [lang, setlang] = useState(LANGS[1]);

  useEffect(() => {
    // loadData();
    const sellang = LANGS[cookies[LANG_COOKIE_KEY]] || LANGS[1];
    setlang(sellang);
    settrads(GEN_TRANSLATIONS(TRANSLATIONS, sellang));

    console.log("sellang : ", sellang);
  }, []);

  async function loadData() {
    setloading(true);
    set_agents_by_teams({});

    let agents = await SB.LoadAllItems(TABLES_NAMES.AGENTS);
    agents = agents.filter((agent, i) => agent.active === "OUI");

    let agents_grouped_by_teams = GroupBySectionAndEquipe(agents);

    const rlds = await SB.LoadAllItems(TABLES_NAMES.AGENTS_RLD);

    const agents_with_rld = agents.map((agent, i) => {
      let rld = rlds.find((it, i) => it.agent_id === agent.id);

      if (rld) {
        agent.rld = rld;
        //console.log(agent.id);
      } else {
        agent.rld = {
          rl: "--------------------------------",
          agent_id: agent.id,
        };
      }

      return agent;
    });

    set_agents_by_teams(agents_grouped_by_teams);
    setagents(agents_with_rld);
    setloading(false);
  }

  return (
    <div className="md:w-[980pt] md:mx-auto ">
      <Loading isLoading={loading} />

      <div className=" container flex gap-4 my-4 flex-col md:flex-row ">
        <Tonnage />
      </div>

      {false && (
        <div className="oldmain">
          <div>
            {trads[GET_STRINGS_KEYS(STRINGS["Agents count"].default)]} :
            {agents.length}
          </div>
          <div className="w-fit ">
            {Object.entries(agents_by_teams).map((section, i) => (
              <details key={i}>
                <summary className="cursor-pointer">{section[0]}</summary>
                <div>
                  {Object.entries(section[1])
                    .sort()
                    .map((team, i) => (
                      <div className="ml-8">
                        {trads[GET_STRINGS_KEYS(STRINGS.Team.default)]} :
                        {
                          trads[
                            GET_STRINGS_KEYS(STRINGS["Agents count"].default)
                          ]
                        }{" "}
                        :{team[0]} : <b>{team[1].length}</b>
                      </div>
                    ))}
                </div>
              </details>
            ))}
          </div>{" "}
        </div>
      )}
    </div>
  );
}
