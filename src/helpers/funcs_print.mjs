import { jsPDF } from "jspdf";
const orientation = "landscape";
const doc = new jsPDF({ orientation: orientation });
let r = doc.addFont(
  "fonts/DroidSansFallback.ttf",
  "DroidSansFallback",
  "normal"
);
const PG_W = orientation === "landscape" ? 297 : 210;
const PG_H = orientation === "landscape" ? 210 : 297;
const LOGO_H = (66 / 10) * 2;
const PAGE_MARG = 15;
const FONT_SIZE = 8;
const BOX_WIDTH_SPACE_PCT = 1.1;

function hline(doc, x, y, len) {
  doc.line(x, y, x + len, y);
}

function vline(doc, x, y, len) {
  doc.line(x, y, x, y + len);
}

function drawChineseEnglishTextLine(doc, x, y, fontSize, tokens) {
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
}

function ls_food(agents_names) {
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
  const date = new Date().toDateString();
  let { w, h } = doc.getTextDimensions(date);
  doc.text(date, PG_W - w - MARG, MARG);

  doc.setFontSize(16);

  doc.addImage(logo, "PNG", LOGO_X, LOGO_Y, LOGO_W, LOGO_H);
  doc.line(MARG, LOGO_H + MARG, PG_W - MARG, LOGO_H + MARG);

  let title = `NOMS DES AGENTS CIMETERIE`;
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

    const txt = `${i + 1}. ${it}`;
    const d = doc.getTextDimensions(txt);
    doc.text(txt, x, y);
  });

  const sig_block = [
    "Signature: _______________",
    "",
    "Equipe   : _______________",
    "",
    "Heure    : _______H_______",
    "",
    `Total    : ${agents_names.length} Agent(s)`,
  ];

  dims = doc.getTextDimensions(sig_block);
  const sig_x = dims.w * 2 + 30 * 2;
  const sig_y = PG_CONT_Y + MARG / 4;
  doc.text(sig_block, sig_x, sig_y);
  const sp = MARG / 4;
  doc.rect(sig_x - sp, sig_y - sp * 2, dims.w + sp * 2, dims.h + sp * 2);
  doc.save("a4.pdf");
}

function drawLogo(doc) {
  const logo =
    "data:image/png;base64,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";
  const MARG = 15;
  const LOGO_X = MARG;
  const LOGO_Y = 10;
  const LOGO_W = (293 / 10) * 2;

  doc.setFontSize(12);
  const date = new Date().toDateString();
  let { w, h } = doc.getTextDimensions(date);
  doc.text(date, PG_W - w - MARG, MARG);

  doc.setFontSize(16);

  doc.addImage(logo, "PNG", LOGO_X, LOGO_Y, LOGO_W, LOGO_H);
  //doc.line(MARG, LOGO_H + MARG, PG_W - MARG, LOGO_H + MARG);
}

