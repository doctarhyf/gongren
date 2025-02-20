import { jsPDF } from "jspdf";
import logo from "./logo.mjs";
import { GetTransForTokenName } from "./lang_strings";

const data = {
  team: "A",
  y: 2024,
  m: 8,
  d: 30,
  sup: "ALBERT KANKOBWE - 刚果贝",
  shift: "NUIT - 夜班 - 23h00 - 07h00",
  s: "N",
  camions: 28,
  sacs: 15880,
  t: 794,
  dechires: 0,
};

function getTextTokensDimensions(doc, font_size, tokens) {
  const orig_font_size = doc.getFontSize();
  doc.setFontSize(font_size);
  const lat_font_name = "helvetica";
  const zh_font_name = "DroidSansFallback";
  let tw = 0;
  let th = 0;
  tokens.forEach((t, i) => {
    const k = Object.keys(t)[0];
    const text = Object.values(t)[0];

    if (k === "lat") {
      doc.setFont(lat_font_name);
    }

    if (k === "zh") {
      doc.setFont(zh_font_name);
    }
    const { w, h } = doc.getTextDimensions(text);
    tw += w;
    th = h;

    ////console.log(w, text);
  });

  doc.setFont(lat_font_name);
  doc.setFontSize(orig_font_size);
  return { w: tw, h: th };
}

function drawChineseEnglishTextLine(doc, x, y, fontSize, tokens) {
  const size = getTextTokensDimensions(doc, fontSize, tokens);
  const orig_font_size = doc.getFontSize();
  doc.setFontSize(fontSize);
  let orig_x = x;

  const lat_font_name = "helvetica";
  const zh_font_name = "DroidSansFallback";
  tokens.forEach((t, i) => {
    const k = Object.keys(t)[0];
    const text = Object.values(t)[0];

    if (k === "lat") {
      doc.setFont(lat_font_name);
      doc.text(orig_x, y, text);
    }

    if (k === "zh") {
      doc.setFont(zh_font_name);
      doc.text(orig_x, y, text);
    }
    const { w } = doc.getTextDimensions(text);
    orig_x += w;
  });
  doc.setFontSize(orig_font_size);
  doc.setFont(lat_font_name);

  return { x: x, y: y, ...size };
}

const TOKENS_TYPE = {
  SUP: "sup",
  SHIFT: "shift",
  DATE: "date",
  TITLE: "title",
};

function ParseTokens(data, type = TOKENS_TYPE.SUP) {
  let tokens;
  let arr;
  if (TOKENS_TYPE.SUP === type) {
    arr = data.sup.split(" - ");
    tokens = [
      { lat: "•Superv." },
      { zh: "班长" },
      { lat: ":@" },
      { lat: arr[0] + " " },
      { zh: arr[1] },
    ];
  } else if (TOKENS_TYPE.SHIFT === type) {
    arr = data.shift.split(" - ");
    tokens = [
      { lat: "•" + arr[0] },
      { zh: arr[1] },
      { lat: `${arr[2]} - ${arr[3]}` },
    ];
  } else if (TOKENS_TYPE.TITLE === type) {
    tokens = [{ lat: "•EMBALLAGE CIMENT " }, { zh: "水泥包装" }];
  } else {
    tokens = [
      { lat: `${data.y}` },
      { zh: "年" },
      { lat: `${data.m}` },
      { zh: "月" },
      { lat: `${data.d}` },
      { zh: "日" },
    ];
  }

  return tokens;
}

