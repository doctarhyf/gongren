import { useRef, useState } from "react";
import {
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  CLASS_TD,
  LOGO,
  MAIN_MENU,
} from "../helpers/flow";
import LanguageChooser from "./LanguageChooser";
import GET_TRAD, { LANGS, STRINGS_KEYS } from "../helpers/lang_strings";

export default function FormLogin({ onLogin }) {
  const [lang, setlang] = useState(LANGS[1]);
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

  function onLanguageChanged(newLang) {
    // const ft = GET_TRAD(STRINGS_KEYS.MATRICULE, newLang.code);
    let newtrads = {
      ...trads,
      [STRINGS_KEYS.MATRICULE]: GET_TRAD(STRINGS_KEYS.MATRICULE, newLang.code),
    };
    newtrads = {
      ...newtrads,
      [STRINGS_KEYS.PIN]: GET_TRAD(STRINGS_KEYS.PIN, newLang.code),
    };

    newtrads = {
      ...newtrads,
      [STRINGS_KEYS["Code and Design by"]]: GET_TRAD(
        STRINGS_KEYS["Code and Design by"],
        newLang.code
      ),
    };

    settrads(newtrads);
    setlang(newLang);

    console.log(newtrads);
  }

  return (
    <div className=" flex flex-col mt-4 mx-2 p-2 ">
      <div className="mx-auto flex flex-col space-y-4 ">
        <img src={LOGO} width={200} />
        <div>{trads[STRINGS_KEYS.MATRICULE]}</div>
        <input
          ref={ref_mat}
          type="text"
          placeholder="matricule, ex: L0501" // coool
          className={CLASS_INPUT_TEXT}
        />
        <div>{trads[STRINGS_KEYS.PIN]}</div>
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
            {trads[STRINGS_KEYS.Login]}
          </button>
        </div>

        <LanguageChooser onLanguageChanged={onLanguageChanged} />

        <div className="text-sm">
          {trads[STRINGS_KEYS["Code and Design by"]]}
          <a
            className="text-sky-500  italic"
            href="https://github.com/doctarhyf"
          >
            Ir. Franvale Mutunda K. / @doctarhyf
          </a>
        </div>
      </div>
    </div>
  );
}
