import { useEffect, useRef, useState } from "react";
import { CLASS_BTN, CLASS_INPUT_TEXT, LOGO } from "../helpers/flow";
import {
  GetLangCodeByIndex,
  GetLangIndexByLangCode,
  GetTransForTokensArray,
  LANG_TOKENS,
  LANGS,
} from "../helpers/lang_strings";
import LanguageChooser from "./LanguageChooser";

import Christmas from "./Christmas";

function MyForm({
  lang,
  ref_mat,
  langIdx,
  ref_pin,
  onBtnLogin,
  onLanguageChanged,
  alreadyLoggedIn,
}) {
  const location = window.location; //.pathname.split("/");
  const { host, pathname } = location;
  ///console.log("location: ", location);
  ///console.log("host: ", host);
  ///console.log("pathname: ", pathname);
  return (
    <div className="mx-auto w-full dark:bg-transparent dark:from-transparent dark:border-transparent dark:to-transparent bg-gradient-to-br from-white to-black/5 border-slate-200 md:border   flex flex-col space-y-4    md:card md:bg-base-100 md:w-96 md:p-2 md:shadow-xl ">
      <img src={LOGO} width={200} className=" bg-white " />
      <div>{GetTransForTokensArray(LANG_TOKENS.EMPLOYE_ID, lang)}</div>
      <input
        ref={ref_mat}
        type="text"
        placeholder={`ex: L0501`} // coool
        className={CLASS_INPUT_TEXT}
      />
      <div>{LANG_TOKENS.PIN[langIdx]}</div>
      <input
        ref={ref_pin}
        type="password"
        className={CLASS_INPUT_TEXT}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            onBtnLogin();
          }
        }}
      />
      <div>
        {alreadyLoggedIn ? (
          <button
            onClick={(e) => onBtnLogin(true)}
            className={` ${CLASS_BTN} mx-auto w-full`}
          >
            {GetTransForTokensArray(LANG_TOKENS.LOGOUT_AND_LOGIN, lang)}
          </button>
        ) : (
          <button
            onClick={(e) => onBtnLogin()}
            className={` ${CLASS_BTN} mx-auto w-full`}
          >
            {GetTransForTokensArray(LANG_TOKENS.LOGIN, lang)}
          </button>
        )}
      </div>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">{`Matricule and password cant be empty!`}</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <LanguageChooser onLanguageChanged={onLanguageChanged} />
      <div className=" hidden ">
        <Christmas lang={lang} isMobile={true} />
      </div>
      <div className="text-sm">
        {LANG_TOKENS.CODE_AND_DESIGN[langIdx]}
        <a className="text-sky-500  italic" href="https://github.com/doctarhyf">
          Ir. Franvale Mutunda K. (库齐) / @doctarhyf
        </a>
      </div>
    </div>
  );
}

export default function FormLogin({ onLogin, alreadyLoggedIn }) {
  const [langIdx, setLangIdx] = useState(0);
  const [lang, setLang] = useState(LANGS[0].code); // Default language

  const ref_mat = useRef();
  const ref_pin = useRef();

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");

    if (savedLang) {
      setLang(savedLang);
      const idx = GetLangIndexByLangCode(savedLang);
      setLangIdx(idx);
    }
  }, []);

  function onBtnLogin(logoutLogin) {
    const mat = ref_mat.current.value;
    const pin = ref_pin.current.value;

    if (mat === "" || pin === "") {
      document.getElementById("my_modal_5").showModal();
      return;
    }

    const langCode = GetLangCodeByIndex(langIdx);

    onLogin(mat, pin, langCode, logoutLogin);
  }

  function onLanguageChanged(idx) {
    setLangIdx(idx);
    setLang(LANGS[idx].code);
    localStorage.setItem("lang", LANGS[idx].code);
  }

  return (
    <div className=" flex  mt-4 mx-2 p-2 ">
      <MyForm
        lang={lang}
        ref_mat={ref_mat}
        langIdx={langIdx}
        ref_pin={ref_pin}
        onBtnLogin={onBtnLogin}
        onLanguageChanged={onLanguageChanged}
        alreadyLoggedIn={alreadyLoggedIn}
      />

      {/* <Christmas lang={lang} /> */}
    </div>
  );
}
