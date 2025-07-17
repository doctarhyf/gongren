import GetRoulemenDaysData from "./GetRoulemenDaysData.mjs";
import {
  ACCESS_CODES,
  MONTHS,
  POSTE,
  PRIME_MIN,
  SHIFT_HOURS_ZH,
  SUPERVISORS,
} from "./flow";
import { jsPDF } from "jspdf";
import { TABLES_NAMES } from "./sb.config";
import { draw_date } from "./print_utils";
import { drawChineseEnglishTextLine, drawLogo } from "./funcs_print";
import autoTable from "jspdf-autotable";

const LOGO_GCK_BASE_64 =
  "data:image/png;base64,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";

const LOGO_RATIO = 4;
const LOGOW = 286;
const LOGOH = 66;
// Default export is a4 paper, portrait, using millimeters for units
const orientation = "landscape";

export function AddOneToRoulementCurMonth() {
  const date = new Date();
  const d = date.getDate();
  const add = d < 21 ? 0 : 1;
  ////console.log("addOne", add, d);
  return add;
}

export function ParseBaozhuang(nd) {
  const [team, shift, y, m, d] = nd.code.split("_");
  const sup = SUPERVISORS[team];

  const { camions, sacs, dechires } = nd;
  const t = parseFloat(sacs) / 20;
  const rep = {
    team: team,
    y: parseInt(y),
    m: parseInt(m) + 1,
    d: parseInt(d),
    sup: `${sup.nom} - ${sup.zh}`,
    shift: `${SHIFT_HOURS_ZH[shift][0]} - ${SHIFT_HOURS_ZH[shift][1]} - ${SHIFT_HOURS_ZH[shift][2]}`,
    s: shift,
    camions: camions,
    sacs: sacs,
    t: t,
    dechires: dechires,
  };

  return rep;
}

export function GetDateParts(part = "all", date = new Date()) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();

  const h = date.getHours();
  const i = date.getMinutes();
  const s = date.getSeconds();

  const parts = {
    year: y,
    month: m,
    day: d,
    hours: h,
    minutes: i,
    seconds: s,
  };

  return part === "all"
    ? parts
    : part === "input"
    ? `${y}-${AddLeadingZero(m + 1)}-${AddLeadingZero(d)}`
    : parts[part];
}

