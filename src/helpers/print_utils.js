import { SUPERVISORS } from "./flow";
import { formatFrenchDate } from "./func";

export function draw_watermark(doc, margin, watermark) {
  const oldfs = doc.getFontSize();
  doc.setFontSize(8);
  const text = watermark || "https://gongren.vercel.app/";
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const textWidth = doc.getTextWidth(text);
  const x = pageWidth - textWidth - margin;
  const y = pageHeight - margin;
  doc.text(new Date().toISOString(), margin, y);
  doc.text(text, x, y);
  doc.setFontSize(oldfs);
}

export function draw_logo(doc, logo, margin, yspacefactor = 4) {
  const ofs = doc.getFontSize();
  const text = "SHUINI CHEJIAN © 2024";
  const LOGO = { W: 50 * 0.75, H: 10 * 0.75 };
  doc.addImage(logo, "PNG", margin, margin, LOGO.W, LOGO.H);
  const logotexty = margin + LOGO.H * 1.5;

  doc.setFontSize(10);
  doc.text(text, margin, logotexty);
  const textdims = doc.getTextDimensions(text);

  doc.setFontSize(ofs);
  return {
    x: margin,
    y: margin,
    w: textdims.w,
    h: textdims.h + logotexty,
    hm: textdims.h + logotexty + margin / yspacefactor,
  };
}

export function draw_daily_repport_title(doc, y, pw, pm, fsize) {
  const text_tokens = [
    { lat: "RAPPORT DU CHARGEMENT JOURNALIER" },
    // { zh: "每日装载报告" },
  ];
  const old_fsize = doc.getFontSize();

  doc.setFontSize(fsize);
  const { w, h } = get_text_tokens_dimensions(doc, fsize, text_tokens);

  const tx = pm + (pw - pm) / 2 - w / 2;
  const ty = y + fsize;

  draw_chinese_english_textline(doc, tx, ty, fsize, text_tokens);

  doc.setFontSize(old_fsize);

  return { x: tx, y: ty, w: w, h: h };
}

