import React, { useEffect, useState } from "react";
import { CLASS_BTN } from "../helpers/flow";
import { LANGS } from "../helpers/lang_strings";

export default function LanguageChooser({ onLanguageChanged }) {
  const [selectLang, setSelectedLang] = useState(LANGS[1]);

  useEffect(() => {
    onLanguageChanged(selectLang);
  }, [selectLang]);

  return (
    <div>
      <div>Choose Language</div>

      {Object.values(LANGS).map((lang, i) => (
        <button
          className={`  ${CLASS_BTN} ${
            lang.code === selectLang.code ? "bg-sky-500" : ""
          } `}
          key={i}
          onClick={(e) => {
            setSelectedLang(lang);
            //console.log(lang);
          }}
        >
          <img src={lang.icon} width={30} height={30} />
        </button>
      ))}
    </div>
  );
}
