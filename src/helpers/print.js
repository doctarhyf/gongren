import jsPDF from "jspdf";
import logo from "../img/gck.png";
import {
  draw_daily_repport_table,
  draw_watermark,
  draw_logo,
  draw_daily_repport_title,
  draw_date,
  GCK_LOGO,
} from "./print_utils";
export function printTable(
  data,
  title,
  headers,
  filename = `report_${new Date().getTime()}.pdf`
) {
  if (data.length === 0) {
    alert("Cant print empty data!");
    return;
  }
  /*

  autoTable(doc, {
  head: [['Name', 'Email', 'Country']],
  body: [
    ['David', 'david@example.com', 'Sweden'],
    ['Castille', 'castille@example.com', 'Spain'],
    // ...
  ],
})

  */
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "portrait"; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(15);

  //const title = "My Awesome Report";
  //const headers = [["NAME", "PROFESSION"]];

  /*
people: [
        { name: "Keanu Reeves", profession: "Actor" },
        { name: "Lionel Messi", profession: "Football Player" },
        { name: "Cristiano Ronaldo", profession: "Football Player" },
        { name: "Jack Nicklaus", profession: "Golf Player" },
      ]
  */

  //const data = this.state.people.map((elt) => [elt.name, elt.profession]);

  const rect = draw_logo(doc, logo, marginLeft);

  //console.log(rect);

  let content = {
    startY: rect.h + marginLeft / 2, //rect.y + rect.h,
    head: headers,
    body: data,
  };

  doc.text(title, marginLeft, rect.hm);
  doc.autoTable(content);
  draw_watermark(doc, marginLeft);
  doc.save(filename);
}

function printBaozhuang(doc, data) {
  /* {
    "team": "A",
    "y": 2024,
    "m": 8,
    "d": 30,
    "sup": "ALBERT KANKOBWE - 刚果贝",
    "shift": "NUIT - 夜班 - 23h00 - 07h00",
    "s": "N",
    "camions": 0,
    "sacs": 15880,
    "t": 794,
    "dechires": 0
} */
}

export function printDailyRepport(data, date, filename, adj_sacs = true) {
  const PAGE_WIDTH = 210;
  const PAGE_HEIGHT = 297;
  const PAGE_MARGIN = 15;
  const FONT_SIZE = 8;

  const doc = new jsPDF();
  let fontr = doc.addFont(
    "./fonts/DroidSansFallback.ttf",
    "DroidSansFallback",
    "normal"
  );

  const rect_logo = draw_logo(doc, GCK_LOGO, PAGE_MARGIN, 1);

  draw_date(doc, PAGE_WIDTH, PAGE_MARGIN, FONT_SIZE, date, true);
  const rect_title = draw_daily_repport_title(
    doc,
    rect_logo.h / 2,
    PAGE_WIDTH,
    PAGE_MARGIN,
    12
  );

  if (adj_sacs) {
    console.log("old items => ", data);

    data = data.map((it) => {
      const { sacs, sacs_adj } = it;

      return { ...it, sacs: parseInt(sacs) + parseInt(sacs_adj), sacs_adj: 0 };
    });

    console.log("new items => ", data);
  }

  draw_daily_repport_table(
    doc,
    PAGE_WIDTH,
    PAGE_HEIGHT,
    PAGE_MARGIN,
    rect_title,
    FONT_SIZE,
    data
  );

  doc.save(filename);
}

export function printAgentInfo(agent, lang = "en-US") {
  if (!agent) {
    return false;
  }
  const PAGE_WIDTH = 210;
  const PAGE_HEIGHT = 297;
  const PAGE_MARGIN = 15;
  const FONT_SIZE = 8;

  const doc = new jsPDF();
  let fontr = doc.addFont(
    "./fonts/DroidSansFallback.ttf",
    "DroidSansFallback",
    "normal"
  );

  const rect_logo = draw_logo(doc, GCK_LOGO, PAGE_MARGIN, 1);
  const {
    matricule,
    chef_deq,
    prenom,
    nom,
    postnom,
    section,
    poste,
    equipe,
    phone,
    conrtrat,
    active,
  } = agent;

  /*  L0566
小班长
Mr. PATRICK
MWEZ MBAY 帕特里克
车间: 水泥包装
岗位: OPERATEUR
班组: C
电话: +243 895 879 177
contrat: GCK
active: OUI */

  const textinfo = `${matricule} ${chef_deq ? "DEQ" : " "}
Mr. ${prenom},
${nom} ${postnom}
${section}
${poste}
Equipe: ${equipe}
${phone}
Agent: ${conrtrat}`;

  doc.text(textinfo, rect_logo.x, rect_logo.y + FONT_SIZE * 3);

  /* draw_date(doc, PAGE_WIDTH, PAGE_MARGIN, FONT_SIZE, date, true);
  const rect_title = draw_daily_repport_title(
    doc,
    rect_logo.h / 2,
    PAGE_WIDTH,
    PAGE_MARGIN,
    12
  ); */

  const docName = "agent.pdf";
  doc.save(docName);
  return true;
}
