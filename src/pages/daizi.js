import { useContext, useEffect, useState } from "react";
import { CLASS_SELECT, SACS_SECTIONS, SECTIONS } from "../helpers/flow";
import { UserContext } from "../App";
import DaiziContainer from "../comps/sacs/DaiziContainer";
import DaiziProd from "../comps/sacs/DaiziProd";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "../comps/Loading";
import { v4 as uuid } from "uuid";
import { GetTransForTokensArray, LANG_TOKENS } from "../helpers/lang_strings";

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
  const [rdk, setrdk] = useState(Math.random());
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

  useEffect(() => {
    loadData(true);
  }, [selectedPage]);

  async function loadData(reset) {
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
      if (reset) {
        setContainerStock({ stock32: 0, stock42: 0 });
        setOriginalContainerStock({ stock32: 0, stock42: 0 });
      }
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

    if (operation === "in") {
      newStock32 = originalContainerStock.stock32 + s32;
      newStock42 = originalContainerStock.stock42 + s42;
    } else {
      let newStock32IsUnsufficient = originalContainerStock.stock32 - s32 < 0;
      let newStock42IsUnsufficient = originalContainerStock.stock42 - s42 < 0;

      if (newStock32IsUnsufficient) {
        setStock32Unsufficient(true);
      }

      if (newStock42IsUnsufficient) {
        setStock42Unsufficient(true);
      }

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
    setStock32Unsufficient(false);
    setStock42Unsufficient(false);
  }

  async function onSave(data) {
    setLoading(true);
    data = {
      ...data,
      stock32: containerStock.stock32,
      stock42: containerStock.stock42,
      date_time: data.date_time.replace("T", " "),
      key: uuid(),
    };

    if (0 === parseInt(data.s32) && 0 === parseInt(data.s42)) {
      alert("Number of bags cant be zero!");
      return;
    }

    const res_trans_dzjzx = await SB.InsertItem(
      TABLES_NAMES.DAIZI_JIZHUANGXIANG,
      data
    );
    let res_trans_dzsy = null;

    //save bags to daizi shengyu tabale dzsy
    if (data.operation === "out") {
      let last_dzsy = await SB.LoadLastItem(TABLES_NAMES.DAIZI_SHENGYU);

      console.log("op out", last_dzsy);

      if (last_dzsy) {
        const { s32, s42 } = last_dzsy;
        const news32 = s32 + data.s32;
        const news42 = s42 + data.s42;

        const newDzsy = {
          operation: "in",
          s32: news32,
          s42: news42,
          key_dzjzx: data.key,
        };

        res_trans_dzsy = await SB.InsertItem(
          TABLES_NAMES.DAIZI_SHENGYU,
          newDzsy
        );
      } else {
        const newDzsy = {
          operation: "in",
          s32: data.s32,
          s42: data.s42,
          key_dzjzx: data.key,
        };

        res_trans_dzsy = await SB.InsertItem(
          TABLES_NAMES.DAIZI_SHENGYU,
          newDzsy
        );
      }
    }

    console.log("res_trans_dzsy : ", res_trans_dzsy);

    if (res_trans_dzjzx === null) {
      alert("Data Saved");
      loadData();
    }

    setLoading(false);

    console.log("saving :", data, "\nres:", res_trans_dzjzx);
    setrdk(Math.random());
  }

  return (
    <div className="container">
      <>
        <PagesMenu
          setSelectedPage={setSelectedPage}
          pages={pages}
          selectedPage={selectedPage}
          lang={user.lang}
        />

        {/*  {loading ? (
          <Loading isLoading={loading} />
        ) : (
          <ContainerStock
            containerStock={containerStock}
            stock32Unsufficient={stock32Unsufficient}
            stock42Unsufficient={stock42Unsufficient}
          />
        )} */}

        {SACS_SECTIONS.CONTAINER.label === selectedPage[1].label && (
          <DaiziContainer
            key={rdk}
            containerStock={containerStock}
            onInputChage={onInputChage}
            resetStock={resetStock}
            // stockInsufficient={stock32Unsufficient || stock42Unsufficient}
            stock32Unsufficient={stock32Unsufficient}
            stock42Unsufficient={stock42Unsufficient}
            onSave={onSave}
          />
        )}
        {SACS_SECTIONS.PRODUCTION.label === selectedPage[1].label && (
          <DaiziProd />
        )}
      </>
    </div>
  );
}
