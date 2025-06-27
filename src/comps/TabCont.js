import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import { UserHasAccessCode } from "../helpers/func";

export default function TabCont({ tabs, onSelectTab, selectedIndex = 0 }) {
  const [, , user] = useContext(UserContext);
  const [selected_tab, set_selected_tab] = useState(
    Object.entries(tabs)[selectedIndex]
  );

  return (
    <div className=" gap-4 flex py-4 sm:flex-row flex-col ">
      {Object.entries(tabs).map((t, i) => {
        return (
          t[1].active && (
            <>
              {UserHasAccessCode(user, t[1].access_code) && (
                <button
                  onClick={(e) => {
                    set_selected_tab(t);
                    onSelectTab(t);
                  }}
                  className={`  hover:text-white hover:bg-sky-500 ${
                    selected_tab[0] === t[0]
                      ? " text-white bg-sky-500  "
                      : "  text-sky-500 "
                  } p-1 border border-sky-500 rounded-md `}
                >
                  {t[1][user.lang]}
                </button>
              )}
            </>
          )
        );
      })}
    </div>
  );
}
