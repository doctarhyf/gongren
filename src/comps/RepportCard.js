import { useState } from "react";
import { CLASS_BTN } from "../helpers/flow";
import { draw_load_table } from "../helpers/funcs_print";
import ButtonPrint from "./ButtonPrint";

export default function RepportCard({
  data,
  onUpdateShiftData,
  onDeleteShiftData,
}) {
  const [weixinRepport, setWeixinRepport] = useState(false);

  function onPrintDailyRepport(data) {
    draw_load_table(data);
    //console.log(data);
  }

  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard: " + text);
      })
      .catch((err) => {
        console.error("Unable to copy text to clipboard", err);
      });
  }

  function onCopyText() {
    let txt = `•EMBALLAGE CIMENT水泥包装
2024年1月26日
Équipe班：A
Superviseur班长: @Albert Kankombwe 
     •MATIN白班
装车26辆/Camions Chargés 
袋子用12 495个/Sacs Utilisés 
共计624.75吨/Tonne 
撕裂的袋子20个/Sacs déchirés`;
    copyToClipboard(txt);
    alert(`Text copied!`);
  }

  return (
    <div className="border mt-2 rounded-md p-1 bg-neutral-100 shadow-md">
      <div className=" text-sky-500">
        <div className="py-1 text-xl border-b mb-1">
          {" "}
          Rapport {data && data.type} / {data && data.type && data.date}
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Weixin Repport</span>
            <input
              type="checkbox"
              className="toggle"
              checked={weixinRepport}
              onChange={(e) => setWeixinRepport(e.target.checked)}
            />
          </label>
        </div>
      </div>

      {!weixinRepport && (
        <div>
          {data &&
            Object.entries(data).map((k, v) => (
              <div>
                {!["date", "type", "tid", "upd", "data"].includes(k[0]) && (
                  <>
                    {" "}
                    {k[0]} : <b>{k[1]}</b>
                  </>
                )}
              </div>
            ))}
        </div>
      )}
      {weixinRepport && (
        <div>
          <div>
            <div>•EMBALLAGE CIMENT水泥包装</div>
            <div>2024年1月22日</div>
            <div>Équipe班：D</div>
            <div>Superviseur班长:@katanga  遍但</div>
            <div> •MATIN白班 装车24辆/Camions Chargés</div>
            <div>袋子用11 070个/Sacs Utilisés</div>
            <div>共计553.5吨/Tonne</div>
            <div>撕裂的袋子19个/Sacs déchirés</div>
          </div>
          <div>
            <button className={CLASS_BTN} onClick={(e) => onCopyText()}>
              COPY
            </button>
          </div>
        </div>
      )}
      {data && data.tid === "s" && (
        <div className="flex gap-2">
          <div>
            <button
              onClick={(e) => onUpdateShiftData(data)}
              className={CLASS_BTN}
            >
              UPDATE
            </button>
          </div>
          <div>
            <button
              onClick={(e) => onDeleteShiftData(data)}
              className={CLASS_BTN}
            >
              DELETE
            </button>
          </div>
        </div>
      )}

      {data && data.tid === "d" && (
        <div>
          <ButtonPrint
            onClick={(e) => onPrintDailyRepport(data)}
            title={"PRINT DAILY REPPORT."}
          />
        </div>
      )}
    </div>
  );
}
