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

export default function Boazhuang2({
  repportdata,
  onBaozhuangSave,
  editmode,
  onBaozhuangCancel,
}) {
  const [data, setdata] = useState({});
  const [editing, setediting] = useState(false);
  const [loading, setloading] = useState(false);
  const [newrep, setnewrep] = useState(false);
  const [, , user, setuser] = useContext(UserContext);

  useEffect(() => {
    console.log("new rep dt ", repportdata);

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
    console.log("rd => ", repportdata);
  }, []);

  useEffect(() => {
    console.log("new rep dt ", repportdata);

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
    console.log("rd => ", repportdata);
  }, [repportdata]);

  async function onSaveData(e) {
    if (editing) {
      console.log("will save first");
      setloading(true);

      //console.log(data);

      const { team, y, m, d, sup, shift, s, camions, sacs, t, dechires } = data;
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

      console.log(load_data);

      const camions_isu = undefined === camions;
      const dechires_isu = undefined === dechires;
      const sacs_isu = undefined === sacs;
      const s_isu = undefined === s.includes("");

      if (camions_isu || dechires_isu || sacs_isu || s_isu) {
        alert("All data are required [camions, dechires, sacs, shift]!");
        setloading(false);
        return;
      }

      const res = await SB.UpsertItem(TABLES_NAMES.LOADS, load_data, "code");

      if (res && res.id) {
        const text = newrep ? "saved" : "updated";
        alert(`Item with code " ${load_data.code} " was ${text} successfully`);
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

  function onPrint() {
    alert("Printing bon ...");
  }

  async function onCopy(data) {
    const { team, y, m, d, sup, shift, s, camions, sacs, t, dechires } = data;

    const text = `•EMBALLAGE CIMENT水泥包装
${y}年${Number(m)}月${d}日
Équipe班：${team}
Superviseur班长: @${sup} 
     •${shift}
装车${camions}辆/Camions Chargés 
袋子用${sacs}个/Sacs Utilisés 
共计${t.toFixed(2)}吨/Tonne 
撕裂的袋子${dechires}个/Sacs déchirés`;

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
    <div className="  border dark:bg-white dark:text-black border-slate-600 shadow-lg dark:shadow-white/20 shadow-slate-400 mx-auto  sm:max-w-[26rem] p-4 ">
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
          user.poste === "SUP" ? (
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
        {(UserHasAccessCode(user, ACCESS_CODES.UPDATE_LOAD) ||
          (user.poste === "SUP" && data.team === user.equipe)) && (
          <ActionButton
            disabled={loading}
            icon={editing ? save : pen}
            onClick={onSaveData}
            title={editing ? "SAVE" : "EDIT"}
          />
        )}

        {!editing && !loading && (
          <ActionButton icon={pdf} onClick={onPrint} title={"Print"} />
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
        {editing && !loading && (
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
