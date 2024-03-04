import { useRef, useState } from "react";
import {
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  CLASS_TD,
  LANG_COOKIE_KEY,
  LOGO,
  MAIN_MENU,
} from "../helpers/flow";
import LanguageChooser from "./LanguageChooser";
import GET_TRAD, {
  LANGS,
  STRINGS,
  GET_STRINGS_KEYS,
  GEN_TRANSLATIONS,
  PACK_TRANSLATIONS_STRINGS,
} from "../helpers/lang_strings";
import { useCookies } from "react-cookie";

export default function FormLogin({ onLogin }) {
  const TRANSLATIONS = PACK_TRANSLATIONS_STRINGS([
    STRINGS.Matricule,
    STRINGS.PIN,
    STRINGS["Code and Design by"],
  ]);
  const [lang, setlang] = useState(LANGS[1]);
  const [cookies, setCookie, removeCookie] = useCookies([LANG_COOKIE_KEY]);
  const [trads, settrads] = useState({});
  const ref_mat = useRef();
  const ref_pin = useRef();

  function onBtnLogin() {
    const mat = ref_mat.current.value;
    const pin = ref_pin.current.value;

    if (mat === "" || pin === "") {
      alert(`Matricule and password cant be empty!`);
      return;
    }

    onLogin(mat, pin);
  }

  function onLanguageChanged(newLangIdx) {
    
    const newLang = LANGS[newLangIdx];
    settrads(GEN_TRANSLATIONS(TRANSLATIONS, newLang));
    setlang(newLang);
    
  }

  return (
    <div className=" flex flex-col mt-4 mx-2 p-2 ">
      <div className="mx-auto flex flex-col space-y-4 ">
        <img src={LOGO} width={200} />
        <div>{trads[GET_STRINGS_KEYS(STRINGS.Matricule.default)]}</div>
        <input
          ref={ref_mat}
          type="text"
          placeholder="matricule, ex: L0501" // coool
          className={CLASS_INPUT_TEXT}
        />
        <div>{trads[GET_STRINGS_KEYS(STRINGS.PIN.default)]}</div>
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
            {trads[GET_STRINGS_KEYS(STRINGS.Login.default)]}
          </button>
        </div>

        <LanguageChooser onLanguageChanged={onLanguageChanged} />

        

        <div className="text-sm">
          {trads[GET_STRINGS_KEYS(STRINGS["Code and Design by"].default)]}
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
