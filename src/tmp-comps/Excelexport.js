import React from "react";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import ButtonPrint from "../comps/ButtonPrint";
import excel from "../img/excel.png";

export default function Excelexport({ excelData, fileName }) {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const filexExtension = ".xlsx";

  const exportToExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + filexExtension);
  };

  return (
    <div>
      <ButtonPrint
        icon={excel}
        title={"PRINT EXCEL"}
        onClick={(e) => exportToExcel(fileName)}
      />
    </div>
  );
}