export default function printBaozhuang(data) {
  /*
{
  team: "A",
  y: 2024,
  m: 8,
  d: 30,
  sup: "ALBERT KANKOBWE - 刚果贝",
  shift: "NUIT - 夜班 - 23h00 - 07h00",
  s: "N",
  camions: 0,
  sacs: 15880,
  t: 794,
  dechires: 0,
};
*/

  function hline(doc, x, y, len) {
    doc.line(x, y, x + len, y);
  }

  function vline(doc, x, y, len) {
    doc.line(x, y, x, y + len);
  }

  function drawGrid(doc, margin, pageWidth, pageHeight) {
    const PWM = pageWidth - 2 * margin;
    const PHM = pageHeight - 2 * margin;
    vline(doc, pageWidth / 2, margin, PHM);
    hline(doc, margin, pageHeight / 3, PWM);
    //hline(doc, margin, (pageHeight / 3) * 2, PWM);
    //doc.rect(margin, margin, PWM, PHM);
  }

  function drawDate(doc, MARG, PW, PH, box) {
    let tsize = getTextTokensDimensions(doc, FONT_SIZE, tokens_date);
    const cursor_box = {
      x: PW / 2 - tsize.w,
      y: MARG + tsize.h,
      w: tsize.w,
      h: tsize.h,
    };
    drawChineseEnglishTextLine(
      doc,
      cursor_box.x,
      cursor_box.y,
      FONT_SIZE,
      tokens_date
    );

    return cursor_box;
  }

  function drawLogo(doc, MARG, PW, PH, box) {
    const cursor_box = {
      x: MARG,
      y: MARG + box.h,
      w: PW / 5,
      h: (PW / 5) * 0.2,
    };
    doc.addImage(
      logo,
      "PNG",
      cursor_box.x,
      cursor_box.y,
      cursor_box.w,
      cursor_box.h
    );

    return cursor_box;
  }

  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  let r = doc.addFont(
    "fonts/DroidSansFallback.ttf",
    "DroidSansFallback",
    "normal"
  );

  const MARG = 10;
  const FONT_SIZE = 10;
  const PW = 210;
  const PH = 297;
  doc.setFontSize(FONT_SIZE);
  const { team, s, y, m, d, camions, sacs, t, dechires } = data;
  const filename = `${team}_${s}_${y}_${m}_${d}.pdf`;

  const tokens_date = ParseTokens(data, TOKENS_TYPE.DATE);
  const tokens_title = ParseTokens(data, TOKENS_TYPE.TITLE);
  const tokens_team = [{ lat: "•Équipe" }, { zh: "班" }, { lat: `:${team}` }];
  const tokens_sup = ParseTokens(data, TOKENS_TYPE.SUP);
  const tokens_shift = ParseTokens(data, TOKENS_TYPE.SHIFT);
  const tokens_camions = [
    { lat: "•" },
    { zh: "装车" },
    { lat: camions.toString() },
    { zh: "辆" },
    { lat: "/Camions Chargés" },
  ];
  const tokens_sacs = [
    { lat: "•" },
    { zh: "袋子用" },
    { lat: sacs.toString() },
    { zh: "个" },
    { lat: "/Sacs Utilisés" },
  ];
  const tokens_t = [
    { lat: "•" },
    { zh: "共计" },
    { lat: t.toString() },
    { zh: "吨" },
    { lat: "/ Tonne" },
  ];
  const tokens_dechires = [
    { lat: "•" },
    { zh: "撕裂的袋子" },
    { lat: dechires.toString() },
    { zh: "个" },
    { lat: "/Sacs déchirés" },
  ];

  const SPACE = 5;
  const PWM = PW - 2 * MARG;
  const PHM = PH - 2 * MARG;
  const block = { w: PWM / 3, h: PHM / 3 };

  //block M
  let cursor_box = {
    x: MARG,
    y: MARG,
  };

  drawGrid(doc, MARG, PW, PH);
  //date
  cursor_box = drawDate(doc, MARG, PW, PH, cursor_box);

  //logo
  cursor_box = drawLogo(doc, MARG, PW, PH, cursor_box);

  //title
  cursor_box = drawChineseEnglishTextLine(
    doc,
    MARG +
      block.w / 2 -
      getTextTokensDimensions(doc, FONT_SIZE, tokens_title).w / 2 +
      MARG,
    cursor_box.y + cursor_box.h + SPACE * 1.5,
    FONT_SIZE,
    tokens_title
  );
  hline(
    doc,
    cursor_box.x,
    cursor_box.y + SPACE / 4,
    getTextTokensDimensions(doc, FONT_SIZE, tokens_title).w
  );

  // equipe
  cursor_box = drawChineseEnglishTextLine(
    doc,
    MARG + SPACE,
    cursor_box.y + cursor_box.h + SPACE * 1.5,
    FONT_SIZE,
    tokens_team
  );

  // superv.
  cursor_box = drawChineseEnglishTextLine(
    doc,
    MARG + SPACE,
    cursor_box.y + SPACE,
    FONT_SIZE,
    tokens_sup
  );

  // shift
  cursor_box = drawChineseEnglishTextLine(
    doc,
    MARG + SPACE,
    cursor_box.y + SPACE,
    FONT_SIZE,
    tokens_shift
  );

  // camions
  cursor_box = drawChineseEnglishTextLine(
    doc,
    MARG + SPACE,
    cursor_box.y + SPACE,
    FONT_SIZE,
    tokens_camions
  );

  // sacs
  cursor_box = drawChineseEnglishTextLine(
    doc,
    MARG + SPACE,
    cursor_box.y + SPACE,
    FONT_SIZE,
    tokens_sacs
  );

  // t
  cursor_box = drawChineseEnglishTextLine(
    doc,
    MARG + SPACE,
    cursor_box.y + SPACE,
    FONT_SIZE,
    tokens_t
  );

  // dechires
  cursor_box = drawChineseEnglishTextLine(
    doc,
    MARG + SPACE,
    cursor_box.y + SPACE,
    FONT_SIZE,
    tokens_dechires
  );

  doc.save(filename);
}

