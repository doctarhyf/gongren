import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../App";
import {
  ACCESS_CODES,
  CARDS_BG_COLORS,
  COLUMNS_TO_HIDE,
  EQUIPES_NAMES,
  LOG_OPERATION,
  POSTE,
  POSTES,
  PRIME_MIN,
  SECTIONS,
  STOCK_TYPE,
  TEAMS_DATA,
  TONNAGE_MONTHLY_TARGET,
} from "../../helpers/flow";
import {
  AddLeadingZero,
  CaclculateAllTeamsTotals,
  FrenchDate,
  GetDateParts,
  GetMonthNumDays,
  GetShiftEndTime,
  GetShiftProgress,
  GroupBySectionAndEquipe,
  SortLoadsByShiftOfDay,
  UpdateOperationsLogs,
  UserHasAccessCode,
  formatAsMoney,
  formatCreatedAt,
  formatDateForDatetimeLocal,
} from "../../helpers/func";

import cont from "../../img/contf.png";
import pkg from "../../img/pkg.png";

import {
  GetTransForTokenName,
  GetTransForTokensArray,
  LANG_TOKENS,
} from "../../helpers/lang_strings";
import * as SB from "../../helpers/sb";
import { TABLES_NAMES } from "../../helpers/sb.config";
import camera from "../../img/camera.png";
import AgentsList from "../AgentsList";
import CountdownTimer from "../CountdownTimer";
import LoadsCalculator from "../LoadCalculator";
import Loading from "../Loading";
import SacsCalc from "../SacsCalc";
import TableLoadsTotals from "../TableLoadsTotal";
import Card from "./Card";
import { supabase } from "../../helpers/sb.config";
import { uploadPhoto } from "../../helpers/image_upload.mjs";
import ActionButton from "../ActionButton";
import print from "../../img/printer.png";
import { printAgentInfo } from "../../helpers/print";
import Stock from "../sacs/Stock";

