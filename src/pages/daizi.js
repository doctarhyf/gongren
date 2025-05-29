import { useContext, useEffect, useState } from "react";
import { SACS_SECTIONS, SECTIONS } from "../helpers/flow";
import { UserContext } from "../App";
import DaiziContainer from "../comps/sacs/DaiziContainer";
import DaiziProd from "../comps/sacs/DaiziProd";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "../comps/Loading";

function PagesMenu({ setSelectedPage, selectedPage, pages, lang }) {
  return (
    <div className="  flex  ">
      {pages.map((page, index) => (
        <button
          key={index}
          className={`  p-2 ${
            page[0] === selectedPage[0] && " bg-sky-600 text-white  "
          }  `}
          onClick={(e) => setSelectedPage(page)}
        >
          {page[1][lang]}{" "}
        </button>
      ))}
    </div>
  );
}

export default function Daizi() {
  const [, , user] = useContext(UserContext);

  const pages = Object.entries(SACS_SECTIONS);
  const [selectedPage, setSelectedPage] = useState(pages[0]);
  const [containerStock, setContainerStock] = useState({
    stock32: 0,
    stock42: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const last_rect = await SB.LoadLastItem(TABLES_NAMES.DAIZI_JIZHUANGXIANG);

    //console.log("Last record loaded:", last_rect);

    if (last_rect) {
      // console.log("Last record:", last_rect);
      const stock32 = last_rect.stock32;
      const stock42 = last_rect.stock42;
      const newStock = {
        stock32: stock32,
        stock42: stock42,
      };
      setContainerStock(newStock);
      // console.log("Container stock updated:", newStock);
      setLoading(false);
    } else {
      // console.log("No records found.");
      setLoading(false);
    }
  }

  function onInputChage(data) {
    console.log("Input changed:", data);
  }

  return (
    <div className="container">
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <>
          <PagesMenu
            setSelectedPage={setSelectedPage}
            pages={pages}
            selectedPage={selectedPage}
            lang={user.lang}
          />

          <div className=" bg-slate-400 rounded-md p-2  ">
            <div>Container Stock</div>
            <div>s32: {containerStock.stock32}</div>
            <div>s32: {containerStock.stock42}</div>
          </div>

          {SACS_SECTIONS.CONTAINER.label === selectedPage[1].label && (
            <DaiziContainer
              containerStock={containerStock}
              onInputChage={onInputChage}
            />
          )}
          {SACS_SECTIONS.PRODUCTION.label === selectedPage[1].label && (
            <DaiziProd />
          )}
        </>
      )}
    </div>
  );
}
