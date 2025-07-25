import { useContext, useEffect, useState } from "react";
import { ACCESS_CODES, SHIFT_HOURS_ZH, SUPERVISORS } from "../../helpers/flow";
import {
  AddLeadingZero,
  GetDateParts,
  UserHasAccessCode,
} from "../../helpers/func";
import * as SB from "../../helpers/sb";
import { TABLES_NAMES } from "../../helpers/sb.config";
import gck from "../../img/gck.png";
import pen from "../../img/pen.png";
import pdf from "../../img/pdf.png";
import save from "../../img/save.png";
import wechat from "../../img/wechat.png";
import cancel from "../../img/shield.png";
import ActionButton from "../ActionButton";
import Loading from "../Loading";
import { UserContext } from "../../App";
import printBaozhuang from "../../helpers/print_bz";

export default function Boazhuang2({
  repportdata,
  onBaozhuangSave,
  editmode,
  onBaozhuangCancel,
  hideCancel,
}) {
  const [data, setdata] = useState({});
  const [editing, setediting] = useState(false);
  const [loading, setloading] = useState(false);
  const [newrep, setnewrep] = useState(false);
  const [, , user, setuser] = useContext(UserContext);

  useEffect(() => {
    makeCalculation();

    //const el = document.querySelector(".bzbox");

    // console.log(el);
  }, []);

  function makeCalculation() {
    //console.log("new rep dt ", repportdata);

    setnewrep(false);
    let defaultdata = { team: "A", s: "M" };

    if (user.poste === "SUP") defaultdata.team = user.equipe;
    if (!repportdata) {
      const dateparts = GetDateParts("all");
      defaultdata = {
        ...defaultdata,
        y: dateparts.year,
        m: dateparts.month + 1,
        d: dateparts.day,
      };
    }

    setdata(repportdata || defaultdata);
    setediting(editmode);
    setnewrep(undefined === repportdata);
    // console.log("rd => ", repportdata);
  }

  useEffect(() => {
    makeCalculation();
  }, [repportdata]);

  function RepportData2LoadData(rpdata) {
    const { team, y, m, d, sup, shift, s, camions, sacs, t, dechires } = rpdata;
    const code = `${team}_${s}_${y}_${m - 1}_${parseInt(d)}`;

    const load_data = {
      sacs: sacs,
      retours: 0,
      ajouts: 0,
      code: code,
      prob_machine: null,
      prob_courant: null,
      autre: null,
      camions: camions,
      dechires: dechires,
      sacs_adj: 0,
    };

    return load_data;
  }

  async function onSaveData(e) {
    if (editing) {
      console.log("will save first");
      setloading(true);

      const { team, y, m, d, sup, shift, s, camions, sacs, t, dechires } = data;
      const code = `${team}_${s}_${y}_${m - 1}_${parseInt(d)}`;

      const camions_isu = undefined === camions;
      const dechires_isu = undefined === dechires;
      const sacs_isu = undefined === sacs;
      const s_isu = undefined === s.includes("");

      if (camions_isu || dechires_isu || sacs_isu || s_isu) {
        alert("All data are required [camions, dechires, sacs, shift]!");
        setloading(false);
        return;
      }

      let res = undefined;
      const new_load_data = RepportData2LoadData(data);

      if (undefined !== repportdata) {
        const old_load_data = RepportData2LoadData(repportdata);

        console.log("old load data => ", old_load_data);
        console.log("new load data => ", new_load_data);

        const item2update = await SB.LoadItemWithColNameEqColVal(
          TABLES_NAMES.LOADS,
          "code",
          old_load_data.code
        );

        console.log("item2update => ", item2update);

        if (!!item2update) {
          res = await SB.DeleteItem(TABLES_NAMES.LOADS, item2update);
          console.log("del old load data res => ", res);
        }
      }

      res = await SB.InsertItem(TABLES_NAMES.LOADS, new_load_data);
      console.log("res insert ", res);

      if (null === res) {
        const text = newrep ? "saved" : "updated";
        alert(
          `Item with code " ${new_load_data.code} " was ${text} successfully`
        );
        setediting(false);

        onBaozhuangSave && onBaozhuangSave(res);
      }
      setloading(false);
      return;
    }

    setediting(!editing);
  }

  function GetShiftString(shiftcode) {
    const s = shiftcode;
    const shiftdata = SHIFT_HOURS_ZH[s];
    const shiftstring = `${shiftdata[0]} - ${shiftdata[1]} - ${shiftdata[2]}`;
    return shiftstring;
  }

  function onPrint(data) {
    printBaozhuang(data);
    //console.log(data);
  }

  async function onCopy(data) {
    const { team, y, m, d, sup, shift, s, camions, sacs, t, dechires } = data;

    const text = `${y}年${Number(m)}月${d}日
    
    •EMBALLAGE CIMENT水泥包装
•Équipe班：${team}
•Superviseur班长: @${sup} 
     •${shift}
•装车${camions}辆/Camions Chargés 
•袋子用${sacs}个/Sacs Utilisés 
•共计${t.toFixed(2)}吨/Tonne 
•撕裂的袋子${dechires}个/Sacs déchirés`;

    await navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
        alert("Text copied to clipboard");
        console.log(text);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy text:!\n" + JSON.stringify(err));
      });
  }

  return (
    <div className=" bzbox  border dark:bg-white dark:text-black border-slate-600 shadow-lg dark:shadow-white/20 shadow-slate-400 mx-auto  sm:max-w-[26rem] p-4 ">
      <div className="  text-end ">
        {editing ? (
          <input
            type="date"
            className="p-1 dark:bg-slate-700 dark:text-white rounded-md outline-none border-2 mx-1 border-purple-500"
            value={`${data.y}-${AddLeadingZero(data.m)}-${AddLeadingZero(
              data.d
            )}`}
            onChange={(e) => {
              const date = e.target.value;
              const [y, m, d] = date.split("-");

              setdata((prev) => ({ ...prev, y: y, m: m, d: d }));
            }}
          />
        ) : (
          <>
            <span className=" font-bold underline">{data.y}</span>年
            <span className=" font-bold underline">{data.m}</span>月
            <span className=" font-bold underline">{data.d}</span>日
          </>
        )}
      </div>
      <div className=" w-32 h-fit  ">
        <img src={gck} />
      </div>
      <div className=" my-4  text-center underline font-bold ">
        •EMBALLAGE CIMENT水泥包装{" "}
      </div>
      <div>
        •Équipe班:
        {editing ? (
          user.poste === "SUP" && !data.team === "B" ? (
            <span className=" font-bold underline ">{data.team}</span>
          ) : (
            <select
              className="p-1 dark:bg-slate-700 dark:text-white rounded-md outline-none border-2 mx-1  border-purple-500"
              value={data.team}
              onChange={(e) =>
                setdata((prev) => ({ ...prev, team: e.target.value }))
              }
            >
              {["A", "B", "C", "D"].map((team, i) => (
                <option key={i} selected={team === data.team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          )
        ) : (
          <span className=" font-bold underline ">{data.team}</span>
        )}
      </div>
      <div>
        •Superviseur班长: @
        <span className=" font-bold underline ">
          {`${SUPERVISORS[data.team]?.nom} - ${SUPERVISORS[data.team]?.zh}`}
        </span>
      </div>
      <div>
        •
        {editing ? (
          <select
            className="p-1 dark:bg-slate-700 dark:text-white rounded-md outline-none border-2 mx-1  border-purple-500"
            value={data.s}
            onChange={(e) => {
              const s = e.target.value;
              const shift = GetShiftString(s);
              setdata((prev) => ({ ...prev, shift: shift, s: s }));
            }}
          >
            {Object.entries(SHIFT_HOURS_ZH).map((shiftd, i) => (
              <option key={i} value={shiftd[0]}>
                {GetShiftString(shiftd[0])}
              </option>
            ))}
          </select>
        ) : (
          <span className=" font-bold underline ">{data.shift}</span>
        )}
      </div>
      <div>
        •装车
        {editing ? (
          <input
            className="p-1 dark:bg-slate-700 dark:text-white rounded-md outline-none border-2 mx-1 w-16 border-purple-500"
            type="number"
            value={data.camions}
            onChange={(e) =>
              setdata((prev) => ({
                ...prev,
                camions: parseInt(e.target.value),
              }))
            }
          />
        ) : (
          <span className=" font-bold underline ">{data.camions}</span>
        )}
        辆/Camions Chargés
      </div>
      <div>
        •袋子用
        {editing ? (
          <input
            type="number"
            className="p-1 dark:bg-slate-700 dark:text-white rounded-md outline-none border-2 mx-1 w-20 border-purple-500"
            value={data.sacs}
            onChange={(e) => {
              const sacs = parseInt(e.target.value);
              setdata((prev) => ({ ...prev, sacs: sacs }));
              setdata((prev) => ({
                ...prev,
                t: (parseFloat(sacs) / 20).toFixed(2),
              }));
            }}
          />
        ) : (
          <span className=" font-bold underline ">{data.sacs}</span>
        )}
        个/Sacs Utilisés
      </div>
      <div>
        •共计
        <span className=" font-bold underline ">{data.t}</span>
        吨/Tonne
      </div>
      <div>
        •撕裂的袋子
        {editing ? (
          <input
            type="number"
            className="p-1 dark:bg-slate-700 dark:text-white rounded-md outline-none border-2 mx-1 w-20 border-purple-500"
            value={data.dechires}
            onChange={(e) => {
              setdata((prev) => ({
                ...prev,
                dechires: parseInt(e.target.value),
              }));
            }}
          />
        ) : (
          <span className=" font-bold underline ">{data.dechires}</span>
        )}
        个/Sacs déchirés`;
      </div>

      <div className=" my-4 justify-between m-1 flex ">
        {(UserHasAccessCode(user, ACCESS_CODES.SAVE_LOAD) ||
          UserHasAccessCode(user, ACCESS_CODES.UPDATE_LOAD) ||
          (user.poste === "SUP" && data.team === user.equipe)) && (
          <ActionButton
            disabled={loading}
            icon={editing ? save : pen}
            onClick={onSaveData}
            title={editing ? "SAVE" : "EDIT"}
          />
        )}

        {!editing && !loading && (
          <ActionButton
            icon={pdf}
            onClick={(e) => onPrint(repportdata)}
            title={"Print"}
          />
        )}
        {!editing && !loading && (
          <ActionButton
            icon={wechat}
            onClick={(e) => {
              e.preventDefault();
              onCopy(data);
            }}
            title={"Copy for Wechat"}
          />
        )}
        {editing && !loading && !hideCancel && (
          <ActionButton
            icon={cancel}
            onClick={(e) => {
              setediting(false);
              setloading(false);

              if (newrep) onBaozhuangCancel();
            }}
            title={"CANCEL"}
          />
        )}
      </div>
      <Loading isLoading={loading} />
    </div>
  );
}