function draw_en_tete(
  doc,
  agent_data,
  page_margin,
  page_width,
  logo_height,
  onGetHeaderHeight
) {
  const logo =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARsAAABCCAYAAABn23KqAAAPLklEQVR4Xu2dL3AcOxLGG149dCDg4MHAx96DCQsMcdWDA3PMMOSqVCaGYRfoY1sV8qDZLdxjgYELDQNddcQ330xLbrV6dufP7ux43Kr6xbsrqdVqSd9oRuuYiOjJOcjd7e0tgTrtjXznme2JYpVivgSurq7+WvsUan4avk7hs25rzSDpADg5Ljb9WZXYvH///u+1L19qHg0fT0HQba4ZJB0AJ8fFpj+rEJs6/QofDL9OTdBtrxkkHQAnx8WmPy9abOr0rube8OdcfNU+rBkkHQAnx8WmPy9SbOr0R813w49zM2s/Lw2SDoCT42LTnxcjNt++fftL3c4nmubnVM7ezyWBpAPg5LjY9GfxYiNOlh6MdufmXvu3ZpB0AJwcF5v+LFZsZjhZGsPJ+7lkkHQAnBwXm/4sTmxovpOlIWxqftW+rh0kHQgnx8WmP4sRG5r/ZOkY2FF9xQ5L+/paQNJBcXJcbPpzcbGhy50sdYFvHYerq6u/aV9fG0g6OE6Oi01/LiI2CzlZ0uxrruGb9ve1gqSD5OS42PRnVrFZ2MlSBLuqSvvquNj0wcWmP7OIzUJPlrY1H7SvzjNIOmhOjotNf84qNuQnSy8aJB28IWyp3caumY8iWHsqY9AXbK/DyqlOFKtMbMhPllYBkg7kEII2uGbohAto7dAJYkV+srQqkHRAhxC0wTVDJ1hArwWaFisIzJT6p2ZPfrI0GSQd2CGEaOi3m3+/WyP/uPnXWxEsTDodg7642Lw8/GTphCDpAA8hJEM3T0/r5H+nekDsYvNy2JKfLJ0cJB3oIYRkqFika8HFZgw0LVaXYkN+snQ2kHTAhxCSoWKRrgUXmzHQtFjNiZ8szQSSDv4QQjJULNK14GIzBpoWqznwk6WZQdKDMISQDBWLdC242IyBpsXqnOzJT5YuApIejCGEZKhYpGvBxWYMNC1W58BPli4Mkh6UIYRkqFika8HFZgw0LVanZEt+srQIkPTgDCEkQ8UiXQsuNmOgabE6FV/xm+HaN+cyIOkBGkJIhopFuhZcbMZA02J1SvAg+NYfBF8eJD04QwjJULFI14KLzRhoWqzOAY647/yI+3Ig6UEZQkiGikW6FlxsxkDTYnVu/qz5XfvsnBckPRBDCMlQsUjXgovNGGharOZiS+K/EHHOC5IegCGEZKhYpGvBxWYMNC1Wc/OD/Fj87CDpwA8hJEPFIl0LLjZjoGmxuhQPNdd+gnUekHTAhxCSoWKRrgUXmzHQtFhdGj/BOgNIOtBDCNrgEqlFY1+KSF9cbMZA02K1FPwE64Qg6QAPIWiDS8TFZn5oWqzw/w0v7a8n+AnWRJB0UIcQtMEl4mIzP3SCWC3070JtyU+wRoGkgzmEPbXBXyJfUieXITZYMPBrzTzHfFqsMmFe6F+89BOsgSDpIK6FberkMsTmNfAc82mx6twF0vL+4gIuIn6C1QMkHby14GIzP2cXG2H/A7W7KV33UvgJ1hGQdNDWgovN/MwmNqId/JXMjWHjUvgJVgdIOlhrwcVmfmYXmwj//e+v5CdYiwVJB2gtuNjMz8XEJoLbGGpPsHBbo+1eii35CRYh6cCsBReb+bm42ET4BOualnVs/qpPsJB0QNaCi838LEZsJHWqqF3oup1LAQF8dSdYSDoQa8HFZn4WKTaROn2kZZ1gpXhZ8C0hdmcblOU6uD3Ea3xW3dzc9BYstqd9AA9D/trEmzdvfqf2VhV+RBHHT7z/8ssv9E7XAUi64bXgYjM/ixabSJ2wWPDwVrc7N51iQ+1i7vOwG+LzSde3QDmjfuTofwrPD+HxqyS6rsX392/eZH9dFEkXWgsuNvPzIsQmwovnjvot6nNgig2NE8Kg7Wjo8K5uo8tLeFf0YNQ7xCN2QaL9osBacLGZnxclNhFeSHB67hOsQmyovdXT5XqhdxISFtaijuDx0K0UjRNA8F3YKDLXgovN/LxIsYnwL35+puFX8LFYYtN1m7Kh9lc1cCvU9esaG21P2EW/dHnNH7oewHMhoyzAjvAWz2jwk7rFurlFQ9IZa8HFZn5etNhE+Ni8oml96IMlNnuj3KPhnyWIe21P2N0Z5TX3uh5gMdFlwVfVBn6FRJcBt5xfZKwFF5v5WYXYSKi9remzUMdgiY0lIuB2yMmT5P3bt28Ne9Yu5NFq44DYwEbvLysihZVSpU7+87/XdPMjjOG3m/+kYFJ7DKnbcZ55jvm0WPWewHNRp3eGn1OpjHa2VC5qCW6zgnzwegxuS9u5I7ut4mSrx/MeCCTsXUPYdP3kh/7AcZzLgQVrLOYusLO4O/RgmG1aX2isyBahYrfFNrqeJVmgvc96l1QYdRzncvDzmCELO/LVOk2CEBllnyAEXXnWf5PBZa1br0PgAfLznUF8wU+coao44tpSuy0qnk5zmRDp+rYggNOW46CrHjoV89in1FZXe7zNy8qBQ7/m39HfbPtep0raOLRF1Pk8OIVPzSDXNrt8gw9Nvl3/mstURl6FPL6/zj6Xk5Bgn6+ERtkG7VOsp8pV1tjic9037ot5a2Tl1enaGmdgfW74Bor2MD7WgowLT38ebVt51I4B5gzmDubQJ30ll6DdY/NHlqX2N9j14j1G8ayL2lMiXW4n8h+M/M/aDuCx6joJ6ySOWWOEJ12zJav5yO8ragOZfROQ2gd/X+h5UNF49lRalEW59F9FqryfBwYx4DWLCNpDOxH49CAnHfury3WKDZdHkNHfD6K/u5r7OGnqtJXt4L21wBpf24FIcWB7iE2QwDa3992anHW6Q74QG8Qw9i2KDWIA3/FZpOI8vMbkj5+j3F70Ce9lWdiKZRu0T6KebBOLATHMrqikYsafVairbVp5eA0sUaBWVIqv1vPngdq+xP4UYkNtXJoYSuI8s+YLiXiJshhXtFPxWKJ9lEM8zG/iEl/Y9OeH4O//4Kh7R8YittDzk+wH9UHkw2+dv9O+SOJc77Bt0diT3wzsClJFYodDalBYhX/qhcN2IWA/dQDYDpz4oQeY2wt4zQNb3EPy72b8jFcKHvCinEWP/oYogrCpxAb1usQTEzkdHdKBBcb+Yot5byycRmzieysGeK8XtMgLaFt9hokRhQqTq8nnskHbsEA93SaPPfotxaLwDe3JMlaeZUtD7SLHBK90HucHoD8H4jagECuOMeZjcQGAP7E99hE+FIIFeF4WeeKo2rzA9oF34jhahlOwpRd0JK1Vnmc6/0l9qxff3SnK9N2FcewqskUrwTHo3n1YUE+xiXa77LMT6Gg2wNRDbLgcrhTNxBwiNtQOVuGPBWzGhcODjQdfey2ePJF3yBN1q+ifJvpLrQhkZfD+pYgNiAspzgkyfEN7qK/rirwN8SmLzo/wQm522fip89lW6LJBvKvhn9njAbWDzi4AlMcLO5idtn0M0e7B3Q37AR80mb8cc8SsWNQkxp7G3YpFgrATd44ZWpD4iP1B2WngvtW7iwFqS+VtFCZJdhsVdzXxmQ1eG2L0xD/xzcY0wNRTbDjvB17z4sVVayux+lWn73oxdAEbsSxP9jhhMrHC5/HKqfqBwGc+IR5SHFGX8oHtJTb0vJWPND7BFuW3URirJJBUig3GM/NRttXll8rbEC8I1Nfl6LjYPFFzR1/mi3JJJKidc9ZtUgD6cx6bZkdjiVUUG7aB+MjbYRmvJNp9SWJct5ted+waeK0gFpoHfYEj+1kMqESZByO/L83aYjtd3z7eGH3FBVmXSzubrntVLKoQEVeuPbWTC7cB+CBTXS6T7Wb4fTZIdWrEhl9jEDf8uqIeYsPONxOEF28jIhItcGx/3zXYGrQdFw61u7Avsd04+Dx5m6sVfIi2qe3HvfYJ9aXYsL0d8fcbqL/YNA9RI+LWL1C7MCG+GKfswSXsUy42TXsS2ZasdyhP2BwjNvC1uIWJSLHgOrjSFrsb6hAbUs9qqI13EispNjweELPmISnlfUM8m9fKfnbll/0ntZvh9507a2ovIsVipVY44EugA6dVYh7glqvIH0K83eL4F/kM/EWDwBQalGGfmolbCAYaipOPsECfO9GIE7UCUkyguBjZrmSvtqdJbPg9AogXFfUQGw6A3NmY5TQkrsLHgM04ceATPQtCmjDEuxphu5nEdGCBaX/FLRomSC+x0Qta5AW0HcdNL2DYR74oG7QNC9Q70CbGrnkGRoZvaA/1dT2ZBz+oQ3CoFQu9k3sg9dyNbQT5Wdxxqro72EtlhNgAHg+0hwuMjldxGIILjFgriIUUNu1347veqYjyEK6nkaQ+Ueu3zh/KrbCHMdD5fWnigYTO/ZBCIOHBSgOB1xgcfUUW+aZy47PYKL/PxEbY21IPsSGeoHitF+8h6Eh/1S5Ais2GeHILQYU4yKsW/olXxIo6Fpjlb5zwNbtTiA2/xvY3e0ZA5eIJ2oYF6llt8n16upCw/bRr4M8+UcdtEnxBHX4darZybPSuRtTDOOq+oX5Qn2W7GvE5RKDxU4sN4FsaXABAJcqlgwkNi5R8flX4yJ+ba0TkI4Z6wR4j+cXzEwKry3SuEbJvuR5iPsdjb5Q5xvOhiejcTgeRn1OggTR58D4GMzoQt1vcyRRsSXx4JCZlJjaABwvthaaOsdDYTnOli7asxXsIavu71X7G3UDsD8oIsdnJ8tROmEf5XIjaRdVc+Wig2ABeWI+nEht+j1gF8R59b/K5bMo7BOrJNnmsK1I7DGpjkAQj7toO+AsbKU7wh/JnePC3EAvO01/LQN0Q38f5qYWKy0IImrhaYtN83s41LNpK1KvI2FXFcaL88YH5fJBjYp7Sirq4UFiCYZHNZereHQXdjqiDOOvyT9J/9rvvDqd5zJK1IRrDJNlTq+RbapW/2dorp7JnPLxwfvDAYgEWSi7qwtF4m1GIDeBBayYXv9ad2NV8lhOIfdDlskBp0Aa1kwb20N+m3+pYUIrNT1mfF1u2pZYiQu2kLHxCn7rEhut9kD50iY22G8uQEht5i8b5dzGfy2o75rhwPVkOsdtYv6ND7S4W+fATC8YUCy5bwbb6LNTcRxGwxILLZTsHrhfE+2w3rSEWqy6xAXzBzW67qd3RYn3sqe0jQH+bXS2XgW/ptkZDR3wDvKawLjfcBhZwM9ZM+pqGso3yxbhaZUWdSpdnzNtGamMNHxAHlMM44z3W+CdLSItGMbCHFunawGJ8Tf2dk0OTey1g7ljPmZyS/wN9BfrFMiSLOwAAAABJRU5ErkJggg==";

  const LOGO_X = page_margin;
  const LOGO_Y = 10;
  const LOGO_W = (293 / 10) * 2;

  doc.setFontSize(12);
  const date = new Date().toDateString();
  let { w, h } = doc.getTextDimensions(date);
  doc.text(date, page_width - w - page_margin, page_margin);

  // doc.setFontSize(16);

  doc.addImage(logo, "PNG", LOGO_X, LOGO_Y, LOGO_W, logo_height);

  const fontSize = 12;
  const lineHeight = fontSize / 2;

  const title_y = 30;

  let poste_zh = "岗位"; // postes_zh_array[poste] !!!!!

  const text_gck = [
    { lat: "GCK" },
    { zh: "公司水泥线水泥" },
    { zh: poste_zh },
    { zh: "名单" },
  ];
  const text_poste = [
    { lat: `${agent_data.poste}/` },
    { zh: "" },
    { lat: ": ATELIER DE CIMENT" },
  ];

  let cury = agent_data.year;
  let curm = agent_data.month - 1;
  let nextm = curm + 1 > 12 ? 1 : curm + 1;
  let curmn = getFrenchMonthName(curm).toUpperCase();
  let nextmn = getFrenchMonthName(nextm).toUpperCase();

  const text_roulement_month = [
    { lat: `${curmn} - ${nextmn} (${cury}` },
    { zh: "年" },
    { lat: curm + 1 + "" },
    { zh: "月" },
    { lat: ")" },
  ];

  drawChineseEnglishTextLine(doc, page_margin, title_y, fontSize, text_gck);
  drawChineseEnglishTextLine(
    doc,
    page_margin,
    title_y + lineHeight,
    fontSize,
    text_poste
  );
  drawChineseEnglishTextLine(
    doc,

    page_margin,
    title_y + lineHeight * 2,
    fontSize,
    text_roulement_month
  );

  onGetHeaderHeight && onGetHeaderHeight(title_y + lineHeight * 3);
}

