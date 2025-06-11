import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../App";
import {
  CARDS_BG_COLORS,
  COLUMNS_TO_HIDE,
  EQUIPES_NAMES,
  LOG_OPERATION,
  POSTE,
  POSTES,
  PRIME_MIN,
  SECTIONS,
  TONNAGE_MONTHLY_TARGET,
} from "../../helpers/flow";
import {
  AddLeadingZero,
  CaclculateAllTeamsTotals,
  FrenchDate,
  GetDateParts,
  GetMonthNumDays,
  GroupBySectionAndEquipe,
  SortLoadsByShiftOfDay,
  UpdateOperationsLogs,
  formatAsMoney,
} from "../../helpers/func";
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
    //console.log("new_poste => ", new_poste, ag);
    setloading(true);
    const upd = { id: ag.id, poste: new_poste };
    const r = await SB.UpdateItem(
      TABLES_NAMES.AGENTS,
      upd,
      async (s) => {
        setloading(false);
        //console.log(s);
        await UpdateOperationsLogs(
          SB,
          user,
          LOG_OPERATION.AGENT_POST_UPDATE,
          `Old poste "${agent.poste}", new poste "${new_poste}"`
        );
      },
      (e) => {
        //console.log(e);
        setloading(false);
      }
    );

    onAgentUpdate(upd);
  }

  function onPrintAgentInfo(agent, lang) {
    //alert("Print");
    //console.log(agent);
    if (!printAgentInfo(agent, lang))
      alert("Error printing ... please select an agent!");
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
        //console.log(e);
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

        console.log("old fname => ", old_fname);

        const r = await supabase.storage
          .from("agents_photos")
          .remove(old_fname);

        console.log("Delete ", old_fname, " ==> ", r);
      } else {
        console.log("no old photo");
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
            console.log("upd s => ", photo);
          },
          (e) => {
            setSelectedImage(null);
            console.log("upd e => ", e);
          }
        );
        console.log(publicUrl);
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
    //console.log("sup => ", user);

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
    //console.log(`Agents ${user.section}, equipe ${a.equipe} => \n`, a);
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
              REST :{" "}
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

    // console.table(t_data);

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

    //console.log("new t_data", t_data);

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
  const [loading, setloading] = useState(false);
  const [no_data, set_no_data] = useState(false);

  const [data, setdata] = useState({
    cont: { s32: 0, s42: 0 },
    prod: { s32: 0, s42: 0 },
  });

  useEffect(() => {
    loadData();
  }, []);

  //const [stockCont, setStockCont] = useState([]);
  const [stockProd, setStockProd] = useState([]);
  async function loadData() {
    set_no_data(false);
    setloading(true);
    const stockCont = await SB.LoadAllItems(TABLES_NAMES.DAIZI_JIZHUANGXIANG);
    const stockProd = await SB.LoadAllItems(TABLES_NAMES.DAIZI_SHENGCHAN);
    setStockProd(stockProd);

    console.log(stockCont);
    console.log(stockProd);

    const stockContLen = stockCont.length;
    const stockProdLen = stockProd.length;

    console.log("stockContLen", stockContLen, "stockProdLen", stockProdLen);

    if (stockContLen === 0 || stockProdLen === 0) {
      setloading(false);
      set_no_data(true);
      return;
    }

    const stockContLastEl = stockCont[stockContLen - 1];
    const stockProdLastEl = stockProd[stockProdLen - 1];

    const { stock32, stock42 } = stockContLastEl;
    const { rest32, rest42 } = stockProdLastEl;

    console.log(stockProdLastEl);

    setdata({
      cont: { s32: stock32, s42: stock42 },
      prod: { s32: rest32, s42: rest42 },
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
      ) : no_data ? (
        <div>No data</div>
      ) : (
        <div className="">
          <div>
            {[
              ["集装箱袋数", data.cont],
              ["剩余总量", data.prod],
            ].map((stock, i) => (
              <div className=" border-b border-b-white/10 py-2 ">
                <div className=" bg-purple-950  px-2 py-1 w-fit rounded-md ">
                  {stock[0]}
                </div>
                {Object.entries(stock[1]).map((s, i) => (
                  <div className="  ">
                    <div>
                      <span className=" font-bold  px-2 text-sm  ">
                        {`${s[0]} `}
                      </span>
                      :<span className=" text-[16pt] "> {s[1]}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div>
            <div className=" text-sm font-bold  my-2 ">Last 5 records</div>
            <table className="  text-xs w-full">
              <tr>
                <td className=" border p-1  ">No</td>
                <td className=" border p-1  ">Date</td>
                <td className=" border p-1  ">srt.32</td>
                <td className=" border p-1  ">srt.42</td>
                <td className=" border p-1  ">T32</td>
                <td className=" border p-1  ">T42</td>
              </tr>
              {stockProd &&
                stockProd
                  .sort((a, b) => b.id - a.id)
                  .map(
                    (it, i) =>
                      i < 5 && (
                        <tr>
                          <td className=" border p-1  ">{i + 1}</td>
                          <td className=" border p-1  ">
                            {it.date_time.replace("T", " ")}
                          </td>
                          <td className=" border p-1  ">{it.used_32}</td>
                          <td className=" border p-1  ">{it.used_42}</td>
                          <td className=" border p-1  ">{it.t_32}</td>
                          <td className=" border p-1  ">{it.t_42}</td>
                        </tr>
                      )
                  )}
            </table>
          </div>
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
    //console.log("q => ", q);
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

        //console.log("agsf f", agentsf);
      },
      (e) => {
        setloading(false);
        //console.log(e);
        alert(`Error \n ${JSON.stringify(e)}`);
      }
    );
  }

  function onAgentClick(ag) {
    //console.log(ag);
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

function OpsLogs({}) {
  const [logs, setlogs] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const a = await SB.LoadAllItems(TABLES_NAMES.OPERATIONS_LOGS);
    setlogs(a.reverse().slice(0, 5));
    //console.log("longs \n", a);
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

export function HUDCurrentTeam() {
  return (
    <Card
      id={8}
      title={"EQUIPE EN POSTE"}
      desc={"Information sur l'equipe presentement en poste"}
    >
      <ShiftTeamCard />
    </Card>
  );
}

const ShiftTeamCard = () => {
  const date = new Date();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  const d = date.getDate();

  const teamData = {
    team: "B",
    supervisor: "NKULU MWENZE Christian 库鲁",
    squadLeader: "KASONGO NUMBI Jina 奴婢",
    agentsCount: 14,
    currentShiftTime: "07:00 – 17:00",
    shiftProgress: 20,
  };

  return (
    <div className=" p-1 rounded-2xl w-full max-w-sm shadow-lg space-y-6">
      <div className=" py-2 border-b border-teal-500 font-semibold flex items-center gap-2">
        <span role="img" aria-label="worker">
          👷‍♂️
        </span>
        <span>EQUIPE {teamData.team}</span>
        <span className="ml-auto text-sm">
          {y}年{m}月{d}日
        </span>
      </div>

      <div className="flex gap-4   ">
        <img
          src="https://ltvavdcgdrfqhlfpgkks.supabase.co/storage/v1/object/public/agents_photos/1732797003087.jpeg"
          alt="Supervisor"
          className="w-20 h-20 md:w-12 md:h-12 rounded-full border-2 border-teal-400 mb-2"
        />
        <div>
          <div className="uppercase text-sm text-teal-300">Supervisor</div>
          <div className="text-lg font-medium">{teamData.supervisor}</div>
        </div>
      </div>

      <div className="flex gap-4   ">
        <img
          src="https://ltvavdcgdrfqhlfpgkks.supabase.co/storage/v1/object/public/agents_photos/1732797003087.jpeg"
          alt="Squad Leader"
          className=" w-20 h-20 md:w-12 md:h-12 rounded-full border-2 border-teal-400 mb-2"
        />
        <div>
          <div className="uppercase text-sm text-teal-300">Squad Leader</div>
          <div className="text-lg font-medium">{teamData.squadLeader}</div>
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
            <div className="text-sm uppercase">Agent Count</div>
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
            <div className="text-sm uppercase">Current Shift Time</div>
            <div className="ml-auto text-xl font-medium">
              {teamData.currentShiftTime}
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
            <div className="ml-auto text-base font-medium">
              {teamData.shiftProgress}%
            </div>
          </div>
          <div className="w-full h-2 bg-teal-900 rounded-full overflow-hidden">
            <div
              className={`h-full bg-teal-400 rounded-full w-[${teamData.shiftProgress}%]`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
