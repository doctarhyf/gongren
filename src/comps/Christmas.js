import React from "react";
import { GetTransForTokensArray, LANG_TOKENS } from "../helpers/lang_strings";
import cm from "../img/cm.webp";

export default function Christmas({ lang, isMobile = false }) {
  return (
    <div
      className={` p-4 max-w-80   flex-col gap-4 ${
        isMobile ? " flex bg-slate-500/10 rounded-full " : " hidden : md:flex "
      } 
          `}
    >
      <p>{GetTransForTokensArray(LANG_TOKENS.NEW_YEAR_QUOTE, lang)}</p>
      <div className=" bg-red-500 w-32 h-32 rounded-full overflow-hidden self-center m-1    ">
        <img src={cm} />
      </div>
    </div>
  );
}