//console.log(Object.keys(printBaozhuang);
//printBaozhuang(data);

function drawAgentStatCard(doc, i, agent, x, y, lang = "en-US") {
  const fontsize = 10;
  if (agent.chef_deq === "OUI") agent.poste = "DEQ";
  if (agent.is_exp === "OUI") agent.poste = "EXPD";

  let { nom, postnom, prenom, poste, mingzi, matricule, phone, chef_deq } =
    agent;

  const tk_key = lang === "zh-CN" ? "zh" : "lat";
  const td_poste = GetTransForTokenName(poste, lang);
  console.log(
    "tk_key => ",
    tk_key,
    " poste => ",
    poste,
    " td_poste => ",
    td_poste
  );

  const agentdata = [
    { lat: `${i + 1}. -> ` },
    { [tk_key]: `${td_poste}: ` },
    { zh: mingzi },
    { lat: ` - ${matricule} ${nom} ${postnom} ${prenom} ` },
  ];

  console.log("agentdata => ", agentdata);

  // finalchart.push(agentdata);
  let {
    x: xr,
    y: yr,
    w: wr,
    h: hr,
  } = drawChineseEnglishTextLine(doc, x, y, fontsize, agentdata);

  if (poste === "SUP") {
    doc.setFillColor(180, 0, 0);
  } else if (poste === "DEQ") {
    doc.setFillColor(0, 0, 180);
  } else if (poste === "OPE") {
    doc.setFillColor(0, 180, 0);
  } else if (poste === "CHARG") {
    doc.setFillColor(0, 180, 180);
  } else if (poste === "NET") {
    doc.setFillColor(180, 0, 180);
  } else if (poste === "EXP") {
    doc.setFillColor(90, 90, 170);
  } else if (poste === "DEQ") {
    doc.setFillColor(0, 0, 255);
  } else {
    doc.setFillColor(0, 0, 0);
  }

  doc.rect(
    xr - fontsize / 2,
    yr - fontsize / 2,
    wr + fontsize,
    hr + fontsize / 2,
    "F"
  );
  drawChineseEnglishTextLine(doc, x, y, fontsize, agentdata);
  y = yr + fontsize;

  return y;
}

export function printChart(lang, chart, marg = 10, filename) {
  if (!chart) {
    alert("Cant print undefined or empty Chart");
    return;
  }

  const fontsize = 10;
  const doc = new jsPDF();
  let r = doc.addFont(
    "fonts/DroidSansFallback.ttf",
    "DroidSansFallback",
    "normal"
  );
  doc.setFontSize(fontsize);

  let y = marg * 2;

  const flatchart = chart.flat();

  const { equipe, section } = flatchart[0];
  const title = `${section}, ${equipe} / ( ${flatchart.length} )`;
  if (!filename) filename = `${title.replaceAll(" ", "_")}.pdf`;

  doc.setTextColor("black");
  doc.text(title, marg, marg);
  doc.setTextColor("white");

  flatchart.map((agent, i) => {
    y = drawAgentStatCard(doc, i, agent, marg, y, lang);
  });

  doc.save(filename);
}
