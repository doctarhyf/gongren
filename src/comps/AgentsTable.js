import React, { useContext, useRef, useState } from "react";

import userEvent from "@testing-library/user-event";
import { UserContext } from "../App";
import {
  CLASS_INPUT_TEXT,
  CLASS_TD,
  CLASS_TODAY,
  KAOQIN,
  rldToPrintSymbols,
} from "../helpers/flow";
import { _, getDaysInMonth, printPDF1 } from "../helpers/func";
import { print_agents_rl } from "../helpers/funcs_print";
import GetRoulemenDaysData from "../helpers/GetRoulemenDaysData.mjs";
import {
  GetTransForTokenName,
  GetTransForTokensArray,
  LANG_TOKENS,
} from "../helpers/lang_strings";
import pdf from "../img/pdf.png";
import shield from "../img/shield.png";
import sup from "../img/sup.png";
import ActionButton from "./ActionButton";
import ItemNotSelected from "./ItemNotSelected";

export default function AgentsTable({
  agentsf,
  ref_sp_equipe,
  ref_sp_section,
  ref_sp_m,
  ref_sp_y,
  list_title,
  daysLetters,
  isCustomList,
  customAgentsList,
  customAgentsTableName,
  onCustomAgentClick,
}) {
  const [, , user] = useContext(UserContext);
  const COL_SPAN = 4;
  let year;
  let month;

  let daysCount = 31;

  if (agentsf.length > 0) {
    let ag = agentsf[0];

    const [mc, agent_id, y, m] = ag.rld.month_code.split("_");
    year = Number(y);
    month = Number(m);

    daysCount = new Date(Number(y), Number(m) + 1, 0).getDate();
  }

  const ref_custom_title = useRef();

  function printNameListPDF(agents_array, customTitle) {
    //const customTitle = _(ref_custom_title);

    if (agents_array.length === 0) {
      alert("Agents list cant be empty!");
      return;
    }

    printPDF1(
      agents_array,
      customTitle.trim().length > 0 ? customTitle : undefined
    );
  }

  const ref_print_empty = useRef();

  const ref_adjust_m4 = useRef();
  function printAgentsRoulementPDF(agents_array, adjustM4) {
    if (agents_array.length === 0) {
      alert("Agents list cant be empty!");
      return;
    }

    const agents_rld_parsed_data = PrepareAgentsPrintRLD(agents_array); //GetRandomArray(20);
    const print_empty = ref_print_empty.current.checked;

    print_agents_rl(
      agents_rld_parsed_data,
      print_empty,
      customAgentsTableName,
      adjustM4
    );
  }

  function PrepareAgentsPrintRLD(array) {
    if (array.length === 0) {
      alert("Error agents array must not have length of 0!");
      return;
    }

    const res = array.map((ag, index) => {
      let [mc, rl_id, y, m] = ag.rld.month_code.split("_");
      m = Number(m) + 1;
      y = Number(y);

      const num_days_in_month = getDaysInMonth(y, m, true);
      //alert(`days in month ${num_days_in_month}`);
      const rld = ag.rld.rl.slice(0, num_days_in_month);

      let ad = {
        nom: {
          fr: `${ag.nom} ${ag.postnom} ${ag.prenom}`,
          zh: ` ${ag.mingzi}`,
        },
        rld: rld,
        // rldPrintSym: rldToPrintSymbols(rld.split("")),
        month: m,
        year: y,
        poste: ag.poste,
        id: index + 1,
        contrat: ag.contrat,
        matricule: ag.matricule, //matricule: "L0501",
      };

      return ad;
    });

    let ag_zero = { ...res[0] };

    ag_zero = {
      ...ag_zero,
      id: "",
      nom: { fr: list_title || "", zh: "" },
      contrat: "",
      rld: daysLetters.join(""),
      matricule: "",
    };

    const final_data = [...res, ag_zero];

    return final_data;
  }

  let dates = daysLetters.map((d, i) => i + 1);

  dates = [...dates.splice(20, dates.length), ...dates.splice(0, 20)];

  const first_agent = agentsf[0];

  let cal;

  let todayIndex = -1;
  let isCurrentMonth = false;
  if (first_agent) {
    const mc = first_agent.rld.month_code;

    if (mc) {
      const d = 21;
      const [c, id, y, m] = mc.split("_");
      const dobj = GetRoulemenDaysData(
        parseInt(y),
        parseInt(m) + 1,
        parseInt(d)
      );

      console.log(dobj);
      cal = dobj;
      todayIndex = cal.dates.indexOf(new Date().getDate());
      isCurrentMonth =
        new Date().getFullYear() == y &&
        ((new Date().getMonth() == m && new Date().getDate() > 20) ||
          (new Date().getMonth() == parseInt(m) + 1 &&
            new Date().getDate() < 20));

      console.log(
        `todayIndex : ${todayIndex}, isCurrentMonth : ${isCurrentMonth}`
      );
      //alert(m)
    }
  }

  //this is cool

  return (
    <>
      <div className={` ${agentsf.length > 0 ? "block" : "hidden"} `}>
        <tr>
          <td className={COL_SPAN}>
            {agentsf.length !== 0 && (
              <div className="flex justify-center items-center p-4 divide-x-2 gap-4 ">
                <div className=" ">
                  <ActionButton
                    icon={pdf}
                    title={GetTransForTokensArray(
                      LANG_TOKENS.PRINT_TABLE,
                      user.lang
                    )}
                    onClick={(e) =>
                      printAgentsRoulementPDF(
                        isCustomList ? customAgentsList : agentsf,
                        ref_adjust_m4.current.checked
                      )
                    }
                  />

                  <div>
                    <input type="checkbox" ref={ref_adjust_m4} />
                    {"DECALAGE MAI"}
                  </div>

                  <div>
                    <input type="checkbox" ref={ref_print_empty} />
                    {GetTransForTokensArray(
                      LANG_TOKENS.PRINT_EMPTY_TABLE,
                      user.lang
                    )}
                  </div>
                </div>

                <div className=" pl-4 ">
                  <ActionButton
                    icon={pdf}
                    title={GetTransForTokensArray(
                      LANG_TOKENS.PRINT_LIST,
                      user.lang
                    )}
                    onClick={(e) =>
                      printNameListPDF(
                        isCustomList ? customAgentsList : agentsf,
                        !!_(ref_custom_title) ? _(ref_custom_title) : ""
                      )
                    }
                  />

                  <div>
                    <input
                      type="text"
                      ref={ref_custom_title}
                      className={CLASS_INPUT_TEXT}
                      placeholder={GetTransForTokensArray(
                        LANG_TOKENS.CUSTOM_TITLE,
                        user.lang
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
          </td>
        </tr>

        {isCustomList && (
          <div className=" m-2 rounded-md bg-green-900 text-green-400 border border-green-600 p-2 text-center  ">
            {GetTransForTokensArray(LANG_TOKENS.CUSTOM_LIST, user.lang)}
          </div>
        )}
        <table>
          <thead>
            <tr>
              <td
                className={CLASS_TD}
                colSpan={agentsf[0] && cal && cal.dates.length + COL_SPAN}
              >
                <div className="text-2xl text-center">
                  {GetTransForTokensArray(LANG_TOKENS.TEAM, userEvent.lang)}{" "}
                  <span ref={ref_sp_equipe}></span> -{" "}
                  <span ref={ref_sp_section}></span> /{" "}
                  <span ref={ref_sp_m}></span> - <span ref={ref_sp_y}></span>
                </div>
              </td>
            </tr>
          </thead>

          <tbody className="">
            <tr>
              <td className={CLASS_TD} colSpan={COL_SPAN}></td>
              {cal &&
                cal.daysNames.map((d, i) => (
                  <td
                    key={i}
                    className={`${CLASS_TD} ${
                      isCurrentMonth && cal.dates[i] === new Date().getDate()
                        ? CLASS_TODAY
                        : ""
                    } `}
                  >
                    {d}
                  </td>
                ))}
            </tr>
            <tr>
              <td className={` ${CLASS_TD} w-min `}>
                <b>No</b>
              </td>
              <td className={CLASS_TD}>
                <b>Nom et Postnom</b>
              </td>
              <td className={CLASS_TD}>
                <b>{GetTransForTokenName(LANG_TOKENS.AGENTS, user.lang)}</b>
              </td>
              <td className={CLASS_TD}>
                <b>{GetTransForTokenName("Poste", user.lang)}</b>
              </td>

              {cal &&
                cal.dates.map((d, i) => (
                  <td
                    key={i}
                    className={`${CLASS_TD} ${
                      isCurrentMonth && cal.dates[i] === new Date().getDate()
                        ? CLASS_TODAY
                        : ""
                    }  `}
                  >
                    {d}
                  </td>
                ))}
            </tr>
            {(isCustomList ? customAgentsList : agentsf).map((ag, i) => (
              <tr
                onClick={(e) => isCustomList && onCustomAgentClick(ag)}
                key={i}
                className={` ${
                  isCustomList
                    ? "hover:bg-red-700 hover:cursor-pointer hover:text-black hover:font-bold"
                    : " "
                } ${
                  ag.chef_deq === "OUI" &&
                  "  font-bold dark:bg-black bg-slate-300"
                }   ${
                  ag.poste === "SUP" && " dark:bg-black bg-slate-300 font-bold"
                }  `}
              >
                <td className={` ${CLASS_TD} w-min `}>{i + 1}</td>
                <td className={CLASS_TD}>
                  <div className="flex">
                    {ag.nom} {ag.postnom}
                    <b>{ag.mingzi}</b>
                    {ag.chef_deq === "OUI" && (
                      <span className="mx-2">
                        <img alt="shield" src={shield} width={20} height={20} />
                      </span>
                    )}
                    {ag.poste === "SUP" && (
                      <span className="mx-2">
                        <img alt="sup" src={sup} width={20} height={20} />
                      </span>
                    )}
                  </div>
                </td>
                <td className={CLASS_TD}>
                  {ag.contrat}
                  {ag.matricule && `- ${ag.matricule}`}
                </td>
                <td className={CLASS_TD}>{ag.poste}</td>
                {cal &&
                  ag.rld.rl
                    .slice(0, daysCount + 1)
                    .split("")
                    .map((r, i) =>
                      i < cal.dates.length ? (
                        <td
                          className={`${CLASS_TD}   ${
                            isCurrentMonth && i === todayIndex
                              ? CLASS_TODAY
                              : ""
                          } `}
                        >
                          {KAOQIN[r] && KAOQIN[r].printSym}
                        </td>
                      ) : null
                    )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(!agentsf || agentsf.length == 0) && (
        <ItemNotSelected
          show={agentsf.length > 0}
          message={"Please select a team!"}
        />
      )}
    </>
  );
}
