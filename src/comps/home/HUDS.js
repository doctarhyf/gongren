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
} from "../../helpers/flow";
import AgentsList from "../AgentsList";
import SacsCalc from "../SacsCalc";
import CountdownTimer from "../CountdownTimer";

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
      <div className="flex gap-1">
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
      {/* <div className=" flex justify-center ">
        <div className=" object-cover bg-white/25 rounded-full flex justify-center align-middle items-center w-[60pt] overflow-hidden h-[60pt] ">
          <img src={agent.photo} />
        </div>
      </div> */}
      <div className=" flex justify-between text-3xl  ">
        <div>
          <div>Mr. {agent.prenom}</div>
          <div>
            {" "}
            {agent.nom} {agent.postnom}{" "}
            {agent.mingzi && <span className=" text-sm  ">{agent.mingzi}</span>}
          </div>
        </div>
      </div>
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
      {showUpdatePoste && (
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
    <div className="w-auto my-4 p-2 bg-gray-800 text-white shadow-lg shadow-black/25 rounded-md">
      <div> Bienvenu au portal de la cimenterie</div>

      <AgentCardMini agent={user} />
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
      title={`SUVI CHARGEMENT/月份装量计算 - ${AddLeadingZero(m + 1)}/${y}`}
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
              value={GetDateParts().day}
              max={GetMonthNumDays().count}
            ></progress>
            <div className="text-[42pt]">
              {/*  {GetMonthNumDays().remaining} J/天 */}
              <CountdownTimer />
            </div>
            <div className="p-1 bg-black w-fit text-white rounded-full px-2  ">
              {JSON.stringify(GetDateParts().day)}th / {GetMonthNumDays().count}
              {GetMonthNumDays().ext}
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
      title={`SUIVI BONUS/奖金计算 - ${y}年${m + 1}月`}
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
        />
      )}
    </Card>
  );
}

export function HUDSacsCalc({}) {
  return (
    <Card
      id={2}
      title={"CALCULATRICE POUR SACS/破袋计算"}
      desc={"Calcul sacs dechires/restants"}
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

function OpsLogs({}) {
  const [logs, setlogs] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const a = await SB.LoadAllItems(TABLES_NAMES.OPERATIONS_LOGS);
    setlogs(a.reverse().slice(0, 5));
    console.log("longs \n", a);
  }

  return (
    <div>
      {logs.map((lg, i) => (
        <div className=" border-b border-white/15 ">
          <span>{i + 1}.</span> <b>{lg.mat}</b>, {lg.op} on {lg.created_at}
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
