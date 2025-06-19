import { useContext } from "react";
import {
  GetTransForTokensArray,
  LANG_TOKENS,
} from "../../helpers/lang_strings";
import { UserContext } from "../../App";

export default function ShengyuStock({
  shengYuStock,
  stock32Unsufficient,
  stock42Unsufficient,
}) {
  const [, , user] = useContext(UserContext);

  return (
    <div className=" p-2 border bg-gradient-to-br  from-emerald-500  to-emerald-700 text-emerald-200  border-slate-600  rounded-md w-fit my-2 ">
      <div className=" mb-2  shadow-md bosl text-xl font-bold  ">
        {GetTransForTokensArray(
          LANG_TOKENS.STOCK_BAGS_REMAINING_PRODUCTION,
          user.lang
        )}
      </div>
      <div>
        {GetTransForTokensArray(LANG_TOKENS.s32, user.lang)}:
        <span className=" text-xl "> {shengYuStock.s32}</span>{" "}
        {GetTransForTokensArray(LANG_TOKENS.BAGS, user.lang)}
        {stock32Unsufficient && (
          <span className=" bg-red-900 text-red-200 p-1 text-sm rounded-md  ">
            {GetTransForTokensArray(LANG_TOKENS.STOCK_UNSUFFICIENT, user.lang)}
          </span>
        )}
      </div>
      <div>
        {GetTransForTokensArray(LANG_TOKENS.s42, user.lang)}:{" "}
        <span className=" text-xl "> {shengYuStock.s42}</span>{" "}
        {GetTransForTokensArray(LANG_TOKENS.BAGS, user.lang)}
        {stock42Unsufficient && (
          <span className=" bg-red-900 text-red-200 p-1 text-sm rounded-md  ">
            {GetTransForTokensArray(LANG_TOKENS.STOCK_UNSUFFICIENT, user.lang)}
          </span>
        )}
      </div>{" "}
    </div>
  );
}
