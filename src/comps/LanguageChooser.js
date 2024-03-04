import React, { useEffect, useState } from "react";
import { CLASS_BTN, LANG_COOKIE_KEY } from "../helpers/flow";
import { LANGS } from "../helpers/lang_strings";
import { useCookies } from "react-cookie";

export default function LanguageChooser({ onLanguageChanged }) {
  const [selectLang, setSelectedLang] = useState(LANGS[1]);
  const [cookies, setCookie, removeCookie] = useCookies([LANG_COOKIE_KEY]);

  useEffect(() => {

   
    const savedLang = getSavedLang()
    setSelectedLang(savedLang);

   onLanguageChanged(LANGS.indexOf(savedLang))


  }, [])


  function getSavedLang(){
    const langIdx = cookies[LANG_COOKIE_KEY];
    const lang = LANGS[langIdx];
    return lang || LANGS[1];
  }
  

  function onLangSelected(lang){
    setSelectedLang(lang);
    setCookie(LANG_COOKIE_KEY, LANGS.indexOf(lang), {
      path: "/",
      expires: new Date(Date.now() + 86400 * 1000),
    });
    onLanguageChanged(LANGS.indexOf(lang))
  }

  return (
    <div>
      <div>Choose Language</div>

      {Object.values(LANGS).map((lang, i) => (
        <button
          className={`  ${CLASS_BTN} ${
            lang.code === selectLang.code ? "bg-sky-500" : ""
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
