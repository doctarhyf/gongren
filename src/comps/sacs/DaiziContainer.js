import { useContext, useState } from "react";
import { STOCK_TYPE } from "../../helpers/flow";
import { GetRandomArray } from "../../helpers/funcs_print";
import { LANG_TOKENS } from "../../helpers/lang_strings";
import Stock from "./Stock";
import { UserContext } from "../../App";
import { formatDateTime } from "../../helpers/func";
import FormDzjzx from "../forms/FormDzjzx";

export default function DaiziContainer({ stock, trans }) {
  const [, , user] = useContext(UserContext);
  const [showInput, setShowInput] = useState(false);

  return (
    <div>
      <Stock
        id={STOCK_TYPE.PRODUCTION}
        stock={stock}
        label={GetRandomArray(LANG_TOKENS.CONTAINER_REST, user.lang)}
      />

      <div>
        <FormDzjzx />
      </div>
    </div>
  );
}