// Utility function to write data to localStorage
export const saveToLocalStorage = (key, data) => {
  try {
    const jsonData = JSON.stringify(data); // Convert the array of objects to a JSON string
    localStorage.setItem(key, jsonData); // Save it under the provided key
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

// Utility function to read data from localStorage
export const readFromLocalStorage = (key) => {
  try {
    const jsonData = localStorage.getItem(key); // Retrieve the JSON string by key
    return jsonData ? JSON.parse(jsonData) : null; // Parse it back to an object if exists, otherwise return null
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return null; // In case of error, return null
  }
};

export function FrenchDate(date) {
  // Format date and time in French
  let formattedDateTime = date.toLocaleString("fr-FR", {
    weekday: "long", // "dimanche"
    year: "numeric", // "2024"
    month: "long", // "août"
    day: "numeric", // "4"
    hour: "2-digit", // "14"
    minute: "2-digit", // "34"
    second: "2-digit", // "56"
    hour12: false, // 24-hour clock
  });

  return formattedDateTime;
}

export function GetCurrentMonthTrans(trans) {
  const y = new Date().getFullYear();
  const m = (new Date().getMonth() + 1).toString().padStart(2, "0");
  //console.log("month ==> ", m);
  const filter = `${y}-${m}`;
  ////console.log("ft ==>", filter);
  const filtereds = trans.filter((it) => it.date_time.startsWith(filter));

  ////console.log("fz ==> ", filtereds);

  return filtereds;
}

export function objectToArray(obj, omitKeys = []) {
  return Object.entries(obj)
    .filter(([key]) => !omitKeys.includes(key))
    .map(([, value]) => value);
}

export function toCSV(data, omitKeys = []) {
  if (!data || !data.length) return "";

  const keys = Object.keys(data[0]).filter((k) => !omitKeys.includes(k));
  const header = keys.join(",");
  const rows = data.map((row) =>
    keys.map((k) => JSON.stringify(row[k] ?? "")).join(",")
  );
  return [header, ...rows].join("\n");
}

export function GenerateExcelData(data, keysToOmit = [], keepHeaders = true) {
  const d = objectsToArrays(data, keysToOmit, keepHeaders);

  return JSON.parse(JSON.stringify(d));
}

export function objectsToArrays(
  objArray,
  omitKeys = [],
  includeHeader = false
) {
  if (!Array.isArray(objArray) || objArray.length === 0) return [];

  const keys = Object.keys(objArray[0]).filter((k) => !omitKeys.includes(k));

  const data = objArray.map((obj) => keys.map((key) => obj[key]));

  return includeHeader ? [keys, ...data] : data;
}

export function GetMonthNumDays(year, month) {
  const date = new Date();
  const today = date.getDate();
  year = year === undefined ? date.getFullYear() : year;
  month = month === undefined ? date.getMonth() : month;

  const count = new Date(year, month + 1, 0).getDate();
  const ext = count === 31 ? "st" : "th";
  const remaining = count - today;

  const res = {
    count: count,
    ext: ext,
    remaining: remaining,
    current: count - remaining,
  };

  //console.log(res);

  return res;
}

export function formatDateTime(dt) {
  // if (!!dt) return dt;

  return dt.replaceAll("-", ".").replaceAll("T", " ");
}

export function sumAllPropsFromObjectArray(array, prop) {
  return array.reduce((total, obj) => total + (Number(obj[prop]) || 0), 0);
}

export function formatCreatedAt(input) {
  const date = new Date(input);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const dd = String(date.getDate()).padStart(2, "0");

  const hh = String(date.getHours()).padStart(2, "0");
  const ii = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${ii}:${ss}`;
}

export const CustomSortByListPriority = (a, b) => {
  const ata = a.list_priority;
  const atb = b.list_priority;

  return ata - atb;
};

export const AddLeadingZero = (v) => {
  const vi = parseInt(v);
  return vi < 10 ? "0" + vi : vi;
};

export function formatFrenchDate(inputDate) {
  // Assuming inputDate is either a JavaScript Date object or a date string
  const date = new Date(inputDate);

  // Format the date using the French locale
  const formattedDate = date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return capitalizeDayAndMonth(formattedDate);
}

function capitalizeDayAndMonth(inputDateString) {
  const dateArray = inputDateString.split(" ");

  if (dateArray.length === 4) {
    const day = capitalizeFirstCharacter(dateArray[0]);
    const date = dateArray[1];
    const month = capitalizeFirstCharacter(dateArray[2]);
    const year = dateArray[3];

    return `${day} ${date} ${month} ${year}`;
  } else {
    // Handle invalid date format
    return inputDateString;
  }
}

function capitalizeFirstCharacter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const FFD = formatFrenchDate;

export function getDaysInMonth(y, m, doNotAddOne) {
  if (doNotAddOne) m -= 1;
  const lastDayOfMonth = new Date(y, m + 1, 0).getDate();
  //////console.log(new Date(y, m + 1, 0).toLocaleDateString());
  return lastDayOfMonth;
}

export function CountAgentsByPostType(agentsList, k_poste, excludeDeq = true) {
  const propName = "poste";
  const propVal = POSTE[k_poste];

  let count = agentsList.filter((it, i) => it[propName] === propVal).length;
  if (excludeDeq)
    count = agentsList.filter(
      (it, i) => it[propName] === propVal && it.chef_deq === "NON"
    ).length;

  return count;
}

export function CountAgentsByPropEqVal(agentsList, propName, propVal) {
  return agentsList.filter((it, i) => it[propName] === propVal).length;
}

export function GeneratePDF(agents_names, list_title) {
  const doc = new jsPDF({ orientation: orientation });
  const PG_W = orientation === "landscape" ? 297 : 210;
  const PG_H = orientation === "landscape" ? 210 : 297;

  const logo =
    "data:image/png;base64,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";
  const MARG = 15;
  const LOGO_X = MARG;
  const LOGO_Y = 10;
  const LOGO_W = (293 / 10) * 2;
  const LOGO_H = (66 / 10) * 2;

  doc.setFontSize(12);
  const date = formatFrenchDate(new Date());
  let { w, h } = doc.getTextDimensions(date);
  doc.text(date, PG_W - w - MARG, MARG);

  doc.setFontSize(16);

  doc.addImage(logo, "PNG", LOGO_X, LOGO_Y, LOGO_W, LOGO_H);
  doc.line(MARG, LOGO_H + MARG, PG_W - MARG, LOGO_H + MARG);

  let title = `NOM DES AGENTS DE L'ATELIER CIMENT`;
  doc.text(title, LOGO_W + MARG * 2, LOGO_H + MARG / 1.5);
  doc.setFontSize(12);

  let dims = doc.getTextDimensions(agents_names);

  const PG_CONT_Y = MARG * 2.5;
  agents_names.map((it, i) => {
    let x = MARG;
    let y = PG_CONT_Y + i * 10;

    if (i > 15) {
      x = dims.w + 30;
      y = PG_CONT_Y + (i - 16) * 10;
    }

    if (i > 31) {
      x = dims.w * 2 + 35;
      y = PG_CONT_Y + (i - 32) * 10;
    }

    const txt = `${i + 1}. ${it}`;
    const d = doc.getTextDimensions(txt);
    doc.text(txt, x, y);
  });

  const equipe =
    list_title && list_title !== ""
      ? "Equipe   :" + list_title
      : "Equipe   : _______________";

  const sig_block = [
    "Signature: _______________",
    "",
    equipe,
    "",
    "Heure    : _______________",
    "",
    `Total    : ${agents_names.length} Agent(s)`,
  ];

  dims = doc.getTextDimensions(sig_block);
  const sig_x = dims.w * 3 + 30 * 2;
  const sig_y = PG_CONT_Y + MARG / 4;
  doc.text(sig_block, sig_x, sig_y);
  const sp = MARG / 4;
  doc.rect(sig_x - sp, sig_y - sp * 2, dims.w + sp * 2, dims.h + sp * 2);
  doc.save("agents.pdf");
}

function addLogo(doc) {
  doc.addImage(
    LOGO_GCK_BASE_64,
    "PNG",
    10,
    10,
    LOGOW / LOGO_RATIO,
    LOGOH / LOGO_RATIO
  );
}

function addTitle(doc, agents, customTitle) {
  if (agents.length === 0) {
    throw new Error("Agents length must not be zero!");
    return;
  }
  let { equipe, section } = agents[0];
  let date = new Date().toLocaleDateString();

  let title = !!customTitle
    ? `${customTitle}`
    : `NOM DES AGENTS DE L'ATELIER CIMENT, ${section} EQUIPE ${equipe}`; //, le ${date}`;
  doc.setFontSize(12);
  const x = 10;
  const y = LOGOH / LOGO_RATIO + 20;
  doc.text(title, x, y);
  doc.line(x, y + 2.5, 180, y + 2.5);
}

function fcap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function addAgentsNames(doc, agents) {
  if (agents.length === 0) {
    throw new Error("Agents length must not be zero!");
    return;
  }

  doc.setFontSize(10);
  const x = 10;
  let y;
  let idx = 0;
  const original_limit = 29;
  let page_limit = original_limit;
  agents.forEach((agent, i) => {
    let nom = `${i + 1}. ${agent.nom} ${agent.postnom} ${fcap(
      agent.prenom
    )} - ${agent.matricule}`;

    const start = i > page_limit ? 0 : LOGOH / 2 + 10;
    y = start + (idx + 1) * 8;

    doc.text(nom, x, y);
    if (i === agents.length - 1) doc.line(x, y + 2.5, 180, y + 2.5);

    if (idx === page_limit) {
      doc.addPage();

      idx = 0;
    }
    idx++;
  });

  doc.setFontSize(12);
  doc.text(`TOTAL :  ${agents.length} Agent(s)`, x, y + 10);
}

export function printPDF1(agents, customTitle) {
  if (agents.length === 0) {
    const msg = `Agents list is empty!`;

    alert(msg);
    throw new Error(msg);
    return;
  }

  const { equipe, section } = agents[0];

  const doc = new jsPDF();
  draw_date(doc, 210, 10, 10, null, false);
  addLogo(doc);
  addTitle(doc, agents, customTitle);
  addAgentsNames(doc, agents);
  doc.save(`${section}_${equipe}.pdf`);
}

export async function updateLoggedOut(supabase, sessionId) {
  const { data, error } = await supabase
    .from("logs")
    .update({ logged_out: new Date().toISOString() }) // or use null/true/false depending on your schema
    .eq("session", sessionId);

  if (error) {
    console.error("Error updating logged_out:", error);
    return error;
  }

  console.log("Update successful:", data);
  return data;
}

export async function UpdateOperationsLogs(SB, user, LOG_OPERATION, desc) {
  console.warn("UpdateOperationsLogs", arguments);
  // return;
  const userAgent = navigator.userAgent;
  const browser = navigator.appName;
  const browserVersion = navigator.appVersion;

  const data = {
    mat: `${user.prenom} ${user.nom} [${user.matricule}]`,
    device: `${userAgent}, ${browser} ${browserVersion}`,
    desc: desc,
    op: LOG_OPERATION,
  };

  ////console.log("log data => ", data);
  const r = await SB.InsertItem(TABLES_NAMES.OPERATIONS_LOGS, data);

  //////console.log("ops logs res => ", r);
  return r;
}

export function UserHasAccessCode(user, ACCESS_CODE) {
  if (!user) return false;

  return (
    (user.access_codes && user.access_codes.includes(ACCESS_CODE)) ||
    user.matricule === "L0501" ||
    user.access_codes.includes(ACCESS_CODES.ROOT)
  );
}

export function UserHasAnyOfAccessCodes(user, ACCESS_CODE_ARRAY) {
  const access = ACCESS_CODE_ARRAY.map((it, i) => UserHasAccessCode(it));

  ////console.log(access);
}

export function GroupBySectionAndEquipe(data) {
  return data.reduce((result, item) => {
    const sectionKey = item.section;
    const equipeKey = item.equipe;

    // Check if the section exists in the result object
    if (!result[sectionKey]) {
      result[sectionKey] = {};
    }

    // Check if the equipe exists in the section
    if (!result[sectionKey][equipeKey]) {
      result[sectionKey][equipeKey] = [];
    }

    // Push the current item to the appropriate equipe in the section
    result[sectionKey][equipeKey].push(item);

    return result;
  }, {});
}

export function _(ref) {
  if (ref === undefined) return;
  return ref.current.value;
}

export function ParseYearRepport(year_data) {
  let repport = { type: "Annuel" };
  let sacs = 0;
  let t = 0;
  let ret = 0;
  let ajt = 0;
  let camions = 0;
  repport.date = year_data[0];
  Object.values(year_data[1]).map((m, i) => {
    Object.values(m).map((d, i) => {
      Object.values(d).map((shift, i) => {
        sacs += Number(shift.sacs);

        ret += Number(shift.retours);
        ajt += Number(shift.ajouts);
        t = sacs / 20;
        camions += Number(shift.camions);
      });
    });
  });
  repport.sacs = sacs + " Sacs";
  repport.tonnage = t + " T";
  repport.camions = camions;
  repport.retours = ret;
  repport.ajouts = ajt;

  return repport;
}

export function ParseMonthRepport(month_data) {
  const [y, m] = month_data[0].split("-");

  let repport = {
    type: "Mensuel",
    date: `Mois ${MONTHS[m]} ${y}`,
  };
  let sacs = 0;
  let t = 0;
  let ret = 0;
  let ajt = 0;
  let camions = 0;

  Object.values(month_data[1]).map((d, i) => {
    Object.values(d).map((shift, i) => {
      sacs += Number(shift.sacs);
      ret += Number(shift.retours);
      ajt += Number(shift.ajouts);
      t = sacs / 20;
      camions += Number(shift.camions);
    });
  });

  repport.sacs = sacs + " Sacs";
  repport.tonnage = t + " T";
  repport.camions = camions;
  repport.retours = ret;
  repport.ajouts = ajt;

  return repport;
}

export function ParseDayRepport(day_data) {
  const date_str = day_data[0];
  let [y, m, d] = date_str.split("-");

  if (m === undefined && d === undefined && date_str.indexOf("_") !== -1) {
    [y, m, d] = date_str.split("_");
  }

  ////console.log("ParseDayRepport", day_data);

  let repport = {
    type: "Journalier",

    date: `Du ${d} ${MONTHS[m]} ${y}`,
  };
  let sacs = 0;
  let t = 0;
  let ret = 0;
  let ajt = 0;
  let camions = 0;
  let bonus = 0;

  Object.values(day_data[1]).map((shift, i) => {
    sacs += Number(shift.sacs);
    ret += Number(shift.retours);
    ajt += Number(shift.ajouts);
    t = sacs / 20;
    camions += Number(shift.camions);
  });

  repport.sacs = sacs;
  repport.tonnage = t;
  repport.camions = camions;
  repport.retours = ret;
  repport.ajouts = ajt;
  repport.data = day_data[1];
  return repport;
}

export const customSortByDate = (a, b) => {
  const lastTwoCharsA = a.code.slice(-2);
  const lastTwoCharsB = b.code.slice(-2);

  return lastTwoCharsA.localeCompare(lastTwoCharsB);
};

export function CorrectZeroMonthIndexDisplay(dateStr, splitter = "-") {
  let [y, m, d] = dateStr.split(splitter);
  m = Number(m) + 1;
  if (d === undefined) return `${y}/${m}`;
  return `${y}/${m}/${d}`;
}

export const customSortDaysArray = (a, b) => {
  const dateA = Number(a[0].split("-")[2]); //.code.slice(-2);
  const dateB = Number(b[0].split("-")[2]); //.code.slice(-2);

  return dateA - dateB; //lastTwoCharsA.localeCompare(lastTwoCharsB);
};

export function getRouelemtDaysLetters2(year, month) {
  // Calculate the 21st of the current month
  let monthIndex = Number(month);
  const startDate = new Date(year, monthIndex, 21);

  //////console.log("getRouelemtDaysLetters2", startDate.toISOString());

  const endDate = new Date(year, monthIndex + 1, monthIndex === 3 ? 21 : 20);

  const dayNames = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayName = currentDate
      .toLocaleDateString("fr-FR", { weekday: "long" })
      .charAt(0)
      .toUpperCase();
    dayNames.push(dayName);
    // ////console.log(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dayNames;
}

export function getRouelemtDaysLetters(year, monthIndex) {
  // Ensure the monthIndex is between 0 (January) and 11 (December)
  monthIndex = monthIndex - 1;
  monthIndex = (monthIndex + 12) % 12;

  // Calculate the 21st of the current month
  const startDate = new Date(year, monthIndex, 21);

  // Calculate the 20th of the next month
  const endDate = new Date(year, monthIndex + 1, 20);

  const dayNames = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayName = currentDate
      .toLocaleDateString("fr-FR", { weekday: "long" })
      .charAt(0)
      .toUpperCase();
    dayNames.push(dayName);
    // ////console.log(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  //////console.log(startDate, endDate);

  return dayNames;
}

export function createHeaders(keys) {
  var result = [];
  for (var i = 0; i < keys.length; i += 1) {
    result.push({
      id: keys[i],
      name: keys[i],
      prompt: keys[i],
      width: 65,
      align: "center",
      padding: 0,
    });
  }
  return result;
}

export function ParseShiftRepport(shift_data) {
  //////console.log("ssddtt => ", shift_data);

  const shift = shift_data[1];
  const [t, s, y, m, d] = shift.code.split("_");

  let repport = {
    type: " de Chargement",
    date: `Equipe ${t}, de ${SHIFT_HOURS_ZH[s][2]}, ${SHIFT_HOURS_ZH[s][0]}, le ${d} ${MONTHS[m]} ${y}, `,
  };

  repport.id = shift.id;
  repport.equipe = t;
  repport.heure = `${SHIFT_HOURS_ZH[s][0]}, ${SHIFT_HOURS_ZH[s][2]}`;
  repport.sacs = shift.sacs;
  repport.sacs_adj = shift.sacs_adj;
  repport.camions = shift.camions;
  repport.tonnage = Number(shift.sacs / 20);
  repport.code = shift.code;
  repport.retours = shift.retours;
  repport.ajouts = shift.ajouts;
  repport.dechires = shift.dechires;
  const bonus_marg_t =
    repport.tonnage - PRIME_MIN < 0 ? 0 : repport.tonnage - PRIME_MIN;
  const bonus_marg_cdf = bonus_marg_t * 1000;
  repport.bonus = formatAsMoney(bonus_marg_cdf);

  const upd = {
    id: shift.id,
    shift: s,
    team: t, //SHIF_HOURS_ZH[shift.code[0]][1],
    date: `${d}/${m}/${y}`,
    sacs: shift.sacs,
    sacs_adj: shift.sacs_adj,
    camions: shift.camions,
    retours: shift.retours,
    ajouts: shift.ajouts,
    dechires: shift.dechires,
  };

  repport.upd = JSON.stringify(upd);
  return repport;
}

function isDateBetween20thAnd21st(year, month, day) {
  // Create a Date object for the input date
  const inputDate = new Date(year, month - 1, day); // Month is 0-based in JavaScript

  // Get the current date
  const currentDate = new Date();

  // Get the 20th of the current month
  const startRange = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    20
  );

  // Get the 21st of the next month
  let endRange = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    21
  );

  // Adjust the endRange if it goes to the next year
  if (endRange.getMonth() === 0) {
    endRange = new Date(currentDate.getFullYear() + 1, 0, 21);
  }

  // Check if the input date is between startRange and endRange
  return inputDate >= startRange && inputDate <= endRange;
}

