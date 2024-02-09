import React, { useEffect, useRef, useState } from "react";
import * as SB from "../helpers/sb";
import GetRoulemenDaysData from "../helpers/GetRoulemenDaysData.mjs";
import { TABLES_NAMES } from "../helpers/sb.config";
import DateSelector from "./DateSelector";
import Loading from "./Loading";
import { CLASS_TD } from "../helpers/flow";

function Table({ agentData, daysData, agentRoulementData, loading }) {
  return (
    <table>
      <tr>
        <td className={CLASS_TD}></td>
        <td className={CLASS_TD}></td>
        <td className={CLASS_TD}></td>
        {daysData &&
          daysData.daysNames.map((d, i) => <td className={CLASS_TD}>{d}</td>)}
      </tr>
      <tr>
        <td className={CLASS_TD}>No</td>
        <td className={CLASS_TD}>Agent/员工</td>
        <td className={CLASS_TD}>Mat./工号</td>
        {daysData &&
          daysData.dates.map((d, i) => <td className={CLASS_TD}>{d}</td>)}
      </tr>
      <tr>
        <td className={CLASS_TD}>1</td>
        <td className={`${CLASS_TD}   `}>
          {agentData.nom} {agentData.postnom} {agentData.prenom}
        </td>
        <td className={CLASS_TD}>{agentData.matricule}</td>

        {!loading &&
          agentRoulementData.rl &&
          agentRoulementData.rl
            .split("")
            .map((r, i) => <td className={CLASS_TD}>{r}</td>)}

        {loading && agentRoulementData.rl && (
          <td
            className={CLASS_TD}
            colSpan={agentRoulementData.rl.length}
            align="center"
          >
            <Loading isLoading={loading} />
          </td>
        )}
      </tr>
    </table>
  );
}

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

  if (agentData === undefined) {
    return <div></div>;
  }

  return (
    <div>
      <Loading isLoading={loading} />
      <DateSelector
        defaultDateType={"m"}
        hideSelectDateType={true}
        onDateSelected={onDateSelected}
      />
      {/*  <div>大ag:{JSON.stringify(agentData)}</div>
      <div>days data: {JSON.stringify(daysData)}</div>
      <div>Month code:{selectedMonthCode}</div> */}

      <Table
        loading={loading}
        agentData={agentData}
        daysData={daysData}
        agentRoulementData={agentRoulementData}
      />
    </div>
  );
}
