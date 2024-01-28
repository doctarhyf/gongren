import { useEffect, useRef, useState } from "react";
import {
  CLASS_BTN,
  CLASS_REPPORT_CARD,
  SHIFT_HOURS_ZH,
  SUPERVISORS,
} from "../helpers/flow";
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

  function onPrintShiftRepport(data) {
    console.log(data);
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

  let rep_data = undefined;

  if (data && data.upd) {
    rep_data = JSON.parse(data.upd);
    const [day, month, year] = rep_data.date.split("/");

    rep_data.day = day;
    rep_data.month = month;
    rep_data.year = year;
  }

  const [isSticky, setIsSticky] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const headerRect = headerRef.current.getBoundingClientRect();

      const threshold = 100;

      setIsSticky(scrollPosition > threshold);
      setHeaderOffset(headerRect.left);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={headerRef}
      className={`${CLASS_REPPORT_CARD} ${isSticky ? "fixed top-0" : ""} `}
      style={{ left: isSticky ? headerOffset + "px" : "auto" }}
    >
      <div className=" text-sky-500">
        <div className="py-1 text-xl border-b mb-1">
          <div>Rapport {data && data.type}</div>
          <div className="text-sm">{data && data.type && data.date}</div>
        </div>

        {data && data.tid === "s" && (
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
        )}
      </div>

      {(data && data.tid === "s" && weixinRepport) ||
        (true && (
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
        ))}
      {weixinRepport && rep_data && (
        <div>
          <div className="p-2">
            <div>•EMBALLAGE CIMENT水泥包装</div>
            <div className=" font-bold ">
              {rep_data.year}年{Number(rep_data.month) + 1}月{rep_data.day}日
            </div>
            <div>
              Équipe班：<span className="font-bold">{rep_data.team}</span>
            </div>
            <div>
              Superviseur班长:
              <span className="font-bold">
                @{SUPERVISORS[rep_data.team].nom}
                {SUPERVISORS[rep_data.team].zh}
              </span>
            </div>
            <div>
              {" "}
              •{SHIFT_HOURS_ZH[rep_data.shift][0]}
              <span className="font-bold">
                {SHIFT_HOURS_ZH[rep_data.shift][1]} 装车{rep_data.camions}
              </span>
              辆/Camions Chargés
            </div>
            <div>
              袋子用
              <span className="font-bold">{rep_data.sacs}个/Sacs Utilisés</span>
            </div>
            <div>
              共计
              <span className="font-bold">
                {(Number(rep_data.sacs) / 20).toFixed(2)}吨/Tonne
              </span>
            </div>
            <div>
              撕裂的袋子
              <span className="font-bold">
                {rep_data.dechires}个/Sacs déchirés
              </span>
            </div>
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

      {data && data.tid === "s" && (
        <div>
          <ButtonPrint
            onClick={(e) => onPrintShiftRepport(data)}
            title={"PRINT SHIFT REPPORT."}
          />
        </div>
      )}
    </div>
  );
}
