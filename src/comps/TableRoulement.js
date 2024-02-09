import React, { useEffect, useRef, useState } from "react";
import * as SB from "../helpers/sb";
import GetRoulemenDaysData from "../helpers/GetRoulemenDaysData.mjs";
import { TABLES_NAMES } from "../helpers/sb.config";
import DateSelector from "./DateSelector";
import Loading from "./Loading";
import { CLASS_TD } from "../helpers/flow";
import AgentRoulementTable from "./AgentRoulementTable";

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

  if (agentData === undefined) {
    return <div></div>;
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

  return (
    <div>
      <Loading isLoading={loading} />
      <DateSelector
        defaultDateType={"m"}
        hideSelectDateType={true}
        onDateSelected={onDateSelected}
      />

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