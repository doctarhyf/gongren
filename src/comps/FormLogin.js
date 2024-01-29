import { useRef } from "react";
import {
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  CLASS_TD,
  LOGO,
  MAIN_MENU,
} from "../helpers/flow";

export default function FormLogin({ onLogin }) {
  const ref_mat = useRef();
  const ref_pin = useRef();

  function onBtnLogin() {
    const mat = ref_mat.current.value;
    const pin = ref_pin.current.value;

    //console.log(mat, pin);

    if (mat === "" || pin === "") {
      alert(`Matricule and password cant be empty!`);
      return;
    }

    onLogin(mat, pin);
  }

  return (
    <div className=" flex flex-col mt-4 mx-2 p-2 ">
      <div className="mx-auto flex flex-col space-y-4 ">
        <img src={LOGO} width={200} />
        <div>Matricule</div>
        <input
          ref={ref_mat}
          type="text"
          placeholder="matricule, ex: L0501"
          className={CLASS_INPUT_TEXT}
        />
        <div>PIN</div>
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
            LOGIN
          </button>
        </div>

        <div className="text-sm">
          Code and Design by{" "}
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