function AgentStats({ agentsGrouped }) {
  const [, , user] = useContext(UserContext);
  return (
    <div>
      {Object.entries(agentsGrouped).map((sec) => (
        <div>
          <div>{GetTransForTokenName(sec[0], user.lang)}</div>
          <div className=" justify-center gap-4 align-middle   flex ">
            {Object.entries(sec[1]).map(
              (it, i) =>
                it[0] !== "-" && (
                  <div>
                    <div className=" text-[24pt] ">{it[1].length}</div>
                    <div className=" w-fit text-xs bg-white/25 rounded-md py-1 px-2  ">
                      {GetTransForTokenName(it[0], user.lang)}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AgentCardMini({
  agent,
  moreInfo,
  showUpdatePoste,
  onAgentUpdate,
  showPrintButton,
}) {
  const [, , user, setuser] = useContext(UserContext);
  const [loading, setloading] = useState(false);

  async function updatePoste(ag, new_poste) {
    ////console.log("new_poste => ", new_poste, ag);
    setloading(true);
    const upd = { id: ag.id, poste: new_poste };
    const r = await SB.UpdateItem(
      TABLES_NAMES.AGENTS,
      upd,
      async (s) => {
        setloading(false);
        ////console.log(s);
        await UpdateOperationsLogs(
          SB,
          user,
          LOG_OPERATION.AGENT_POST_UPDATE,
          `Old poste "${agent.poste}", new poste "${new_poste}"`
        );
      },
      (e) => {
        ////console.log(e);
        setloading(false);
      }
    );

    onAgentUpdate(upd);
  }

  function onPrintAgentInfo(agent, lang) {
    //alert("Print");
    ////console.log(agent);
    if (!printAgentInfo(agent, lang))
      alert("Error printing ... please select an agent!");
  }

  //console.log("AGG ", agent);

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
            {GetTransForTokensArray(LANG_TOKENS.SUP, user.lang)}
          </div>
        )}
        {agent.chef_deq === "OUI" && (
          <div className=" font-bold inline-block  bg-lime-600 p-1 text-xs rounded-md ">
            {GetTransForTokensArray(LANG_TOKENS.DEQ, user.lang)}
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
            <span className=" text-white/50  ">
              {GetTransForTokensArray(LANG_TOKENS.Workshop, user.lang)}:
            </span>{" "}
            {GetTransForTokenName(agent.section, user.lang)}
          </div>{" "}
          <div>
            <span className=" text-white/50  ">
              {GetTransForTokensArray(LANG_TOKENS.Position, user.lang)}:
            </span>{" "}
            {GetTransForTokenName(
              (POSTES[agent.poste] && POSTES[agent.poste].fr) || POSTE[3],
              user.lang
            )}
          </div>
          <div>
            <span className=" text-white/50  ">
              {GetTransForTokensArray(LANG_TOKENS.TEAM, user.lang)}:
            </span>{" "}
            {GetTransForTokenName(
              EQUIPES_NAMES[agent.equipe] || agent.equipe,
              user.lang
            )}
          </div>
          {agent.phone && (
            <div>
              <span className=" text-white/50  ">
                {GetTransForTokensArray(LANG_TOKENS.Phone, user.lang)}:
              </span>{" "}
              {agent.phone}
            </div>
          )}
          {
            <div>
              <span className=" text-white/50  ">
                {GetTransForTokensArray(LANG_TOKENS.expires, user.lang)}:
              </span>{" "}
              {UserHasAccessCode(user, ACCESS_CODES.ACCOUNT_CAN_NOT_EXPIRE) ? (
                <span className=" bg-green-950 text-green-500 border-green-500 px-2 rounded-md p-1  ">
                  {GetTransForTokensArray(
                    LANG_TOKENS.LIFE_TIME_NO_EXPIRATION,
                    user.lang
                  )}
                </span>
              ) : agent.expires ? (
                <span className=" bg-green-950 text-green-500 border-green-500 px-2 rounded-md p-1  ">
                  {" "}
                  {formatDateForDatetimeLocal(agent.expires).replace("T", " ")}
                </span>
              ) : (
                <span className=" bg-red-950 text-red-500 border-red-500 px-2 rounded-md text-xs p-1  ">
                  EXPIRED
                </span>
              )}
            </div>
          }
          {moreInfo &&
            moreInfo.map((it, i) => (
              <div>
                <span className=" text-white/50  ">{it}:</span> {agent[it]}
              </div>
            ))}
          {showUpdatePoste && agent.poste !== "SUP" && user.poste === "SUP" && (
            <div>
              <div>
                <span className=" text-white/50  ">Poste -:</span>
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
          {showPrintButton && (
            <ActionButton
              title={"PRINT"}
              icon={print}
              onClick={(e) => onPrintAgentInfo(agent, user.lang)}
            />
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
        ////console.log(e);
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
  const ref_photo = useRef();
  let agentDataToUpdate = { ...user };
  const agent = { ...user };

  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(URL.createObjectURL(file));

      const file_name = `agent_${agentDataToUpdate.id}.jpg`;
      const { photo } = agent;

      const { data } = await uploadPhoto(file, file_name, setUploading);

      if (photo) {
        const splits = agent.photo.split("/");
        const old_fname = splits[splits.length - 1];

        //console.log("old fname => ", old_fname);

        const r = await supabase.storage
          .from("agents_photos")
          .remove(old_fname);

        //console.log("Delete ", old_fname, " ==> ", r);
      } else {
        //console.log("no old photo");
      }

      if (data && data.publicUrl) {
        const { publicUrl } = data;
        //setphoto(publicUrl);
        await SB.UpdateItem(
          TABLES_NAMES.AGENTS,
          { id: user.id, photo: publicUrl },
          (s) => {
            const { photo } = s[0];
            setSelectedImage(photo);
            //console.log("upd s => ", photo);
          },
          (e) => {
            setSelectedImage(null);
            //console.log("upd e => ", e);
          }
        );
        //console.log(publicUrl);
        //alert(publicUrl);
      } else {
        alert(`error ...`);
      }
    } else {
      setSelectedImage(null);
    }
  };

  return (
    <div className="   md:text-center w-auto my-4 p-2 bg-gradient-to-br from-slate-600  to-slate-900 text-white shadow-2xl shadow-black  rounded-md">
      <div> {GetTransForTokensArray(LANG_TOKENS.MSG_WELCOME, user.lang)}</div>

      <div className="  flex justify-center items-center flex-col md:flex-row md:justify-center md:my-0 my-2 gap-4 ">
        <div className=" flex justify-center items-center  w-32 h-32 bg-slate-700 rounded-full overflow-hidden ">
          <input
            type="file"
            name="photo"
            accept="image/*"
            ref={ref_photo}
            hidden
            onChange={handleImageChange}
          />
          {!!user.photo || selectedImage ? (
            <button onClick={(e) => ref_photo.current.click()}>
              <img src={selectedImage || user.photo} />
            </button>
          ) : (
            <div className=" w-9 h-9 overflow-hidden   ">
              <button onClick={(e) => ref_photo.current.click()}>
                <img src={camera} />
              </button>
            </div>
          )}
        </div>

        <Loading isLoading={uploading} />
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
    ////console.log("sup => ", user);

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
    ////console.log(`Agents ${user.section}, equipe ${a.equipe} => \n`, a);
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
      title={`${GetTransForTokensArray(
        LANG_TOKENS.MY_TEAM,
        user.lang
      )} : ${GetTransForTokenName(
        user.section,
        user.lang
      )}, ${GetTransForTokenName(user.equipe, user.lang)}`}
      desc={`${GetTransForTokensArray(LANG_TOKENS.AGENTS_LIST, user.lang)}. (${
        agents.length
      } ${GetTransForTokensArray(LANG_TOKENS.AGENTS, user.lang)})`}
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
              key={ag.id}
              onClick={(e) => setselagent(ag)}
              className=" border-b border-white/25 p-1 flex hover:cursor-pointer hover:bg-white/10 rounded-md "
            >
              <div>{`${i + 1}. `} </div>
              <div>
                <div className=" font-bold  ">{`${ag.nom} ${ag.postnom} ${ag.prenom}`}</div>
                <div className="  text-xs ">
                  <span>{`${GetTransForTokenName(ag.poste, user.lang)}`}</span>
                  {ag.chef_deq === "OUI" && (
                    <span className=" font-bold inline-block  bg-black p-1 text-xs rounded-md ">
                      {GetTransForTokensArray(LANG_TOKENS.chef_deq, user.lang)}
                    </span>
                  )}
                  {ag.is_exp === "OUI" && (
                    <span className=" font-bold inline-block  bg-red-500 text-white p-1 text-xs rounded-md ">
                      {GetTransForTokensArray(LANG_TOKENS.EXPD, user.lang)}
                    </span>
                  )}
                  {ag.poste === "SUP" && (
                    <span className=" font-bold inline-block  bg-black p-1 text-xs rounded-md ">
                      {GetTransForTokensArray(LANG_TOKENS.SUP, user.lang)}
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
  const [, , user, setuser] = useContext(UserContext);

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
      title={GetTransForTokensArray(
        LANG_TOKENS.HUD_TITLE_LOADING_TRACKING,
        user.lang,
        { y: date.y, m: AddLeadingZero(date.m + 1) }
      )}
      desc={GetTransForTokensArray(LANG_TOKENS.HUD_DESC_LOADING, user.lang)}
    >
      {loading ? (
        <Loading isLoading={true} />
      ) : (
        <div>
          <div className=" border-b border-white/15 my-1 py-1 ">
            <div>
              {GetTransForTokensArray(
                LANG_TOKENS.TONS_ALREADY_LOADED_THIS_MONTH,
                user.lang
              )}
            </div>

            <div className="text-[42pt]">
              {parseFloat(data.tonnage).toFixed(2)} T
            </div>

            <progress
              className="progress  progress-success w-full "
              value={parseInt(data.tonnage)}
              max={TONNAGE_MONTHLY_TARGET}
            ></progress>

            <div>
              {(
                (parseFloat(data.tonnage) / TONNAGE_MONTHLY_TARGET) *
                100
              ).toFixed(2)}
              %
            </div>

            <div className="text-[16pt]   ">
              {GetTransForTokensArray(LANG_TOKENS.REST, user.lang)} :{" "}
              {(
                parseFloat(TONNAGE_MONTHLY_TARGET) - parseFloat(data.tonnage)
              ).toFixed(2)}{" "}
              T
            </div>

            <div className="p-1 bg-black w-fit text-white rounded-full px-2 ">
              {GetTransForTokensArray(LANG_TOKENS.TARGET, user.lang)}:{" "}
              {TONNAGE_MONTHLY_TARGET}T
            </div>
          </div>

          <div className=" border-b border-white/15 my-1 py-1 ">
            <div>
              {GetTransForTokensArray(LANG_TOKENS.DAYS_REM_IN_MONTH, user.lang)}
            </div>

            <div className="text-[42pt]">
              {/*  {GetMonthNumDays().remaining} J/天 */}
              <CountdownTimer />
            </div>
            <progress
              className="progress progress-success w-full "
              value={GetMonthNumDays().current}
              max={GetMonthNumDays().count}
            ></progress>
            <div>
              {(
                (GetMonthNumDays().current / GetMonthNumDays().count) *
                100
              ).toFixed(2)}
              %
            </div>

            <div className="p-1 bg-black w-fit text-white rounded-full px-2  ">
              {GetMonthNumDays().current}th /{" "}
              {GetMonthNumDays(date.y, date.m).count}
              {GetMonthNumDays(date.y, date.m).ext}
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

    // //console.table(t_data);

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

    ////console.log("new t_data", t_data);

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
      title={GetTransForTokensArray(
        LANG_TOKENS.HUD_TITLE_BONUS_TRACKING,
        user.lang,
        {
          y: date.y,
          m: AddLeadingZero(date.m + 1),
          t: parseInt(PRIME_MIN),
        }
      )}
      desc={GetTransForTokensArray(LANG_TOKENS.HUD_DESC_BONUS, user.lang)}
    >
      {loading ? (
        <Loading isLoading={true} />
      ) : agents_by_team ? (
        <TableLoadsTotals
          totalData={totalData}
          date={date}
          columnsToHide={[COLUMNS_TO_HIDE.SACS, COLUMNS_TO_HIDE.CDF]}
          lastUpdateDate={new Date(lastUpdateDate)}
          tableMode={false}
          agents_by_team={agents_by_team}
        />
      ) : null}
    </Card>
  );
}

export function HUDSacsCalc({}) {
  const [, , user] = useContext(UserContext);

  return (
    <Card
      id={2}
      title={GetTransForTokensArray(LANG_TOKENS.BAGS_CALC, user.lang)}
      desc={GetTransForTokensArray(LANG_TOKENS.BAGS_CALC_TORN_LEFT, user.lang)}
    >
      <SacsCalc />
    </Card>
  );
}

export function HUDGestionSacs() {
  const [, , user] = useContext(UserContext);
  const [loading, setloading] = useState(false);
  const [no_data, set_no_data] = useState(false);
  const [stock_cont, set_stock_cont] = useState({ s32: 0, s42: 0 });
  const [stock_prod, set_stock_prod] = useState({ s32: 0, s42: 0 });

  const [data, setdata] = useState({
    cont: { s32: 0, s42: 0 },
    prod: { s32: 0, s42: 0 },
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setloading(true);
    const sacs_cont = await SB.LoadAllItems(TABLES_NAMES.SUIVI_SACS_CONTAINER);

    const sacs_exit_cont = await SB.LoadAllItems(
      TABLES_NAMES.SACS_EXIT_CONTAINER
    );

    let last_rec = sacs_cont[sacs_cont.length - 1];

    if (last_rec) {
      set_stock_cont({ s32: last_rec.stock32, s42: last_rec.stock42 });
    }

    const sacs_prod = await SB.LoadAllItems(TABLES_NAMES.SACS_PRODUCTION);

    last_rec = sacs_prod[sacs_prod.length - 1];

    if (last_rec) {
      set_stock_prod({ s32: last_rec.restants32, s42: last_rec.restants42 });
    }

    setloading(false);
  }

  return (
    <Card
      id={9}
      title={GetTransForTokensArray(
        LANG_TOKENS.CONTAINER_BAGS_MANAGEMENT,
        user.lang
      )}
      desc={""}
    >
      {loading ? (
        <Loading isLoading={true} />
      ) : no_data ? (
        <div>No data</div>
      ) : (
        <div>
          <Stock
            id={STOCK_TYPE.CONTAINER}
            stock={stock_cont}
            label={GetTransForTokensArray(
              LANG_TOKENS.CONTAINER_REST,
              user.lang
            )}
          />
          <Stock
            id={STOCK_TYPE.PRODUCTION}
            stock={stock_prod}
            label={GetTransForTokensArray(LANG_TOKENS.PROD_REST, user.lang)}
            onResetStock={(e) => null}
          />
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
  const [, , user] = useContext(UserContext);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    ////console.log("q => ", q);
  }, [q]);

  function loadData() {
    setloading(true);
    SB.LoadAllItems2(
      TABLES_NAMES.AGENTS,
      (agents) => {
        setloading(false);

        const agentsf = agents.filter(
          (agent, i) => agent.active === "OUI" && agent.equipe !== "N/A"
        );
        const agentsg = GroupBySectionAndEquipe(agentsf);
        setAgentsFiltered(agentsf);
        setAgentsGrouped(agentsg);

        ////console.log("agsf f", agentsf);
      },
      (e) => {
        setloading(false);
        ////console.log(e);
        alert(`Error \n ${JSON.stringify(e)}`);
      }
    );
  }

  function onAgentClick(ag) {
    ////console.log(ag);
    setSelectedAgent(ag);
  }

  return (
    <Card
      id={4}
      title={`${GetTransForTokensArray(LANG_TOKENS.AGENTS_COUNT, user.lang)} (${
        agentsFiltered.length
      }) `}
      desc={GetTransForTokensArray(LANG_TOKENS.AGENTS_INFO, user.lang)}
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
              {showingAgentsList
                ? "OK"
                : GetTransForTokensArray(LANG_TOKENS.AGENT_SEARCH, user.lang)}
            </button>
          </div>

          {showingAgentsList ? (
            selectedAgent ? (
              <AgentCardMini
                agent={selectedAgent}
                moreInfo={["contrat", "active"]}
                showPrintButton={true}
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
  const [, , user] = useContext(UserContext);
  return (
    <Card
      id={5}
      title={GetTransForTokensArray(LANG_TOKENS.TONNAGE_CALCULATOR, user.lang)}
      desc={GetTransForTokensArray(
        LANG_TOKENS.TONNAGE_CALCULATOR_DESC,
        user.lang
      )}
    >
      <LoadsCalculator show={true} showTitle={false} showSaveBtn={false} />
    </Card>
  );
}

export function HUDCurrentTeam() {
  const [, , user] = useContext(UserContext);
  const [curt, setcurt] = useState("A");
  const [teamData, setTeamData] = useState(TEAMS_DATA.A);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const date = new Date();
    const m = date.getMonth();
    const y = date.getFullYear();
    const h = date.getHours();
    const isMorningShift = h >= 7 && h < 17;

    const day = date.getDate();

    const code = `${y}-${m.toString().padStart(2, "0")}`;
    const alltt = await SB.LoadAllItems(TABLES_NAMES.TIME_TABLE);
    let curtt = {};
    if (alltt.length > 0) {
      curtt = alltt.find((it) => it.code === code);
      if (curtt) {
        const [M, N, R] = curtt.tt.split("|");
        let dates = curtt.dates;

        if (isMorningShift) {
          dates = dates.split(",").map((it) => parseInt(it));
          const idx = dates.indexOf(day);
          const curt = M[idx];
          const tdata = TEAMS_DATA[curt];

          console.log("tdata => ", tdata);

          if (["A", "B", "C"].includes(curt)) {
            setTeamData(tdata);
          }
        } else {
          console.log("Evening data => ", N);
        }
      }
    }
  }

  // return <div>{JSON.stringify(teamData)}</div>;

  return (
    <Card
      id={8}
      title={GetTransForTokensArray(LANG_TOKENS.TEAM_ON_DUTY, user.lang)}
      desc={GetTransForTokensArray(LANG_TOKENS.CURRENT_TEAM_INFO, user.lang)}
    >
      <ShiftTeamCard teamData={teamData} />
    </Card>
  );
}

const ShiftTeamCard = ({ teamData }) => {
  const [, , user] = useContext(UserContext);
  const date = new Date();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  const d = date.getDate();
  const [h, seth] = useState(0);
  const [i, seti] = useState(0);

  const [progress, setProgress] = useState(35);

  function calculateTimeLeft() {
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();

    seth(h.toString().padStart(2, "0"));
    seti(m.toString().padStart(2, "0"));

    setProgress(GetShiftProgress());
  }

  useEffect(() => {
    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="  p-1 rounded-2xl w-full  shadow-lg space-y-6">
      <div className=" py-2 border-b border-teal-500 font-semibold flex items-center gap-2">
        <span role="img" aria-label="worker">
          👷‍♂️
        </span>
        <span>
          {GetTransForTokensArray(LANG_TOKENS.EQ, user.lang)} {teamData.team}
        </span>
        <span className="ml-auto text-sm">
          {y}年{m}月{d}日
        </span>
      </div>

      <div className="flex gap-4   ">
        <img
          src="./worker.png"
          alt="Supervisor"
          className="w-20 h-20 md:w-12 md:h-12 rounded-full border-2 border-teal-400 mb-2"
        />
        <div>
          <div className="uppercase text-sm text-teal-300">
            {GetTransForTokensArray(LANG_TOKENS.SUPERVISOR, user.lang)}
          </div>
          <div className="text-lg font-medium">
            {teamData.GCK.sup.nom} - {teamData.GCK.sup.zh}
          </div>
          <div>{teamData.GCK.sup.phone}</div>
        </div>
      </div>

      <div className="flex gap-4   ">
        <img
          src="./worker.png"
          alt="Squad Leader"
          className=" w-20 h-20 md:w-12 md:h-12 rounded-full border-2 border-teal-400 mb-2"
        />
        <div>
          <div className="uppercase text-sm text-teal-300">
            {GetTransForTokensArray(LANG_TOKENS.SQUAD_LEADER, user.lang)}
          </div>
          <div className="text-lg font-medium">
            {teamData.GCK.deq.nom} - {teamData.GCK.deq.zh}
          </div>
          <div>{teamData.GCK.deq.phone}</div>
        </div>
      </div>

      <div className="flex gap-4   ">
        <img
          src="./worker.png"
          alt="Supervisor"
          className="w-20 h-20 md:w-12 md:h-12 rounded-full border-2 border-teal-400 mb-2"
        />
        <div>
          <div className="uppercase text-sm text-teal-300">
            {GetTransForTokensArray(LANG_TOKENS.SUPERVISOR, user.lang)}
          </div>
          <div className="text-lg font-medium">
            {teamData.EMCO.nom} - {teamData.EMCO.zh}
          </div>
          <div>{teamData.EMCO.phone}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex  gap-2">
          <svg
            className="w-5 h-5 text-teal-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m6-4a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <div>
            <div className="text-sm uppercase">
              {GetTransForTokensArray(LANG_TOKENS.AGENTS_COUNT, user.lang)}
            </div>
            <div className="ml-auto text-xl font-medium">
              {teamData.agentsCount}
            </div>
          </div>
        </div>

        <div className="flex  gap-2">
          <svg
            className="w-5 h-5 text-teal-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 6v6l4 2M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          <div>
            <div className="text-sm uppercase">
              {GetTransForTokensArray(
                LANG_TOKENS.CURRENT_SHIFT_TIME,
                user.lang
              )}
            </div>
            <div className="ml-auto text-xl font-medium">
              {`${h}:${i} - ${GetShiftEndTime().str}`}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg
              className="w-5 h-5 text-teal-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 4v5h.582M20 20v-5h-.581M4 20h16M4 4h16" />
            </svg>
            <div className="text-sm uppercase">Shift Progress</div>
            <div className="ml-auto text-base font-medium">{progress}%</div>
          </div>
          <progress
            className="progress  progress-success w-full "
            value={progress}
            max={100}
          ></progress>
        </div>
      </div>
    </div>
  );
};

export function HUDOpsLogs() {
  const [logs, setlogs] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const d = await SB.LoadLastItems(TABLES_NAMES.OPERATIONS_LOGS, 10);

    setlogs(d);
  }

  return (
    <Card id={9} title={"Users Logs"} desc={"Users login and logouts logs"}>
      <table class="table-auto w-full text-sm ">
        <thead>
          <tr>
            <th className=" p-2 border  border-white/20  hidden sm:table-cell   ">
              No
            </th>
            <th className=" p-2 border  border-white/20  ">Date</th>
            <th className=" p-2 border  border-white/20  ">Matricule</th>
            <th className=" p-2 border  border-white/20 hidden sm:table-cell  ">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={3}>No Logos</td>
            </tr>
          ) : (
            logs.map((it, i) => (
              <tr>
                <td className=" p-2 border  border-white/20 hidden sm:table-cell  ">
                  {i + 1}
                </td>
                <td className=" p-2 border  border-white/20  ">
                  {formatCreatedAt(it.created_at)}
                </td>
                <td className=" p-2 border  border-white/20  ">
                  {it.matricule}
                </td>
                <td className=" p-2 border text-xs  border-white/20 hidden sm:table-cell  ">
                  {it.logged_out ? (
                    <span className=" bg-red-900 border-red-500 text-red-500  text-xs p-1 rounded-md  ">
                      LOGGED OUT
                    </span>
                  ) : (
                    <span className=" bg-emerald-900 border-emerald-500 text-emerald-500   p-1 text-xs rounded-md  ">
                      LOGGED IN
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
}
