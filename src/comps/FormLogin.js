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
import userEvent from "@testing-library/user-event";

export default function FormLogin({ onLogin }) {
  const [langIdx, setLangIdx] = useState(0);
  const [lang, setLang] = useState(LANGS[0].code); // Default language

  const ref_mat = useRef();
  const ref_pin = useRef();

  useEffect(() => {
    // Load language from localStorage when the component mounts
    const savedLang = localStorage.getItem("lang");

    console.log("loaded lang: ", savedLang);
    if (savedLang) {
      setLang(savedLang);
      const idx = GetLangIndexByLangCode(savedLang);
      setLangIdx(idx);

      console.log("saveLang: ", savedLang);
      console.log("idx: ", idx);
    }
  }, []);

  function onBtnLogin() {
    const mat = ref_mat.current.value;
    const pin = ref_pin.current.value;

    if (mat === "" || pin === "") {
      document.getElementById("my_modal_5").showModal();
      return;
    }

    const langCode = GetLangCodeByIndex(langIdx);
    console.log("lang code ", langCode);

    onLogin(mat, pin, langCode);
  }

  function onLanguageChanged(idx) {
    setLangIdx(idx);
    setLang(LANGS[idx].code);
    localStorage.setItem("lang", LANGS[idx].code);
  }

  return (
    <div className=" flex flex-col mt-4 mx-2 p-2 ">
      <div className="mx-auto  flex flex-col space-y-4    md:card md:bg-base-100 md:w-96 md:p-2 md:shadow-xl ">
        <img src={LOGO} width={200} />
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
          <button
            onClick={(e) => onBtnLogin()}
            className={` ${CLASS_BTN} mx-auto w-full`}
          >
            {GetTransForTokensArray(LANG_TOKENS.LOGIN, lang)}
          </button>
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

        <div className="text-sm">
          {LANG_TOKENS.CODE_AND_DESIGN[langIdx]}
          <a
            className="text-sky-500  italic"
            href="https://github.com/doctarhyf"
          >
            Ir. Franvale Mutunda K. (库齐) / @doctarhyf
          </a>
        </div>
      </div>
    </div>
  );
}
