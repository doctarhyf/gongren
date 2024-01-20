import { useRef } from "react";
import { CLASS_BTN, LOGO, MAIN_MENU } from "../helpers/flow";

export default function FormLogin({ onLogin }) {
  const ref_mat = useRef();
  const ref_pin = useRef();

  function onBtnLogin() {
    const mat = ref_mat.current.value;
    const pin = ref_pin.current.value;

    onLogin(mat, pin);
  }

  return (
    <div className=" flex flex-col mt-4 ">
      <div className="mx-auto flex flex-col space-y-4 ">
        <img src={LOGO} width={200} />
        <div>Matricule</div>
        <input
          value={"L0501"}
          ref={ref_mat}
          type="text"
          placeholder="matricule"
        />
        <div>Password</div>
        <input
          value={"0000"}
          ref={ref_pin}
          type="password"
          placeholder="0000"
        />
        <div>
          <button
            onClick={(e) => onBtnLogin()}
            className={` ${CLASS_BTN} mx-auto w-full`}
          >
            LOGIN
          </button>
        </div>

        <div>
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