const agents_food = [...Array(20).fill("MUTUNDA KOJI Franvale")];
const agents_rl = [
  ...Array(20).fill({
    nom: "MUTUNDA KOJI Franvale",
    rld: "JJPPNNRRJJPPNNRRJJPPNNRRJJPPNNR",
  }),
];

function getFrenchMonthName(index) {
  const month = new Date(2000, index, 1); // Using any year, day 1 to get a consistent result
  const monthName = month.toLocaleString("fr-FR", { month: "long" });
  return monthName;
}

function centeTextInRect(
  doc,
  x,
  y,
  box_marg_pct,
  fontSize,
  textTokens,
  subTextTokenz
) {
  let tokens = textTokens;

  let { h: text_h, w: text_w } = getTextTokensDimensions(doc, fontSize, tokens);

  const box_w = text_w + (text_w * box_marg_pct - text_w);
  const box_h = fontSize;

  let text_x = x + (box_w - text_w) / 2;
  let text_y = y + fontSize / 2 + text_h / 2;

  if (subTextTokenz) {
    tokens = subTextTokenz;
    text_w = getTextTokensDimensions(doc, fontSize, subTextTokenz).w;
    text_x = x + (box_w - text_w) / 2;
  }

  drawChineseEnglishTextLine(doc, text_x, text_y, fontSize, tokens);
  doc.rect(x, y, box_w, box_h);
  const rect = { x: x, y: y, w: box_w, h: box_h };
  return rect;
}