export function GetDatesPartsFromShiftCode(shift_code) {
  if (shift_code === undefined) return;

  const [t, s, y, m, d] = shift_code.split("_");

  return { y: Number(y), m: Number(m), d: Number(d) };
}

export function isDate(obj) {
  const isdate = obj instanceof Date && !isNaN(obj.valueOf());
  return isdate ? obj : new Date(obj);
}

export function formatDateForDatetimeLocal(date = new Date()) {
  date = isDate(date);
  const pad = (num) => String(num).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
  //console.log("formatted : ", formatted);
  return formatted;
}

export function GetTodaysDateYMDObject() {
  const y = new Date().getFullYear();
  const m = new Date().getMonth();
  const d = new Date().getDate();

  return { y: y, m: m, d: d };
}

export function GetShiftProgress() {
  const d = new Date();
  const h = d.getHours();

  const isDayShift = h > 7 && h < 17;

  const progress = isDayShift ? dayShiftProgress() : nightShiftProgress();
  //console.log("Is Day Shift : ", isDayShift, " - Progress : ", progress);

  return progress;
}

function dayShiftProgress() {
  const start = new Date();
  start.setHours(7, 0, 0, 0); // 07:00

  const end = new Date();
  end.setHours(17, 0, 0, 0); // 17:00

  const now = new Date();

  const total = end - start;
  const elapsed = now - start;

  let pct = (elapsed / total) * 100;

  // Clamp the percentage between 0 and 100
  pct = Math.max(0, Math.min(100, pct));

  return pct.toFixed(2);
}

