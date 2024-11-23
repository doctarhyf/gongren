import React from "react";
import { GetTransForTokensArray, LANG_TOKENS } from "../helpers/lang_strings";
import cm from "../img/cm.webp";

export default function Christmas({ lang }) {
  return (
    <div className=" flex flex-col gap-4   bg-slate-800 italic font-serif p-2 rounded-md text-white  ">
      <p>{GetTransForTokensArray(LANG_TOKENS.NEW_YEAR_QUOTE, lang)}</p>
      <div className=" bg-red-500 w-32 h-32 rounded-full overflow-hidden self-center m-1    ">
        <img src={cm} />
      </div>
    </div>
  );
}
