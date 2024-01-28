import React from "react";
import pdf from "../img/pdf.png";
import { CLASS_BTN } from "../helpers/flow";

export default function ButtonPrint({ onClick, title, icon }) {
  return (
    <button
      onClick={(e) => onClick && onClick()}
      className={`${CLASS_BTN} flex text-sm my-2`}
    >
      <img src={icon || pdf} alt="pdf" width={20} height={30} />{" "}
      {title || "PRINT"}
    </button>
  );
}