function nightShiftProgress() {
  const now = new Date();

  // Start: today at 17:00 (5:00 PM)
  const start = new Date(now);
  start.setHours(17, 0, 0, 0);

  // End: tomorrow at 07:00 (7:00 AM)
  const end = new Date(now);
  end.setDate(end.getDate() + 1); // move to tomorrow
  end.setHours(7, 0, 0, 0);

  // If current time is before 5 PM, shift start and end to yesterday/today
  if (now < start) {
    start.setDate(start.getDate() - 1); // yesterday at 17:00
    end.setDate(end.getDate() - 0); // today at 07:00
  }

  const total = end - start;
  const elapsed = now - start;

  let pct = (elapsed / total) * 100;

  // Clamp between 0 and 100
  pct = Math.max(0, Math.min(100, pct));

  return pct.toFixed(2);
}

export function GetShiftEndTime() {
  const d = new Date();
  const h = d.getHours();

  //console.log("getHours() => ", d.getHours());

  const dayEnd = { h: 17, str: "17:00" };
  const nightEnd = { h: 7, str: "07:00" };

  const isDayShift = h > 7 && h < 17;

  return isDayShift ? dayEnd : nightEnd;
}

export function formatAsMoney(value, currency) {
  // Convert the input to a number if it's a string
  const number = typeof value === "string" ? parseFloat(value) : value;

  // Check if the conversion was successful
  if (isNaN(number)) {
    return "Invalid input";
  }

  // Format the number as currency using toLocaleString
  return number.toLocaleString("en-US", {
    style: "currency",
    currency: currency || "CDF", // Change the currency code as needed
  });
}

