import React from "react";
import { GetTransForTokensArray, LANG_TOKENS } from "../helpers/lang_strings";
import cm from "../img/cm.webp";
import styles from "../ny.module.css";

export default function Christmas({ lang }) {
  return (
    <div>
      <div className=" p-4   flex-col gap-4 text-white hidden md:flex   ">
        <p>{GetTransForTokensArray(LANG_TOKENS.NEW_YEAR_QUOTE, lang)}</p>
        <div className=" bg-red-500 w-32 h-32 rounded-full overflow-hidden self-center m-1    ">
          <img src={cm} />
        </div>
      </div>
    </div>
  );
}
