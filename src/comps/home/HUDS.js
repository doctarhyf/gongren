import { useEffect, useState, useContext } from "react";
import * as SB from "../../helpers/sb";
import { TABLES_NAMES } from "../../helpers/sb.config";
import Card from "./Card";
import Loading from "../Loading";
import {
  GroupBySectionAndEquipe,
  formatAsMoney,
  GetDateParts,
  GetMonthNumDays,
  CaclculateAllTeamsTotals,
  SortLoadsByShiftOfDay,
  UserHasAccessCode,
  UserHasAnyOfAccessCodes,
  formatFrenchDate,
  AddLeadingZero,
} from "../../helpers/func";
import { UserContext } from "../../App";
import TableLoadsTotals from "../TableLoadsTotal";
import {
  COLUMNS_TO_HIDE,
  CARDS_BG_COLORS,
  EQUIPES_NAMES,
  POSTES,
  SECTIONS,
} from "../../helpers/flow";
import AgentsList from "../AgentsList";
import SacsCalc from "../SacsCalc";

function AgentStats({ agentsGrouped }) {
  return (
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
  );
}

function AgentCardMini({ agent }) {
  return (
    <div>
      {agent.matricule && (
        <div className=" font-bold inline-block  bg-black p-1 text-xs rounded-md ">
          {agent.matricule}
        </div>
      )}
      <div className=" font-bold text-2xl  ">
        {agent.prenom}, {agent.nom} {agent.postnom}{" "}
        {agent.mingzi && `- ${agent.mingzi}`}
      </div>
      <div>
        {POSTES[agent.poste] && POSTES[agent.poste].fr}, {agent.equipe},{" "}
        {agent.section}
      </div>
      {agent.phone && (
        <div>
          Phone: <b>{agent.phone}</b>
        </div>
      )}
      <div>
        Depuis: <b>{formatFrenchDate(agent.created_at)}</b>
      </div>
      <div>
        Active: <b>{agent.active}</b>
      </div>
    </div>
  );
}

export function HUDProduction() {
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

export function HUDGreetings({ user }) {
  return (
    <div className="w-full my-4 p-2 bg-gray-800 text-white shadow-lg shadow-black/25 rounded-md">
      <div></div>
      <div>
        Bienvenu au portal de la cimenterie
        <div className="  text-3xl font-thin ">
          <b>
            <div>Mr. {user.prenom}, </div>
            <div>
              {user.nom} {user.postnom}{" "}
              <span className=" text-sm  ">({user.mingzi})</span>
            </div>
          </b>
        </div>
        <div>
          <span className=" text-white/50  ">Matricule :</span> {user.matricule}
        </div>
        <div>
          <span className=" text-white/50  ">Poste:</span>{" "}
          {POSTES[user.poste].fr}
        </div>
        <div>
          <span className=" text-white/50  ">Equipe:</span>{" "}
          {EQUIPES_NAMES[user.equipe]}
        </div>
        <div>
          <span className=" text-white/50  ">Section:</span> {user.section}
        </div>{" "}
      </div>
    </div>
  );
}

export function HUDMonthProgress() {
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
    <Card
      id={0}
      bgColor={CARDS_BG_COLORS[2]}
      title={`SUVI CHARGEMENT - ${AddLeadingZero(m + 1)}/${y}`}
      desc="Evolution chargement mois actuel"
    >
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

export function HUDBonus() {
  const [, , user, setuser] = useContext(UserContext);
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
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

    setTotalData(CaclculateAllTeamsTotals(sortedByShiftOfDay));
    setlastUpdateDate(data[data.length - 1].created_at);
    setloading(false);
  }

  return (
    <Card
      id={1}
      title={`SUIVI BONUS/奖金 - ${y}年${m + 1}月`}
      desc={"Suivi bonus du mois actuel"}
    >
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

export function HUDSacsCalc({}) {
  return (
    <Card
      id={2}
      title={"CALCULATEUR DE SACS"}
      desc={"Pour effectuer le calcul de sacs dechires"}
    >
      <SacsCalc />
    </Card>
  );
}

export function HUDGestionSacs() {
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
    <Card
      id={3}
      title={`GESTIONS SACS/编织袋管理`}
      desc={"Gestion sacs container/production"}
    >
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

export function HUDAgents() {
  const [showingAgentsList, setShowingAgentsList] = useState(false);
  const [loading, setloading] = useState(false);
  const [q, setq] = useState();
  const [agentsFiltered, setAgentsFiltered] = useState([]);
  const [agentsGrouped, setAgentsGrouped] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(undefined);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    console.log("q => ", q);
  }, [q]);

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

  function onAgentClick(ag) {
    console.log(ag);
    setSelectedAgent(ag);
  }

  return (
    <Card
      id={4}
      title={`AGENTS/ 员工 (${agentsFiltered.length}) Agents`}
      desc={"Information sur les agents"}
    >
      {loading ? (
        <Loading isLoading={true} />
      ) : (
        <div>
          <div className="  py-2  ">
            <button
              className={` ${
                !showingAgentsList
                  ? " bg-sky-600 outline-sky-500 text-white "
                  : " bg-white text-sky-600  "
              } p-1 rounded-md text-sm  hover:bg-gray-400 outline-none   `}
              onClick={(e) => {
                setShowingAgentsList(!showingAgentsList);
                if (showingAgentsList) setSelectedAgent(undefined);
              }}
            >
              {showingAgentsList ? "HIDE" : "SHOW"} {"AGENTS LIST"}
            </button>
          </div>

          {showingAgentsList ? (
            selectedAgent ? (
              <AgentCardMini agent={selectedAgent} />
            ) : (
              <AgentsList perPage={5} onAgentClick={onAgentClick} />
            )
          ) : (
            <AgentStats agentsGrouped={agentsGrouped} />
          )}
        </div>
      )}
    </Card>
  );
}
