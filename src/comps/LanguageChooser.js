import React, { useEffect, useState } from "react";
import { CLASS_BTN } from "../helpers/flow";
import { LANGS } from "../helpers/lang_strings";

export default function LanguageChooser({ onLanguageChanged }) {
  const [lang, setLang] = useState(LANGS[1]);

  /* useEffect(() => {
    setLang(lang);
  }, [lang]);
 */
  return (
    <div>
      <div>Choose Language</div>

      {Object.values(LANGS).map((lang, i) => (
        <button
          className={`  ${CLASS_BTN} ${
            lang.code === lang.code ? "bg-sky-500" : ""
          } `}
          key={i}
          onClick={(e) => {
            setLang(lang);
            console.log(lang);
          }}
        >
          <img src={lang.icon} width={30} height={30} />
        </button>
      ))}
    </div>
  );
}
