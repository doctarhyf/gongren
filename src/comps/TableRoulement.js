import React, { useContext, useEffect, useRef, useState } from "react";
import { doc, print_agent_roulement } from "../helpers/funcs_print";
import GetRoulemenDaysData from "../helpers/GetRoulemenDaysData.mjs";
import * as SB from "../helpers/sb";
import { TABLES_NAMES, supabase } from "../helpers/sb.config";
import ActionButton from "./ActionButton";
import AgentRoulementTable from "./AgentRoulementTable";
import DateSelector from "./DateSelector";
import Loading from "./Loading";
import printer from "../img/printer.png";
import { UserContext } from "../App";
import { GetTransForToken, LANG_TOKENS } from "../helpers/lang_strings";

const ERRORS = {
  AGENT_DATA_UNDEFINED: { code: "no_ag_data", msg: "agentData is undefined!" },
  SELECTED_DATE_UNDEFINED: {
    code: "no_date_selected",
    msg: "selectedDate is undefined!",
  },
};

export default function TableRoulement({ agentData }) {
  const [loading, setloading] = useState(false);
  const [daysData, setDaysData] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [selectedMonthCode, setSelectedMonthCode] = useState();
  const [agentRoulementData, setAgentRoulementData] = useState([]);
  const [errors, seterror] = useState([]);
  const [, , user] = useContext(UserContext);

  useEffect(() => {
    let errors = [];
    if (agentData === undefined) errors.push(ERRORS.AGENT_DATA_UNDEFINED);
    if (selectedDate === undefined) errors.push(ERRORS.SELECTED_DATE_UNDEFINED);

    seterror(errors);

    const no_errors = errors.length === 0;

    if (no_errors) {
      const monthCode = `mc_${agentData.id}_${selectedDate.y}_${
        selectedDate.m - 1
      }`;
      setSelectedMonthCode(monthCode);

      loadRoulement(monthCode);
    } else {
      console.log(errors);
    }
  }, [agentData, selectedDate]);

  async function loadRoulement(monthCode) {
    setloading(true);
    const d = await SB.LoadItemWithColNameEqColVal(
      TABLES_NAMES.AGENTS_RLD,
      "month_code",
      monthCode
    );

    setAgentRoulementData(d);
    if (d === undefined) {
      setAgentRoulementData(createNewRLData(monthCode));
    }
    setloading(false);
  }

  async function createNewRLData(monthCode) {
    setloading(true);

    let msg = `Creating new roulement data : ${monthCode}`;

    console.log(msg);
    alert(msg);

    const newData = {
      rl: daysData.defaultRoulementData,
      month_code: monthCode,
      agent_id: agentData.id,
    };
    const res = await SB.InsertItem(TABLES_NAMES.AGENTS_RLD, newData);
    console.log(newData, res);

    msg = `New roulement data created : ${monthCode}`;
    console.log(msg);
    alert(msg);
    loadRoulement(monthCode);
    setSelectedMonthCode(monthCode);
    setloading(false);

    return newData;
  }

  function onDateSelected(dateObj) {
    setSelectedDate(dateObj);
    dateObj.d = 21;
    dateObj.m += 1;
    const { y, m, d } = dateObj;
    setDaysData(GetRoulemenDaysData(y, m, d));
  }

  function onChangeRoulement(idx, newVal) {
    console.log(`IDX: ${idx}, newVal: ${newVal}`);
    console.log(agentRoulementData);
    let { id, created_at, rl, month_code, agent_id } = agentRoulementData;

    let old_rl_array = rl.split("");
    old_rl_array[idx] = newVal;

    setAgentRoulementData((old) => ({ ...old, rl: old_rl_array.join("") }));
  }

  function onSaveRoulement() {
    setloading(true);
    //console.log(agentRoulementData);
    SB.UpdateRoulement2(
      selectedMonthCode,
      agentRoulementData.rl,
      (s) => {
        console.log("Roulement saved", s);
        alert("Roulement saved!");
        setloading(false);
      },
      (e) => {
        console.log(e);
        alert("Error saving!", JSON.stringify(e));
        setloading(false);
      }
    );
  }

  async function onSaveRoulementAndApplyToWholeTeam() {
    if (
      window.confirm("Are you sure you wanna save and apply to whole team?\n")
    ) {
      setloading(true);
      const { section, equipe } = agentData;

      try {
        let res = await supabase
          .from(TABLES_NAMES.AGENTS)
          .select("id")
          .eq("section", section)
          .eq("equipe", equipe);

        if (res.error) {
          alert("Error\n" + JSON.stringify(res.error));
        } else {
          //console.log(res.data);
          const idz = res.data.map((it, i) => it.id);
          const [mc, aid, y, m] = selectedMonthCode.split("_");
          const id_mc = idz.map((id, i) => ({
            mc: `mc_${id}_${y}_${m}`,
            id: id,
          }));
          const { rl } = agentRoulementData;

          id_mc.forEach((it, i) => {
            // console.log(it, rl);

            SB.UpdateRoulement2(
              it.mc,
              rl,
              (s) => {
                const p = (i + 1) / id_mc.length;
                console.log(s, p);

                if (p === 1) {
                  const m = `Data updated for all team\nSection: ${section}\nEquipe: ${equipe}`;
                  console.log(m);
                  alert(m);
                  setloading(false);
                }
              },
              (e) => {
                const p = (i + 1) / id_mc.length;
                console.log(e, p);
                if (p === 1) {
                  setloading(false);
                }
              }
            );
          });
        }
      } catch (e) {
        console.log(e);
        alert("Error loading data\n" + JSON.stringify(e));
        setloading(false);
      }
    }
  }

  const ref_print_empty = useRef();

  function printPDF(monthCode, curAgent, curAgentRld) {
    const print_empty = ref_print_empty.current.checked;

    console.log("print_empty", print_empty);

    if (monthCode === undefined) {
      alert("monthCode is undefined!");
      return;
    }

    const { nom, postnom, prenom, mingzi, poste, matricule } = curAgent;

    const [mc, id, year, month] = monthCode.split("_");

    const print_data = {
      nom: { fr: `${nom} ${postnom} ${prenom}`, zh: `${mingzi}` },
      rld: curAgentRld.join(""),
      month: parseInt(month),
      year: parseInt(year),
      poste: poste,
      matricule,
    };

    print_agent_roulement(doc, print_data, print_empty);
  }

  if (agentData === undefined) {
    return <div></div>;
  }

  return (
    <div>
      <Loading isLoading={loading} />

      <div>
        <DateSelector
          defaultDateType={"m"}
          hideSelectDateType={true}
          onDateSelected={onDateSelected}
        />
        <div className="md:flex gap-2">
          <ActionButton
            icon={printer}
            title={GetTransForToken(LANG_TOKENS.PRINT, user.lang)}
            onClick={(e) =>
              printPDF(
                selectedMonthCode,
                agentData,
                agentRoulementData.rl.split("")
              )
            }
          />
          <div className="flex cursor-pointer justify-center items-center gap-1 text-xs">
            <input ref={ref_print_empty} type="checkbox" /> PRINT EMPTY TABLE
          </div>
        </div>
      </div>

      <AgentRoulementTable
        onChangeRoulement={onChangeRoulement}
        hideHeaders={false}
        loading={loading}
        agentData={agentData}
        daysData={daysData}
        agentRoulementData={agentRoulementData}
        onSaveRoulement={onSaveRoulement}
        onSaveRoulementAndApplyToWholeTeam={onSaveRoulementAndApplyToWholeTeam}
        errors={errors}
      />
    </div>
  );
}