export function draw_daily_repport_table(
  doc,
  pw,
  ph,
  pm,
  rect_title,
  fsize,
  data
) {
  const loads = {};

  data.forEach((ld, i) => {
    const [team, shift, year, month, day] = ld.code.split("_");
    loads[shift] = { ...ld, sup: SUPERVISORS[team] };
  });

  const deq_m = loads.M?.sup?.nom || "";
  const deq_p = loads.P?.sup?.nom || "";
  const deq_n = loads.N?.sup?.nom || "";

  const cam_m = Number(loads.M?.camions) || 0;
  const cam_p = Number(loads.P?.camions) || 0;
  const cam_n = Number(loads.N?.camions) || 0;

  const cam_m_text = cam_m === 0 ? "" : `${cam_m} CAMIONS`;
  const cam_p_text = cam_p === 0 ? "" : `${cam_p} CAMIONS`;
  const cam_n_text = cam_n === 0 ? "" : `${cam_n} CAMIONS`;

  const sacs_m = loads.M?.sacs || "0";
  const sacs_p = loads.P?.sacs || "0";
  const sacs_n = loads.N?.sacs || "0";

  const ton_m = sacs_m / 20;
  const ton_p = sacs_p / 20;
  const ton_n = sacs_n / 20;

  let ton_bonus_m =
    Number(sacs_m) / 20 - 600 < 0 ? 0 : Number(sacs_m) / 20 - 600;
  let ton_bonus_p =
    Number(sacs_p) / 20 - 600 < 0 ? 0 : Number(sacs_p) / 20 - 600;
  let ton_bonus_n =
    Number(sacs_n) / 20 - 600 < 0 ? 0 : Number(sacs_n) / 20 - 600;

  ton_bonus_m = Number(ton_bonus_m.toFixed(2));
  ton_bonus_p = Number(ton_bonus_p.toFixed(2));
  ton_bonus_n = Number(ton_bonus_n.toFixed(2));

  const prime_m = ton_bonus_m * 1000;
  const prime_p = ton_bonus_p * 1000;
  const prime_n = ton_bonus_n * 1000;

  const tot_prime_cdf = prime_m + prime_p + prime_n;
  const tot_ton = ton_bonus_m + ton_bonus_p + ton_bonus_n;

  const old_fsize = doc.getFontSize();
  doc.setFontSize(fsize);
  const table_x = pm;
  const table_y = rect_title.y + fsize;
  const table_w = pw - pm * 2;
  const table_h = ph - pm - fsize - (rect_title.y + rect_title.h);

  const boxes_rect = [];
  const cols = [19, 21, 22, 45, 23, 29, 22];
  const rows = [15, 56, 11, 56, 13, 60, 13, 13];

  const texts = [
    [
      "TEMPS",
      ["CHEF DE", "POSTE"], //"CHEF DE POSTE",
      "MACHINE",
      "NOMS DES AGENTS",
      ["NOMBRE", "DE CAMIONS", "CHARGES"],
      ["DIFFERENCE", "DE CHARGEMENT"],
      ["MONTANT", "FC"],
    ],
    [
      ["07h00", "15h00", -90],
      [deq_m, -90],
      "",
      "",
      [`${cam_m_text}`, -90],
      [
        `${sacs_m} sacs`,
        ` `,
        `(${ton_m} - 600) T`,
        " ",
        `${ton_bonus_m} T`,
        -90,
      ],
      [`${prime_m} FC`, -90],
    ],
    ["MATIN", "", "", "", "", "", ""],
    [
      ["15h00", "23h00", -90],
      [deq_p, -90],
      "",
      "",
      [`${cam_p_text}`, -90],
      [
        `${sacs_p} sacs`,
        ` `,
        `(${ton_p} - 600) T`,
        " ",
        `${ton_bonus_p} T`,
        -90,
      ],
      [`${prime_p} FC`, -90],
    ],
    ["APREM.", "", "", "", "", "", ""],
    [
      ["23h00", "07h00", -90],
      [deq_n, -90],
      "",
      "",
      [`${cam_n_text}`, -90],
      [
        `${sacs_n} sacs`,
        ` `,
        `(${ton_n} - 600) T`,
        " ",
        `${ton_bonus_n} T`,
        -90,
      ],
      [`${prime_n} FC`, -90],
    ],
    ["NUIT", "", "", "", "", "", ""],
    [
      ["TOTAL", "DU JOUR"],
      "",
      "",
      "",
      "",
      `${tot_ton} T`,
      `${tot_prime_cdf} FC`,
    ],
  ];

  let totx = 0;
  let toty = 0;
  const boxes = [];
  rows.forEach((boxh, iy) => {
    toty = rows.slice(0, iy).reduce((acc, cv) => acc + cv, 0);
    cols.forEach((boxw, ix) => {
      totx = cols.slice(0, ix).reduce((acc, cv) => acc + cv, 0);
      const box = {
        x: table_x + totx,
        y: table_y + toty,
        w: boxw,
        h: boxh,
        ix: ix,
        iy: iy,
      };

      let box_text = texts[iy][ix];
      const text_is_array = Array.isArray(box_text); // || ""; // `ix:${ix}, iy:${iy}`;
      let box_text_angle = 0;
      let align = "center";

      if (text_is_array) {
        const text_array_len = box_text.length;
        const last_el = box_text[text_array_len - 1];

        if (typeof last_el === "number") {
          box_text_angle = last_el;

          box_text = box_text.splice(0, text_array_len - 1);
          align = "left";
        }
      }

      let tvx = box.x + box.w / 2;
      let tvy = box.y + box.h / 2;

      if (box_text_angle !== 0) {
        const { w } = doc.getTextDimensions(box_text.join(""));
        tvy -= w / 2;
        //tvy = tvy -
      }

      doc.rect(box.x, box.y, box.w, box.h);
      doc.text(box_text, tvx, tvy, {
        align: align,
        angle: box_text_angle,
      });

      boxes.push(box);
    });
  });

  doc.setFontSize(old_fsize);
}

export function draw_chinese_english_textline(doc, x, y, fontSize, tokens) {
  const orig_font_size = doc.getFontSize();
  doc.setFontSize(fontSize);
  let orig_x = x;
  let w;
  let h;

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
    const dims = doc.getTextDimensions(text);
    w = dims.w;
    h = dims.h;
    orig_x += w;
  });
  doc.setFontSize(orig_font_size);
  doc.setFont(lat_font_name);

  return { x: x, y: y, w: orig_x, h: h };
}

export function get_text_tokens_dimensions(doc, font_size, tokens) {
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

export function draw_date(
  doc,
  page_width,
  page_margin,
  font_size,
  other_date,
  shortDate = true
) {
  const old_font_size = doc.getFontSize();
  doc.setFontSize(font_size);

  const finalDate = other_date || new Date();
  const shortDateString = `${finalDate.getFullYear()}.${
    Number(finalDate.getMonth()) + 1
  }.${finalDate.getDate()}`;

  const date = shortDate
    ? shortDateString
    : formatFrenchDate(other_date || new Date()).toUpperCase();
  let { w, h } = doc.getTextDimensions(date);

  doc.text(date, page_width - w - page_margin, page_margin);
  doc.setFontSize(old_font_size);
}

export const GCK_LOGO =
  "data:image/png;base64,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";
