import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../img/gck.png";
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

  const rect = drawLogo(doc, logo, marginLeft);

  //console.log(rect);

  let content = {
    startY: rect.h + marginLeft / 2, //rect.y + rect.h,
    head: headers,
    body: data,
  };

  doc.text(title, marginLeft, rect.hm);
  doc.autoTable(content);
  printWatermark(doc, marginLeft);
  doc.save(filename);
}

function drawLogo(doc, logo, margin, yspacefactor = 4) {
  const ofs = doc.getFontSize();
  const text = "SHUINI CHEJIAN © 2024";
  const LOGO = { W: 55, H: 15 };
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

function printWatermark(doc, margin, watermark) {
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
