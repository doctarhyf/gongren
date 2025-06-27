import { useContext } from "react";
import { UserContext } from "../../App";
import { STOCK_RESET_PWD, STOCK_TYPE } from "../../helpers/flow";
import {
  GetTransForTokensArray,
  LANG_TOKENS,
} from "../../helpers/lang_strings";

export default function Stock({ id, stock, label, onResetStock }) {
  const [, , user] = useContext(UserContext);

  let style1 = `from-amber-500 to-amber-700 text-amber-200 mx-auto  border-orange-600`;
  let style2 = `border-orange-300`;
  let style3 = `bg-orange-800`;
  let style4 = `bg-orange-900`;

  if (STOCK_TYPE.PRODUCTION === id) {
    style1 = `from-emerald-500 to-emerald-700 text-emerald-200 mx-auto  border-emerald-600`;
    style2 = `border-emerald-300`;
    style3 = `bg-emerald-800`;
    style4 = `bg-emerald-900`;
  }

  return (
    <div
      className={`w-fit px-4 p-4 border text-center   bg-gradient-to-br ${style1}  rounded-md my-2 `}
    >
      <div className={` font-bold text-3xl ${style2} py-2 mb-2 border-b  `}>
        {" "}
        {/*  {GetTransForTokensArray(LANG_TOKENS.STOCK_CONTAINER, user.lang)} */}
        {label}
      </div>

      <div className=" flex flex-col gap-4 mt-2  ">
        <div className="  flex items-center justify-between gap-2 ">
          <span className={`  ${style3}   p-2 rounded-md font-bold  `}>
            {GetTransForTokensArray(LANG_TOKENS.s32, user.lang)}
          </span>{" "}
          :
          <span className="  text-4xl text-pretty  ">
            {" "}
            {stock.s32}{" "}
            <span className=" text-sm  ">
              {" "}
              {GetTransForTokensArray(LANG_TOKENS.BAGS, user.lang)}
            </span>
          </span>{" "}
        </div>
        <div className="  flex items-center justify-between gap-2 ">
          <span className={`  ${style4}   p-2 rounded-md font-bold  `}>
            {GetTransForTokensArray(LANG_TOKENS.s42, user.lang)}
          </span>{" "}
          :{" "}
          <span className="  text-4xl text-pretty  ">
            {stock.s42}{" "}
            <span className=" text-sm  ">
              {" "}
              {GetTransForTokensArray(LANG_TOKENS.BAGS, user.lang)}
            </span>
          </span>{" "}
        </div>
      </div>

      {onResetStock && (
        <button
          onClick={(e) => {
            // Prompt the user to enter the password
            let password = prompt("Please enter your password before reset!");

            // Check if the password is correct
            if (password === STOCK_RESET_PWD) {
              // Execute the function if the password is correct
              onResetStock(id);
            } else {
              // Alert the user if the password is incorrect
              alert("Incorrect password. Please try again.");
            }
          }}
          className="p-1 text-sm hover:bg-sky-500 hover:text-white text-sky-500 rounded-md"
        >
          RESET
        </button>
      )}
    </div>
  );
}