function addUpShiftData(arr) {}

export function splitZhAndLat(input) {
  const result = [];
  let buffer = "";
  let currentType = null;

  // Helper to check if a character is Chinese
  function isChinese(char) {
    return /[\u4e00-\u9fff]/.test(char);
  }

  for (const char of input) {
    const type = isChinese(char) ? "zh" : "lat";

    if (type !== currentType) {
      if (buffer) {
        result.push({ [currentType]: buffer });
      }
      buffer = char;
      currentType = type;
    } else {
      buffer += char;
    }
  }

  // Push remaining buffer
  if (buffer) {
    result.push({ [currentType]: buffer });
  }

  return result;
}

export function printTotalsTable(totalData, y, m) {
  const doc = new jsPDF({ orientation: "portrait" });
  let r = doc.addFont(
    "fonts/DroidSansFallback.ttf",
    "DroidSansFallback",
    "normal"
  );

  let rect = drawLogo(doc);

  rect = drawChineseEnglishTextLine(doc, rect.x, rect.y + rect.h + 8, 12, [
    { zh: "水泥车间包装奖金" },
    { lat: " - " },
    { lat: "" + y },
    { zh: "年" },
    { lat: "" + m },
    { zh: "月" },
  ]);

  doc.setFontSize(10);
  doc.text(`TOTAL CHARGEMENTS ${MONTHS[m]} ${y}`, rect.x, rect.y + 8);

  let head = Object.keys(totalData.A);
  head = [["Equipe", ...head]];
  let body = Object.entries(totalData).map((dt, i) => [
    dt[0],
    ...Object.values(dt[1]).map((v, i) =>
      [3, 6].includes(i) ? (i === 6 ? (v * 1000).toFixed(2) : v.toFixed(2)) : v
    ),
  ]);

  autoTable(doc, {
    head: head,
    body: body,
    margin: { top: rect.y + rect.h + 8 },
  });

  doc.save("total.pdf");
}

