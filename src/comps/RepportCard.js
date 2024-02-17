import { useEffect, useRef, useState } from "react";
import {
  CLASS_BTN,
  CLASS_REPPORT_CARD,
  SHIFT_HOURS_ZH,
  SUPERVISORS,
} from "../helpers/flow";
import { doc, draw_load_table, printShiftData } from "../helpers/funcs_print";
import ButtonPrint from "./ButtonPrint";
import { ParseDayRepport } from "../helpers/func";

export default function RepportCard({
  data,
  onUpdateShiftData,
  onDeleteShiftData,
}) {
  const [weixinRepport, setWeixinRepport] = useState(false);

  function onPrintDailyRepport(data) {
    draw_load_table(data);
    //console.log("print day rep", data);
  }

  function onPrintShiftRepport(data) {
    const text = GenShiftRepportText(data);
    console.log(text);
    alert("Will be impemented!\n" + JSON.stringify(data));
    printShiftData(doc, text);
  }

  function copyToClipboard(shift_data) {
    const text = GenShiftRepportText(shift_data);

    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard: \n" + text);
        alert("Text copied to clipboard: \n" + text);
      })
      .catch((err) => {
        console.error("Unable to copy text to clipboard \n", err);
        alert("Unable to copy text to clipboard \n", err);
      });
  }

  function GenShiftRepportText(data) {
    const dt = JSON.parse(data.upd);
    const { shift, team, date, sacs, dechires, camions } = dt;
    const [d, m, y] = date.split("/");
    console.log(" dttt ===> [d,m,y] : ", d, m, y, date);
    const { nom, zh } = SUPERVISORS[team];
    const shift_data = SHIFT_HOURS_ZH[shift];
    const tonnage = Number(sacs) / 20;

    return `•EMBALLAGE CIMENT水泥包装
${y}年${Number(m) + 1}月${d}日
Équipe班：${team}
Superviseur班长: @${nom} ${zh} 
     •${shift_data}
装车${camions}辆/Camions Chargés 
袋子用${sacs}个/Sacs Utilisés 
共计${tonnage.toFixed(2)}吨/Tonne 
撕裂的袋子${dechires}个/Sacs déchirés`;
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
            <button
              className={CLASS_BTN}
              onClick={(e) => copyToClipboard(data)}
            >
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
              onClick={(e) => {
                if (window.confirm("Are you sure you wanna delete?")) {
                  onDeleteShiftData(data);
                }
              }}
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
