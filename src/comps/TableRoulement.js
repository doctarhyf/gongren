import React, { useEffect, useRef, useState } from "react";
import * as SB from "../helpers/sb";
import GetRoulemenDaysData from "../helpers/GetRoulemenDaysData.mjs";
import { TABLES_NAMES } from "../helpers/sb.config";
import DateSelector from "./DateSelector";
import Loading from "./Loading";
import { CLASS_TD } from "../helpers/flow";
import AgentRoulementTable from "./AgentRoulementTable";
import ButtonPrint from "./ButtonPrint";
import { doc, print_agent_roulement } from "../helpers/funcs_print";

export default function TableRoulement({ agentData }) {
  const [loading, setloading] = useState(false);
  const [daysData, setDaysData] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [selectedMonthCode, setSelectedMonthCode] = useState();
  const [agentRoulementData, setAgentRoulementData] = useState([]);

  useEffect(() => {
    if (agentData && selectedDate) {
      const monthCode = `mc_${agentData.id}_${selectedDate.y}_${
        selectedDate.m - 1
      }`;
      setSelectedMonthCode(monthCode);

      loadRoulement(monthCode);
    } else {
      console.log("AgentData not provided, cant load rld");
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

    let msg = `Creating new roulement date : ${monthCode}`;

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
    console.log(agentRoulementData);
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
      month: Number(month),
      year: Number(year),
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
        <div>
          <ButtonPrint
            onClick={(e) =>
              printPDF(
                selectedMonthCode,
                agentData,
                agentRoulementData.rl.split("")
              )
            }
          />
          <input ref={ref_print_empty} type="checkbox" /> PRINT EMPTY?
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
      />
    </div>
  );
}
