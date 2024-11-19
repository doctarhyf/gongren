import React, { useEffect, useState } from "react";
import { CLASS_BTN } from "../helpers/flow";
import {
  GetLangIndexByLangCode,
  LANG_TOKENS,
  LANGS,
} from "../helpers/lang_strings";

export default function LanguageChooser({ onLanguageChanged }) {
  const [langIdx, setLangIdx] = useState(LANGS[0]);
  const [lang, setLang] = useState(LANGS[0].code);

  useEffect(() => {
    // Load language from localStorage when the component mounts
    const savedLang = localStorage.getItem("lang");

    //console.log("loaded lang: ", savedLang);
    if (savedLang) {
      setLang(savedLang);
      const idx = GetLangIndexByLangCode(savedLang);
      setLangIdx(idx);

      //console.log("saveLang: ", savedLang);
      //console.log("idx: ", idx);
    }
  }, []);

  function onLangSelected(lang) {
    const { id } = lang;

    onLanguageChanged(id);
    setLangIdx(id);
  }

  return (
    <div>
      <div>{LANG_TOKENS.CHOOSE_LANG[langIdx]}</div>

      {Object.values(LANGS).map((lang, i) => (
        <button
          className={`  ${CLASS_BTN} ${
            lang.id === langIdx ? "bg-sky-500" : ""
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
