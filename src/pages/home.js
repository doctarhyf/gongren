import React, { Children, useContext, useEffect, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "../comps/Loading";
import {
  formatAsMoney,
  GetDateParts,
  GetMonthNumDays,
  GroupBySectionAndEquipe,
  CaclculateAllTeamsTotals,
  SortLoadsByShiftOfDay,
  UserHasAccessCode,
  UserHasAnyOfAccessCodes,
} from "../helpers/func";
import {
  ACCESS_CODES,
  COLUMNS_TO_HIDE,
  EQUIPES_NAMES,
  LANG_COOKIE_KEY,
  POSTES,
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
import SacsCalc from "../comps/SacsCalc";

const colors = [
  "bg-teal-500",
  "bg-sky-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-rose-500",
];

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
      className={` flex-grow  ${COLORS[id]}   ${wfull ? "w-full" : "w-auto"}  `}
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
  const [, , user, setuser] = useContext(UserContext);
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() - 1;
  const d = today.getDay();
  const [date, setdate] = useState({ y: y, m: m });
  const [loads_by_items, set_loads_by_items] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [lastUpdateDate, setlastUpdateDate] = useState();
  const [loading, setloading] = useState(false);

  useEffect(() => {
    loadData(user);
  }, []);

  async function loadData(user) {
    setloading(true);
    const data = await SB.LoadAllItems(TABLES_NAMES.LOADS);
    set_loads_by_items(data);

    const sortedByShiftOfDay = SortLoadsByShiftOfDay(data, y, m);

    const addSacsAdj = UserHasAccessCode(user, ACCESS_CODES.ROOT);

    setTotalData(CaclculateAllTeamsTotals(sortedByShiftOfDay, addSacsAdj));
    setlastUpdateDate(data[data.length - 1].created_at);
    setloading(false);
  }

  return (
    <Card id={3} title={`Primes / 奖金`} desc={""}>
      {loading ? (
        <Loading isLoading={true} />
      ) : (
        <TableLoadsTotals
          totalData={totalData}
          date={date}
          columnsToHide={[COLUMNS_TO_HIDE.SACS, COLUMNS_TO_HIDE.CDF]}
          lastUpdateDate={new Date(lastUpdateDate)}
        />
      )}
    </Card>
  );
}

function HUDGreetings({ user }) {
  return (
    <div className="w-full my-4 p-2 bg-gray-800 text-white shadow-lg shadow-black/25 rounded-md">
      <div></div>
      <div>
        Bonjour Mr.{" "}
        <b>
          {user.prenom}, {user.nom} {user.postnom} ({user.mingzi}),{" "}
        </b>
        {POSTES[user.poste].fr} de l'equipe {user.equipe}
        {", "}
        {EQUIPES_NAMES[user.equipe]} de la section {user.section} et bienvenue
        sur le portal la cimenterie.
      </div>
    </div>
  );
}

function StatsCard({ bgColor, children }) {
  bgColor = bgColor === undefined ? "bg-sky-500" : bgColor;

  return (
    <div
      className={`${bgColor} hover:shadow-md hover:shadow-slate-400 text-white p-4 flex-grow rounded-lg`}
    >
      {children}
    </div>
  );
}

function HUDMonthLoadTarget() {
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

        console.log("totdata => ", data);
      },
      (e) => {
        setloading(false);
        console.log(e);
        alert(`Error \n ${JSON.stringify(e)}`);
      }
    );
  }

  return (
    <Card id={4} bgColor={colors[2]} title={"MONTH PROGRESS"}>
      {loading ? (
        <Loading isLoading={true} />
      ) : (
        <div>
          <div>
            <div>PROGR. TONNAGE MENSUEL/月度吨位</div>

            <div className="p-1 bg-black w-fit text-white rounded-full px-2 ">
              TARGET: 60000T
            </div>

            <progress
              className="progress  progress-success w-full "
              value={parseInt(data.tonnage)}
              max={60000}
            ></progress>
            <div className="text-[42pt]">{data.tonnage}</div>
          </div>

          <div>
            <div>JOURS RESTANT DU MOIS / 本月剩余天数</div>
            <div className="p-1 bg-black w-auto text-white rounded-full px-2 ">
              {JSON.stringify(GetDateParts().day)}th / {GetMonthNumDays().count}
              {GetMonthNumDays().ext}
            </div>
            <progress
              className="progress progress-success w-full "
              value={GetDateParts().day}
              max={GetMonthNumDays().count}
            ></progress>
            <div className="text-[42pt]">
              {GetMonthNumDays().remaining} J/天
            </div>
          </div>
        </div>
      )}
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

      <HUDGreetings user={user} />

      <div className=" container flex gap-4 my-4 flex-col md:flex-row flex-wrap ">
        {(UserHasAccessCode(user, ACCESS_CODES.CAN_SEE_BONUS_TOTAL) ||
          user.poste === "SUP" ||
          user.poste === "DEQ" ||
          user.poste === "INT") && <HUDTotals />}

        <HUDProduction />
        <HUDGestionSacs />
        <HUDAgents />
        <HUDMonthLoadTarget />
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
