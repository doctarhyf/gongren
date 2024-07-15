import React, { Children, useContext, useEffect, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "../comps/Loading";
import {
  formatAsMoney,
  GroupBySectionAndEquipe,
  ParseTotalsData,
  SortLoadsByShiftOfDay,
  UserHasAccessCode,
  UserHasAnyOfAccessCodes,
} from "../helpers/func";
import {
  ACCESS_CODES,
  COLUMNS_TO_HIDE,
  LANG_COOKIE_KEY,
} from "../helpers/flow";
import { useCookies } from "react-cookie";
import {
  GEN_TRANSLATIONS,
  GET_STRINGS_KEYS,
  LANGS,
  PACK_TRANSLATIONS_STRINGS,
  STRINGS,
} from "../helpers/lang_strings";
import { UserContext } from "../App";
import TableLoadsTotals from "../comps/TableLoadsTotal";

const COLORS = [
  " bg-teal-700 text-teal-300 border-teal-300 p-2 rounded-md w-full md:w-64 ",
  " bg-sky-700 text-sky-300 border-sky-300 p-2 rounded-md w-full md:w-64 ",
  " bg-indigo-700 text-indigo-300 border-indigo-300 p-2 rounded-md w-full md:w-64 ",
  " bg-purple-700 text-purple-300 border-purple-300 p-2 rounded-md w-full md:w-64 ",
  " bg-rose-700 text-rose-300 border-rose-300 p-2 rounded-md w-full md:w-64 ",
];

const Card = ({ id, title, desc, children, wfull }) => {
  const [showChildren, setShowChildren] = useState(true);

  return (
    <div
      className={` ${COLORS[id]} md:h-fit  ${wfull ? "w-full" : "w-auto"}  `}
    >
      <h1
        className=" cursor-pointer  font-bold  border-b border-b-white/20   "
        onClick={(e) => setShowChildren(!showChildren)}
      >
        {title}
      </h1>
      {showChildren && <div>{children}</div>}
      <h5>{desc}</h5>
    </div>
  );
};

function HUDProduction() {
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
    dechires: 0,
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

        const curMonthLoads = s.filter(
          (it, i) => it.code.includes(`${y}_${m}`) //it.created_at.split(":")[0].split(`-${mstring}-`)[0] == y
        );
        setloads(curMonthLoads);

        let totCamions = 0;
        let totSacs = 0;
        let totTonnage = 0;
        let totDechires = 0;

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
          totDechires += parseInt(dechires);
        });

        setdata({
          camions: totCamions,
          sacs: totSacs,
          tonnage: `${totTonnage} T`,
          dechires: totDechires,
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
    <Card id={0} title={`PROD./生产 年${y}月${parseInt(m) + 1}`} desc={""}>
      {loading ? (
        <Loading isLoading={true} />
      ) : (
        <div className="">
          {[
            ["CAMIONS/车数", data.camions],
            ["SACS/袋数", data.sacs],
            ["TON./吨数", data.tonnage],
            ["DECH./破袋", data.dechires],
          ].map((it, i) => (
            <div>
              <div className=" text-[24pt] ">{it[1]}</div>
              <div className=" w-fit text-xs bg-white/25 rounded-md py-1 px-2  ">
                {it[0]}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function HUDGestionSacs() {
  const [loading, setloading] = useState(false);

  const [data, setdata] = useState({
    cont: { s32: 0, s42: 0 },
    prod: { s32: 0, s42: 0 },
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setloading(true);
    const stockCont = await SB.LoadAllItems(TABLES_NAMES.SACS_CONTAINER);
    const stockProd = await SB.LoadAllItems(TABLES_NAMES.SACS_PRODUCTION);

    const stockContLen = stockCont.length;
    const stockProdLen = stockProd.length;

    const stockContLastEl = stockCont[stockContLen - 1];
    const stockProdLastEl = stockProd[stockProdLen - 1];

    const { stock32, stock42 } = stockContLastEl;
    const { restants32, restants42 } = stockProdLastEl;

    console.log("sc", stockCont, stockCont.length);
    console.log("sp", stockProd, stockProd.length);

    setdata({
      cont: { s32: stock32, s42: stock42 },
      prod: { s32: restants32, s42: restants42 },
    });

    setloading(false);
  }

  return (
    <Card id={1} title={`GESTIONS SACS/编织袋管理`} desc={""}>
      {loading ? (
        <Loading isLoading={true} />
      ) : (
        <div className="">
          {[
            ["CONT./集装箱袋数", data.cont],
            ["REST./剩余总量", data.prod],
          ].map((stock, i) => (
            <div className=" border-b border-b-white/10 py-2 ">
              {/* <div className=" text-[24pt] ">{it[1]}</div> */}
              {Object.entries(stock[1]).map((s, i) => (
                <div className="  ">
                  <div>
                    <span className=" text-[16pt] ">{s[1]}</span>
                    <span className=" font-bold  px-2 text-sm  ">
                      {`${s[0]} `}
                    </span>
                  </div>
                </div>
              ))}
              <div className="  text-xs bg-white/25 px-2 py-1 w-fit rounded-md ">
                {stock[0]}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function HUDAgents() {
  const [loading, setloading] = useState(false);

  const [agentsFiltered, setAgentsFiltered] = useState([]);
  const [agentsGrouped, setAgentsGrouped] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setloading(true);
    SB.LoadAllItems2(
      TABLES_NAMES.AGENTS,
      (agents) => {
        setloading(false);

        const agentsf = agents.filter((agent, i) => agent.active === "OUI");
        const agentsg = GroupBySectionAndEquipe(agentsf);
        setAgentsFiltered(agentsf);
        setAgentsGrouped(agentsg);

        console.log("agsf f", agentsf);
      },
      (e) => {
        setloading(false);
        console.log(e);
        alert(`Error \n ${JSON.stringify(e)}`);
      }
    );
  }

  return (
    <Card
      id={2}
      title={`AGENTS/ 员工 (${agentsFiltered.length}) Agents`}
      desc={""}
    >
      {loading ? (
        <Loading isLoading={true} />
      ) : (
        <div>
          {Object.entries(agentsGrouped).map((sec) => (
            <div>
              <div>{sec[0]}</div>
              <div className=" justify-center gap-4 align-middle   flex ">
                {Object.entries(sec[1]).map((it, i) => (
                  <div>
                    <div className=" text-[24pt] ">{it[1].length}</div>
                    <div className=" w-fit text-xs bg-white/25 rounded-md py-1 px-2  ">
                      {it[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function HUDTotals() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDay();
  const [date, setdate] = useState({ y: y, m: m });
  const [loads_by_items, set_loads_by_items] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [lastUpdateDate, setlastUpdateDate] = useState();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await SB.LoadAllItems(TABLES_NAMES.LOADS);
    set_loads_by_items(data);

    const sortedByShiftOfDay = SortLoadsByShiftOfDay(data, y, m);
    setTotalData(ParseTotalsData(sortedByShiftOfDay));
    console.log("d ==> ", ParseTotalsData(sortedByShiftOfDay));
    // setlastUpdateDate(data[data.length].created_at);
    setlastUpdateDate(data[data.length - 1].created_at);
  }

  return (
    <Card id={3} title={`Primes / 奖金`} desc={""}>
      <TableLoadsTotals
        totalData={totalData}
        date={date}
        columnsToHide={[COLUMNS_TO_HIDE.SACS, COLUMNS_TO_HIDE.CDF]}
        lastUpdateDate={new Date(lastUpdateDate)}
      />
    </Card>
  );
}

export default function Home() {
  const [, , user] = useContext(UserContext);
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

  return (
    <div className="md:w-[980pt] md:mx-auto ">
      <Loading isLoading={loading} />

      <div className="w-full my-4">
        <div></div>
        <div>
          Bonjour Mr.{" "}
          <b>
            {user.prenom}, {user.nom} {user.postnom}
          </b>{" "}
          et bienvenue sur le portal la cimenterie.
        </div>
      </div>

      <div className=" container flex gap-4 my-4 flex-col md:flex-row ">
        <HUDProduction />
        <HUDGestionSacs />
        <HUDAgents />
        {(UserHasAccessCode(user, ACCESS_CODES.CAN_SEE_BONUS_TOTAL) ||
          user.poste === "SUP" ||
          user.poste === "DEQ" ||
          user.poste === "INT") && <HUDTotals />}
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