function drawTextInRect(doc, text, font_size, x, y, w, h) {
  const origi_fsize = doc.getFontSize();
  doc.setFontSize(font_size);
  const { w: text_w, h: text_h } = doc.getTextDimensions(text);
  let text_x = x + (w - text_w) / 2;
  let text_y = y + h * 0.7;
  doc.text(text, text_x, text_y);
  doc.setFontSize(origi_fsize);
}

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

    //console.log(w, text);
  });

  doc.setFont(lat_font_name);
  doc.setFontSize(orig_font_size);
  return { w: tw, h: th };
}

function getDayName(dateString, oneLetter) {
  const daysOfWeekEn = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const daysOfWeekFr = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  // Create a new Date object from the given date string
  console.log(dateString);
  return "L";
  const date = new Date(dateString);

  // Get the day of the week (0-6)
  const dayOfWeekIndex = date.getDay();

  // Get the day name from the array
  const dayName = daysOfWeekFr[dayOfWeekIndex];

  return oneLetter ? dayName[0] : dayName;
}

function print_agent_roulement(doc, agent_data) {
  // Delete all existing pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = pageCount; i >= 1; i--) {
    doc.deletePage(i);
  }

  // Add a new, single page
  doc.addPage();
  const { month, year } = agent_data;
  let days_letters = [];
  const array_rld = agent_data.rld.split("");
  const END_DATE = array_rld.length;
  const num_days = array_rld.length;

  array_rld.map((d, i) => {
    let ds = `${month + 1}/${i + 1}/${year}`;
    let dt = new Date(ds).toString();
    let dname = getDayName(ds, true);
    days_letters[i] = dname;
  });

  doc.setFontSize(FONT_SIZE);
  draw_en_tete(doc, agent_data, PAGE_MARG, PG_W, LOGO_H, (h) => {
    let text_tokens = [{ lat: "Num / " }, { zh: "序号" }];

    hline(doc, PAGE_MARG, h, PG_W - PAGE_MARG * 2);

    let rect_row_num = { y: h };

    rect_row_num = centeTextInRect(
      doc,
      PAGE_MARG,
      rect_row_num.y + FONT_SIZE,
      BOX_WIDTH_SPACE_PCT,
      FONT_SIZE,
      text_tokens
    );

    rect_row_num = centeTextInRect(
      doc,
      rect_row_num.x,
      rect_row_num.y + FONT_SIZE,
      BOX_WIDTH_SPACE_PCT,
      FONT_SIZE,
      text_tokens,
      [{ lat: "13" }]
    );

    text_tokens = [{ lat: agent_data.nom.fr }, { zh: agent_data.nom.zh }];
    let rect_row_agent = centeTextInRect(
      doc,
      PAGE_MARG + rect_row_num.w,
      h + FONT_SIZE,
      BOX_WIDTH_SPACE_PCT,
      FONT_SIZE,
      text_tokens,
      [{ lat: "AGENT/" }, { zh: "工人" }]
    );

    rect_row_agent = centeTextInRect(
      doc,
      PAGE_MARG + rect_row_num.w,
      rect_row_agent.y + FONT_SIZE,
      BOX_WIDTH_SPACE_PCT,
      FONT_SIZE,
      text_tokens
    );

    text_tokens = [{ lat: "MAT./" }, { zh: "工号" }];
    let rect_row_mat = centeTextInRect(
      doc,
      PAGE_MARG + rect_row_num.w + rect_row_agent.w,
      h + FONT_SIZE,
      BOX_WIDTH_SPACE_PCT,
      FONT_SIZE,
      text_tokens
    );

    rect_row_mat = centeTextInRect(
      doc,
      rect_row_mat.x,
      rect_row_mat.y + FONT_SIZE,
      BOX_WIDTH_SPACE_PCT,
      FONT_SIZE,
      text_tokens,
      [{ lat: "L0501" }]
    );
    doc.rect(
      PAGE_MARG,
      h,
      rect_row_num.w + rect_row_agent.w + rect_row_mat.w,
      FONT_SIZE
    );

    let day_box_w =
      (PG_W - PAGE_MARG - (rect_row_mat.x + rect_row_mat.w)) / num_days;

    const days_x_start = rect_row_mat.x + rect_row_mat.w;
    let day_boxes_w;
    const day_box_h = rect_row_mat.h;
    let date = 21;
    array_rld.forEach((el, i) => {
      day_boxes_w = i * day_box_w;

      const day_box_y = rect_row_mat.y - FONT_SIZE * 2;
      const date_box_y = day_box_y + FONT_SIZE;
      const date_x = days_x_start + i * day_box_w;
      const rld_data_y = rect_row_mat.y;

      doc.rect(date_x, day_box_y, day_box_w, day_box_h);
      drawTextInRect(
        doc,
        days_letters[i],
        FONT_SIZE,
        date_x,
        day_box_y,
        day_box_w,
        day_box_h
      );
      doc.rect(date_x, date_box_y, day_box_w, day_box_h);

      if (date > END_DATE) date = 1;
      drawTextInRect(
        doc,
        date + "",
        FONT_SIZE,
        date_x,
        date_box_y,
        day_box_w,
        day_box_h
      );
      date += 1;

      doc.rect(date_x, rld_data_y, day_box_w, day_box_h);
      //doc.text(el, date_x, rld_data_y + FONT_SIZE / 2);

      drawTextInRect(
        doc,
        el,
        FONT_SIZE,
        date_x,
        rld_data_y,
        day_box_w,
        day_box_h
      );
    });
  });

  doc.save("rl.pdf");
}

