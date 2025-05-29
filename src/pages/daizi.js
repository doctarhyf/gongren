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
  const [originalContainerStock, setOriginalContainerStock] = useState({
    stock32: 0,
    stock42: 0,
  });
  const [stock32Unsufficient, setStock32Unsufficient] = useState(false);
  const [stock42Unsufficient, setStock42Unsufficient] = useState(false);
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
      setOriginalContainerStock(newStock);
      setLoading(false);
    } else {
      // console.log("No records found.");
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("Container stock updated:", containerStock);
  }, [containerStock]);

  function onInputChage(data) {
    setStock32Unsufficient(false);
    setStock42Unsufficient(false);

    const { operation, s32, s42 } = data;
    let newStock32 = 0;
    let newStock42 = 0;
    let newStock32IsUnsufficient = originalContainerStock.stock32 - s32 < 0;
    let newStock42IsUnsufficient = originalContainerStock.stock42 - s42 < 0;

    if (newStock32IsUnsufficient) {
      setStock32Unsufficient(true);
    }

    if (newStock42IsUnsufficient) {
      setStock42Unsufficient(true);
    }

    if (operation === "in") {
      newStock32 = originalContainerStock.stock32 + s32;
      newStock42 = originalContainerStock.stock42 + s42;
    } else {
      newStock32 = newStock32IsUnsufficient
        ? originalContainerStock.stock32
        : originalContainerStock.stock32 - s32;
      newStock42 = newStock42IsUnsufficient
        ? originalContainerStock.stock42
        : originalContainerStock.stock42 - s42;
    }

    setContainerStock({
      stock32: newStock32,
      stock42: newStock42,
    });
  }

  function resetStock() {
    const origStock = { ...originalContainerStock };

    console.log("orig stock : ", origStock);
    setContainerStock(origStock);
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

            {stock32Unsufficient ||
              (stock42Unsufficient && (
                <div className="text-red-100 bg-red-900">
                  {stock32Unsufficient && (
                    <div>The stock of 32 is unsufficient</div>
                  )}
                  {stock42Unsufficient && (
                    <div>The stock of 42 is unsufficient</div>
                  )}
                </div>
              ))}
          </div>

          {SACS_SECTIONS.CONTAINER.label === selectedPage[1].label && (
            <DaiziContainer
              containerStock={containerStock}
              onInputChage={onInputChage}
              resetStock={resetStock}
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
