import React, { useState } from "react";
import { CLASS_BTN } from "../helpers/flow";
import { LANG_TOKENS, LANGS } from "../helpers/lang_strings";

export default function LanguageChooser({ onLanguageChanged }) {
  const [langID, setLangID] = useState(LANGS[0]);

  function onLangSelected(lang) {
    const { id } = lang;

    onLanguageChanged(id);
    setLangID(id);
  }

  return (
    <div>
      <div>{LANG_TOKENS.CHOOSE_LANG[langID]}</div>

      {Object.values(LANGS).map((lang, i) => (
        <button
          className={`  ${CLASS_BTN} ${
            lang.code === langID.code ? "bg-sky-500" : ""
          } `}
          key={i}
          onClick={(e) => onLangSelected(lang)}
        >
          <img src={lang.icon} width={30} height={30} />
        </button>
      ))}
    </div>
  );
}