export function calculateTotalsFromLoadsArray(loadsArray) {
  const model = {
    sacs: 0,
    retours: 0,
    ajouts: 0,
    tonnage: 0,
    camions: 26,
    dechires: 17,
    bonus: 0,
  };

  let totalsData = {
    A: { ...model },
    B: { ...model },
    C: { ...model },
    D: { ...model },
    TOTAL: { ...model },
  };

  loadsArray.forEach((s_data, si) => {
    let { sacs, sacs_adj, retours, ajouts, code, camions, dechires } = s_data;
    const [t, s, y, m, d] = code.split("_");

    let new_sacs_adj = Number(sacs_adj);
    //if (addSacsAdj) sacs += new_sacs_adj;
    let new_sacs = Number(sacs);
    let new_tonnage = Number(sacs) / 20;
    let new_retours = Number(retours);
    let new_ajouts = Number(ajouts);
    let new_camions = Number(camions);
    let new_dechires = Number(dechires);
    let new_bonus = new_tonnage < PRIME_MIN ? 0 : new_tonnage - PRIME_MIN;

    totalsData[t].sacs += new_sacs;
    totalsData[t].tonnage += new_tonnage;
    totalsData[t].retours += new_retours;
    totalsData[t].ajouts += new_ajouts;
    totalsData[t].camions += new_camions;
    totalsData[t].dechires += new_dechires;
    totalsData[t].bonus += new_bonus;

    totalsData.TOTAL.sacs += new_sacs;
    totalsData.TOTAL.tonnage += new_tonnage;
    totalsData.TOTAL.retours += new_retours;
    totalsData.TOTAL.ajouts += new_ajouts;
    totalsData.TOTAL.camions += new_camions;
    totalsData.TOTAL.dechires += new_dechires;
    totalsData.TOTAL.bonus += new_bonus;
  });

  ////console.log("ttzc => ", totalsData);
  return totalsData;
}

