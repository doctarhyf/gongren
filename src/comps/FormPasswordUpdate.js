import React, { useRef, useState } from "react";
import { CLASS_BTN, CLASS_INPUT_TEXT } from "../helpers/flow";
import { GetTransForTokensArray, LANG_TOKENS } from "../helpers/lang_strings";
//import LOGO from "../helpers/logo.mjs";
import lock from "../img/lock.png";

export default function FormPasswordUpdate({ onUpdatePassword, lang }) {
  const pinRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,8}$/;
  const [newpin, setnewpin] = useState({ pin: "", repin: "" });

  /* To create a JavaScript regular expression that checks if a PIN is between 6 and 8 characters, and includes both letters and numbers, you can use the following regex pattern: */

  function onUpdatePIN() {
    // onUpdatePassword();
  }
  return (
    <div className=" p-6  ">
      <div className="mx-auto bg-black/10 shadow-2xl  p-6 rounded-md  flex flex-col space-y-4    md:card md:bg-base-100 md:w-96 md:p-2 md:shadow-xl ">
        <div className=" flex justify-center items-center ">
          <img src={lock} height={100} width={100} />
        </div>
        <div className=" text-3xl font-thin text-center  ">PIN UPDATE</div>
        <div>{GetTransForTokensArray(LANG_TOKENS.PIN, lang)}</div>
        <p className=" italic text-xs  ">
          {GetTransForTokensArray(LANG_TOKENS.LABEL_ENTER_NEw_PIN, lang)}
        </p>
        <input
          value={newpin.pin}
          onChange={(e) =>
            setnewpin((old) => ({ ...old, pin: e.target.value }))
          }
          type="password"
          className={` ${CLASS_INPUT_TEXT}  ${
            !pinRegex.test(newpin.pin)
              ? " bg-red-800 text-white "
              : " bg-green-800 text-green-300 "
          }  `}
        />
        <div>{GetTransForTokensArray(LANG_TOKENS.RE_PIN, lang)}</div>
        <p className=" italic text-xs ">
          {GetTransForTokensArray(LANG_TOKENS.LABEL_RE_ENTER_NEw_PIN, lang)}
        </p>
        <input
          value={newpin.repin}
          onChange={(e) =>
            setnewpin((old) => ({ ...old, repin: e.target.value }))
          }
          type="password"
          className={` ${CLASS_INPUT_TEXT}  ${
            !pinRegex.test(newpin.repin)
              ? " bg-red-800 text-white "
              : " bg-green-800 text-green-300 "
          }  `}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              onUpdatePIN();
            }
          }}
        />

        {newpin.pin !== newpin.repin && (
          <p className=" from-red-800 to-red-950 text-center  bg-gradient-to-br border-red-500 text-red-300 p-1 rounded-md text-xs ">
            {GetTransForTokensArray(LANG_TOKENS.MSG_PIN_SHOULD_MATCH, lang)}
          </p>
        )}

        <p className="p-1 rounded-md text-xs text-center ">
          {GetTransForTokensArray(LANG_TOKENS.MSG_PIN_REQUIREMENT, lang)}
        </p>
        <div>
          <button
            onClick={(e) => onUpdatePIN()}
            className={` ${CLASS_BTN} mx-auto w-full`}
          >
            {GetTransForTokensArray(LANG_TOKENS.SAVE, lang)}
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
      </div>
    </div>
  );
}
