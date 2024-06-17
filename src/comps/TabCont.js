import React, { useContext, useEffect, useRef, useState } from "react";

export default function TabCont({ tabs, onSelectTab }) {
  const [selected_tab, set_selected_tab] = useState(Object.entries(tabs)[0]);

  return (
    <div className=" gap-4 flex py-4 sm:flex-row flex-col ">
      {Object.entries(tabs).map((t, i) => (
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
          {t[1].label}
        </button>
      ))}
    </div>
  );
}