export function CaclculateAllTeamsTotals(data, addSacsAdj) {
  const model = {
    sacs: 0,
    retours: 0,
    ajouts: 0,
    tonnage: 0,
    camions: 26,
    dechires: 17,
    bonus: 0,
  };

  let totalsData = {
    A: { ...model },
    B: { ...model },
    C: { ...model },
    D: { ...model },
    TOTAL: { ...model },
  };

  const entries = Object.entries(data);
  ////console.log("entr", entries);
  const no_data = entries.length === 0;

  entries.forEach((d_entry, di) => {
    const d = d_entry[0];
    const d_data = d_entry[1];

    d_data.forEach((s_data, si) => {
      let { sacs, sacs_adj, retours, ajouts, code, camions, dechires } = s_data;
      const [t, s, y, m, d] = code.split("_");

      let new_sacs_adj = Number(sacs_adj);
      if (addSacsAdj) sacs += new_sacs_adj;
      let new_sacs = Number(sacs);
      let new_tonnage = Number(sacs) / 20;
      let new_retours = Number(retours);
      let new_ajouts = Number(ajouts);
      let new_camions = Number(camions);
      let new_dechires = Number(dechires);
      let new_bonus = new_tonnage < PRIME_MIN ? 0 : new_tonnage - PRIME_MIN;

      totalsData[t].sacs += new_sacs;
      totalsData[t].tonnage += new_tonnage;
      totalsData[t].retours += new_retours;
      totalsData[t].ajouts += new_ajouts;
      totalsData[t].camions += new_camions;
      totalsData[t].dechires += new_dechires;
      totalsData[t].bonus += new_bonus;

      totalsData.TOTAL.sacs += new_sacs;
      totalsData.TOTAL.tonnage += new_tonnage;
      totalsData.TOTAL.retours += new_retours;
      totalsData.TOTAL.ajouts += new_ajouts;
      totalsData.TOTAL.camions += new_camions;
      totalsData.TOTAL.dechires += new_dechires;
      totalsData.TOTAL.bonus += new_bonus;
    });
  });

  return totalsData;
}

