import { useContext } from "react";
import {
  GetTransForTokensArray,
  LANG_TOKENS,
} from "../../helpers/lang_strings";
import { UserContext } from "../../App";

export default function ContainerStock({
  containerStock,
  stock32Unsufficient,
  stock42Unsufficient,
}) {
  const [, , user] = useContext(UserContext);

  return (
    <div className=" p-2 border  border-slate-600  rounded-md w-fit my-2 ">
      <div className=" mb-2  shadow-md bosl text-xl font-bold  ">
        {GetTransForTokensArray(LANG_TOKENS.STOCK_CONTAINER, user.lang)}
      </div>
      <div>
        s32:<span className=" text-xl "> {containerStock.stock32}</span>{" "}
        {GetTransForTokensArray(LANG_TOKENS.BAGS, user.lang)}
        {stock32Unsufficient && (
          <span className=" bg-red-900 text-red-200 p-1 text-sm rounded-md  ">
            {GetTransForTokensArray(LANG_TOKENS.STOCK_UNSUFFICIENT, user.lang)}
          </span>
        )}
      </div>
      <div>
        s42: <span className=" text-xl "> {containerStock.stock42}</span>{" "}
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