function print_agents_list_roulement(agents_rl) {
  drawLogo();

  const rld_data = agents_rl[0].rld;
  const num_days = rld_data.split("").length;

  const marg = 20;
  const y_start = LOGO_H * 3;

  let names_w = 0;
  agents_rl.map((it, i) => {
    const { nom, rld } = it;
    let line_y = y_start + i * 10;
    //doc.line(marg, line_y, PG_W - marg, line_y);
    hline(doc, marg, line_y, PG_W - marg * 2);
    const name_text_dims = doc.getTextDimensions(it.nom);

    //doc.text(it.nom, marg, y);
    //doc.line(dim.w, y, dim.w, y + 10);
    //doc.line(marg, y, marg, y + 10);

    const h_line_len = 10;
    const text_sp_pct = 0.1;
    const x_sp_pct = marg * text_sp_pct;
    const y_sp_pct = -marg * text_sp_pct;
    vline(doc, marg, line_y, marg, h_line_len);
    vline(doc, marg + name_text_dims.w, line_y, marg, h_line_len);

    let rest_w = PG_W - marg * 2 - name_text_dims.w;
    let space = rest_w / num_days;

    [...Array(num_days)].map((it, i) => {
      let rld_text = rld[i];
      let box_x = marg + name_text_dims.w + i * space;
      vline(doc, box_x, line_y, h_line_len);

      let original_font_size = doc.getFontSize();
      doc.setFontSize(12);
      doc.text(rld_text, box_x + x_sp_pct, line_y + y_sp_pct);
      doc.setFontSize(original_font_size);
    });

    let original_font_size = doc.getFontSize();
    doc.setFontSize(12);
    doc.text(nom, marg + x_sp_pct, line_y + y_sp_pct);
    doc.setFontSize(original_font_size);

    if (name_text_dims.w > names_w) names_w = name_text_dims.w;
  });

  doc.save("rl.pdf");
}

export {
  hline,
  vline,
  drawChineseEnglishTextLine,
  ls_food,
  drawLogo,
  draw_en_tete,
  agents_food,
  agents_rl,
  getTextTokensDimensions,
  centeTextInRect,
  drawTextInRect,
  getDayName,
  print_agent_roulement,
  print_agents_list_roulement,
  doc,
};