export function dt2YYYYmmdd(dt) {
  const { y, m: month, d: day } = dt;

  const m = AddLeadingZero(parseInt(month) + 1);
  const d = AddLeadingZero(day);
  const filter_date = `${y}-${m}-${d}`;
  return filter_date;
}
export const ParseDate = (date, monthPlusOne = true) => {
  if (!date || !date.getFullYear) date = new Date();
  const y = date.getFullYear();
  const m = AddLeadingZero(
    monthPlusOne ? date.getMonth() + 1 : date.getMonth()
  );
  const d = AddLeadingZero(date.getDate());

  const h = AddLeadingZero(date.getHours());
  const i = AddLeadingZero(date.getMinutes());
  const s = AddLeadingZero(date.getSeconds());
  return {
    y: y,
    m: m,
    d: d,
    h: h,
    i: i,
    s: s,
  };
};

export const CalculateYearTotal = (year_data, addSacsAdj) => {
  ////////
  let tot_sacs = 0;
  let tot_camions = 0;
  let tot_retours = 0;
  let tot_ajouts = 0;
  let tot_dechires = 0;
  let tot_bonus = 0;

  year_data.forEach((it, i) => {
    ////// total math
    let { sacs, sacs_adj, camions, ajouts, retours, dechires } = it;

    ////
    if (addSacsAdj) sacs += sacs_adj;
    ////
    tot_sacs += sacs;
    tot_camions += camions;
    tot_ajouts += ajouts;
    tot_retours += retours;
    tot_dechires += dechires;

    const bonus =
      Number(sacs) / 20 - PRIME_MIN < 0 ? 0 : Number(sacs) / 20 - PRIME_MIN;
    tot_bonus += bonus;
  });

  const total_data = {
    sacs: tot_sacs,
    camions: tot_camions,
    t: (Number(tot_sacs) / 20).toFixed(2),
    ajouts: tot_ajouts,
    retours: tot_retours,
    dechires: tot_dechires,
    bonus: tot_bonus,
  };

  return total_data;
};

export const GetNow = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function arrayToCSV(data) {
  if (!data || !data.length) return "";

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map(
        (fieldName) => JSON.stringify(row[fieldName] ?? "") // handle nulls and escape
      )
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

export function csvToArray(csvText) {
  const [headerLine, ...lines] = csvText
    .split("\n")
    .filter((line) => line.trim());
  const headers = headerLine.split(",").map((h) => h.trim());

  return lines.map((line) => {
    const values = line.split(",").map((v) => JSON.parse(v));
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i];
    });
    return obj;
  });
}

export function GetDefaultMonthFilter() {
  const d = new Date();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const y = d.getFullYear();

  return `${y}-${m}`;
}

export const customSortShifts = (a, b) => {
  const codeA = a.code.charAt(2);
  const codeB = b.code.charAt(2);

  return customOrderShift[codeA] - customOrderShift[codeB];
};

export const customOrderShift = { M: 1, N: 3, P: 2 };

export function SortLoadsByShiftOfDay(data, y, m) {
  let year_data =
    data.filter && data.filter((it, i) => it.code.includes(`${y}_${m}`));

  year_data = year_data.sort(customSortByDate);

  let sorted_loads = {};

  year_data.forEach((it, i) => {
    const [team, shift, year, month, date] = it.code.split("_");
    const day = `${year}_${month}_${date}`;

    if (sorted_loads[day] === undefined) {
      sorted_loads[day] = [it];
    } else {
      sorted_loads[day].push(it);
    }

    let old = sorted_loads[day];

    sorted_loads[day] = [...old.sort(customSortShifts)];
  });

  //////console.log("sorted => \n", sorted_loads);
  return sorted_loads;
}

export function isToday(date) {
  const today = new Date();
  const yes =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  /*  if (setTodayIndex) {
    setTodayIndex(null);
    if (yes) {
      setTodayIndex(i);
    }
  } */

  return yes;
}

export function supabaseTime2LocalTime(date) {
  //  const date = new Date(date); //row.created_at);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Africa/Lubumbashi", // Force your timezone
  };

  const localTime = date.toLocaleString("fr-FR", options);
  console.log(localTime);
  return localTime;
}

const st2lt = supabaseTime2LocalTime;

export { st2lt };
