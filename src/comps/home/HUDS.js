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
  UpdateOperationsLogs,
  FrenchDate,
} from "../../helpers/func";
import { UserContext } from "../../App";
import TableLoadsTotals from "../TableLoadsTotal";
import {
  COLUMNS_TO_HIDE,
  CARDS_BG_COLORS,
  EQUIPES_NAMES,
  POSTES,
  SECTIONS,
  POSTE,
  LOG_OPERATION,
  ACCESS_CODES,
} from "../../helpers/flow";
import AgentsList from "../AgentsList";
import SacsCalc from "../SacsCalc";
import CountdownTimer from "../CountdownTimer";
import LoadsCalculator from "../LoadCalculator";
import nophoto from "../../img/user.png";

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

function AgentCardMini({ agent, moreInfo, showUpdatePoste, onAgentUpdate }) {
  const [, , user, setuser] = useContext(UserContext);
  const [loading, setloading] = useState(false);

  async function updatePoste(ag, new_poste) {
    console.log("new_poste => ", new_poste, ag);
    setloading(true);
    const upd = { id: ag.id, poste: new_poste };
    const r = await SB.UpdateItem(
      TABLES_NAMES.AGENTS,
      upd,
      async (s) => {
        setloading(false);
        console.log(s);
        await UpdateOperationsLogs(
          SB,
          user,
          LOG_OPERATION.AGENT_POST_UPDATE,
          `Old poste "${agent.poste}", new poste "${new_poste}"`
        );
      },
      (e) => {
        console.log(e);
        setloading(false);
      }
    );

    onAgentUpdate(upd);
  }

  return (
    <div>
      <div className="flex gap-1 md:text-center md:justify-center">
        {agent.matricule && (
          <div className=" font-bold inline-block  bg-black p-1 text-xs rounded-md ">
            {agent.matricule}
          </div>
        )}
        {agent.poste === "SUP" && (
          <div className=" font-bold inline-block  bg-red-500 p-1 text-xs rounded-md ">
            SUP
          </div>
        )}
        {agent.chef_deq === "OUI" && (
          <div className=" font-bold inline-block  bg-lime-600 p-1 text-xs rounded-md ">
            CHEF D'EQ.
          </div>
        )}
      </div>

      <div className={`  ${!showUpdatePoste && "md:flex justify-around"} `}>
        <div className=" flex  md:justify-center  text-3xl  ">
          <div>
            <div>Mr. {agent.prenom}</div>
            <div>
              {" "}
              {agent.nom} {agent.postnom}{" "}
              {agent.mingzi && (
                <span className=" text-sm  ">{agent.mingzi}</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <div>
            <span className=" text-white/50  ">Section:</span> {agent.section}
          </div>{" "}
          <div>
            <span className=" text-white/50  ">Poste:</span>{" "}
            {(POSTES[agent.poste] && POSTES[agent.poste].fr) || POSTE[3]}
          </div>
          <div>
            <span className=" text-white/50  ">Equipe:</span>{" "}
            {EQUIPES_NAMES[agent.equipe] || agent.equipe}
          </div>
          {agent.phone && (
            <div>
              <span className=" text-white/50  ">Phone:</span> {agent.phone}
            </div>
          )}
          {moreInfo &&
            moreInfo.map((it, i) => (
              <div>
                <span className=" text-white/50  ">{it}:</span> {agent[it]}
              </div>
            ))}
          {showUpdatePoste && agent.poste !== "SUP" && user.poste === "SUP" && (
            <div>
              <div>
                <span className=" text-white/50  ">Poste:</span>
                <select
                  onChange={(e) => updatePoste(agent, e.target.value)}
                  className=" text-black w-auto outline-none rounded-md mx-1 text-sm dark:bg-slate-800 dark:text-white "
                >
                  {Object.keys(POSTES).map((p, i) => (
                    <option value={p} selected={p === agent.poste}>
                      {POSTES[p].fr}
                    </option>
                  ))}
                </select>
              </div>
              <Loading isLoading={loading} />
            </div>
          )}
        </div>
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
    <div className=" md:text-center w-auto my-4 p-2 bg-gray-800 text-white shadow-lg shadow-black/25 rounded-md">
      <div> Bienvenu au portal de la cimenterie</div>

      <div className="  flex flex-col md:flex-row md:justify-center md:my-0 my-2 gap-4 ">
        <div className=" w-32 h-32 bg-slate-700 rounded-full overflow-hidden ">
          <img src={user.photo || nophoto} />
        </div>
        <AgentCardMini agent={user} />
      </div>
    </div>
  );
}

export function HUDMyTeam({ user }) {
  const [agents, setagents] = useState([]);
  const [agentsr, setagentr] = useState([]);
  const [loading, setloading] = useState(false);
  const [selagent, setselagent] = useState();
  const [q, setq] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    console.log("sup => ", user);

    let a = await SB.LoadAllItems(TABLES_NAMES.AGENTS);
    a = a.filter(
      (it) =>
        it.equipe === user.equipe &&
        it.section === user.section &&
        it.active === "OUI"
    );

    a = a.sort((a, b) => a.list_priority - b.list_priority);

    setagents(a);
    setagentr(a);
    console.log(`Agents ${user.section}, equipe ${a.equipe} => \n`, a);
  }

  useEffect(() => {
    if (q && q.trim() === "") {
      setagents(agentsr);
      return;
    }

    const f = agentsr.filter(
      (t) =>
        t.nom.toLowerCase().includes(q.toLocaleLowerCase()) ||
        t.postnom.toLowerCase().includes(q.toLocaleLowerCase()) ||
        t.prenom.toLowerCase().includes(q.toLocaleLowerCase()) ||
        t.mingzi.toLowerCase().includes(q.toLocaleLowerCase()) ||
        t.poste.toLowerCase().includes(q.toLocaleLowerCase()) ||
        t.matricule.toLowerCase().includes(q.toLocaleLowerCase())
    );

    setagents(f);
  }, [q]);

  function onAgentUpdate(ag) {
    setselagent({ ...selagent, ...ag });
    loadData();
  }

  return (
    <Card
      id={5}
      title={`MON EQUIPE/班组 : ${user.section}, ${user.equipe}`}
      desc={`Liste des agents. (${agents.length} agents)`}
    >
      {loading ? (
        <Loading isLoading={true} />
      ) : selagent ? (
        <div>
          <AgentCardMini
            agent={selagent}
            showUpdatePoste={true}
            onAgentUpdate={onAgentUpdate}
          />
          <button
            onClick={(e) => setselagent(undefined)}
            className=" my-2 w-full bg-white/10 hover:bg-white/40 p-1 px-2 text-xs rounded-md "
          >
            OK
          </button>
        </div>
      ) : (
        <div className="   ">
          <div className="  ">
            <input
              placeholder="Recherche agent ... ex: Franvale/库齐"
              type="text"
              className=" bg-slate-800 p-1 text-white px-1 hover:outline-white/50 w-full rounded-md outline-none my-1 "
              onChange={(e) => setq(e.target.value)}
            />
          </div>
          {agents.map((ag, i) => (
            <div
              onClick={(e) => setselagent(ag)}
              className=" border-b border-white/25 p-1 flex hover:cursor-pointer hover:bg-white/10 rounded-md "
            >
              <div>{`${i + 1}. `} </div>
              <div>
                <div className=" font-bold  ">{`${ag.nom} ${ag.postnom} ${ag.prenom}`}</div>
                <div className="  text-xs ">
                  <span>{`${POSTES[ag.poste] && POSTES[ag.poste].fr}/${
                    POSTES[ag.poste] && POSTES[ag.poste].zh
                  }`}</span>
                  {ag.chef_deq === "OUI" && (
                    <span className=" font-bold inline-block  bg-black p-1 text-xs rounded-md ">
                      CHEF D'EQ.
                    </span>
                  )}
                  {ag.is_exp === "OUI" && (
                    <span className=" font-bold inline-block  bg-red-500 text-white p-1 text-xs rounded-md ">
                      EXPEDITEUR
                    </span>
                  )}
                  {ag.poste === "SUP" && (
                    <span className=" font-bold inline-block  bg-black p-1 text-xs rounded-md ">
                      SUP.
                    </span>
                  )}
                  {ag.contrat === "GCK" && (
                    <span className=" bg-blue-800 text-white p-1 text-xs px-2 rounded-md mx-1 ">
                      GCK
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function HUDMonthProgress({ loads, date }) {
  const [loading, setloading] = useState(false);

  const [data, setdata] = useState({
    camions: 100,
    sacs: 200,
    tonnage: 300,
    dechires: 0,
  });

  useEffect(() => {
    parseData(loads);
  }, [loads, date]);

  function parseData(loads_data) {
    const curMonthLoads = loads_data.filter(
      (it, i) => it.code.includes(`${date.y}_${date.m}`) //it.created_at.split(":")[0].split(`-${mstring}-`)[0] == y
    );
    //setloads(curMonthLoads);

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
  }

  return (
    <Card
      id={0}
      bgColor={CARDS_BG_COLORS[2]}
      title={`SUVI CHARGEMENT/月份装量计算 - ${AddLeadingZero(date.m + 1)}/${
        date.y
      }`}
      desc="Evolution chargement mois actuel"
    >
      {loading ? (
        <Loading isLoading={true} />
      ) : (
        <div>
          <div className=" border-b border-white/15 my-1 py-1 ">
            <div>PROGR. TONNAGE MENSUEL/月度吨位</div>

            <progress
              className="progress  progress-success w-full "
              value={parseInt(data.tonnage)}
              max={60000}
            ></progress>
            <div className="text-[42pt]">
              {parseFloat(data.tonnage).toFixed(2)} T
            </div>

            <div className="p-1 bg-black w-fit text-white rounded-full px-2 ">
              TARGET: 60000T
            </div>
          </div>

          <div className=" border-b border-white/15 my-1 py-1 ">
            <div>JOURS RESTANT DU MOIS / 本月剩余天数</div>

            <progress
              className="progress progress-success w-full "
              value={
                GetDateParts("all", new Date(`${date.y}-${date.m}-${date.d}`))
                  .day
              }
              max={GetMonthNumDays(date.y, date.m).count}
            ></progress>
            <div className="text-[42pt]">
              {/*  {GetMonthNumDays().remaining} J/天 */}
              <CountdownTimer />
            </div>
            <div className="p-1 bg-black w-fit text-white rounded-full px-2  ">
              {JSON.stringify(date.d)}th /{" "}
              {GetMonthNumDays(date.y, date.m).count}
              {GetMonthNumDays(date.y, date.m).ext}
            </div>
          </div>

          <div className=" border-b border-white/15 my-1 py-1 ">
            <div>CIMENT EXPEDIE EN USD / 买的水泥</div>

            <div className="text-[22pt]">
              {formatAsMoney(parseFloat(data.tonnage) * 124, "USD")}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export function HUDBonus({ loads, agents, date, agents_by_team }) {
  const [, , user, setuser] = useContext(UserContext);
  const [loads_by_items, set_loads_by_items] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [lastUpdateDate, setlastUpdateDate] = useState();
  const [loading, setloading] = useState(false);

  useEffect(() => {
    parseData(user, loads, agents, date.y, date.m);
  }, [loads, agents, date]);

  async function parseData(user, loads, agents, y, m) {
    setloading(true);

    set_loads_by_items(loads);

    const sortedByShiftOfDay = SortLoadsByShiftOfDay(loads, y, m);

    const t_data = CaclculateAllTeamsTotals(sortedByShiftOfDay);
    t_data.A.agents = agents.filter(
      (it) =>
        it.equipe === "A" && it.active === "OUI" && it.section === SECTIONS[1]
    ).length;
    t_data.B.agents = agents.filter(
      (it) =>
        it.equipe === "B" && it.active === "OUI" && it.section === SECTIONS[1]
    ).length;
    t_data.C.agents = agents.filter(
      (it) =>
        it.equipe === "C" && it.active === "OUI" && it.section === SECTIONS[1]
    ).length;
    t_data.D.agents = agents.filter(
      (it) =>
        it.equipe === "D" && it.active === "OUI" && it.section === SECTIONS[1]
    ).length;

    console.log("new t_data", t_data);

    setTotalData(t_data);

    let last_load = loads[0];
    if (loads.length === 0) {
      last_load = { created_at: "N/A" };
    } else if (loads.length > 1) {
      last_load = loads[loads.length - 1];
    }
    setlastUpdateDate(last_load.created_at);
    setloading(false);
  }

  return (
    <Card
      id={1}
      title={`SUIVI BONUS/奖金计算 - ${date.y}年${date.m + 1}月`}
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
          tableMode={false}
          agents_by_team={agents_by_team}
        />
      )}
    </Card>
  );
}

export function HUDSacsCalc({}) {
  return (
    <Card
      id={2}
      title={"CALCUL SACS DECHIRES/破袋计算"}
      desc={"Calcul de sacs dechires/restants"}
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
                  ? " bg-sky-600 hover:outline-sky-500/20 text-white "
                  : " bg-white/25 text-sky-600  "
              } p-1 rounded-md text-sm  hover:bg-gray-400 outline-none   `}
              onClick={(e) => {
                setShowingAgentsList(!showingAgentsList);
                if (showingAgentsList) setSelectedAgent(undefined);
              }}
            >
              {showingAgentsList ? "OK" : "SEARH AGENT"}
            </button>
          </div>

          {showingAgentsList ? (
            selectedAgent ? (
              <AgentCardMini
                agent={selectedAgent}
                moreInfo={["contrat", "active"]}
              />
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

export function HUDCalculsBons() {
  return (
    <Card
      id={5}
      title={"CALCULS TONNAGE EFFECTUE/本日产量"}
      desc={"Calcul du tonnage effectue, apartir de bons"}
    >
      <LoadsCalculator show={true} showTitle={false} showSaveBtn={false} />
    </Card>
  );
}

function OpsLogs({}) {
  const [logs, setlogs] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const a = await SB.LoadAllItems(TABLES_NAMES.OPERATIONS_LOGS);
    setlogs(a.reverse().slice(0, 5));
    console.log("longs \n", a);
  }

  return loading ? (
    <Loading isLoading={true} />
  ) : (
    <div>
      {logs.map((lg, i) => (
        <div className=" border-b border-white/15 ">
          <div>
            <div>
              {i + 1}.{lg.mat} - {lg.op}
            </div>{" "}
            <div className="   block md:inline text-xs bg-white/20 p-1 rounded-md ">
              {FrenchDate(new Date(lg.created_at))}
            </div>
          </div>
          {lg.desc && (
            <div className="  text-xs opacity-50 italic font-serif ">
              {lg.desc}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function HUDOpsLogs() {
  return (
    <Card id={0} title={"OPERATIONS LOGS"} desc={"Logs des operations"}>
      <OpsLogs />
    </Card>
  );
}
