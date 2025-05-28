import { useContext } from "react";
import { STOCK_TYPE } from "../../helpers/flow";
import { GetRandomArray } from "../../helpers/funcs_print";
import { LANG_TOKENS } from "../../helpers/lang_strings";
import Stock from "./Stock";
import { UserContext } from "../../App";

export default function DaiziProd({ stock }) {
  const [, , user] = useContext(UserContext);
  return (
    <div>
      <Stock
        id={STOCK_TYPE.PRODUCTION}
        stock={stock}
        label={GetRandomArray(LANG_TOKENS.CONTAINER_REST, user.lang)}
      />
    </div>
  );
}
