import { useEffect, useState } from "react";
import { CLASS_BTN, CLASS_INPUT_TEXT } from "../../helpers/flow";
import ImageUpload from "../ImageUpload";
import { UploadFile } from "../../helpers/FileUpload";
import { supabase } from "../../helpers/sb.config";
import { ImageItemContainer } from "../imageUpload/ImageItemContainer";

export default function FormNewBigbagTruck({
  onSaveBibag,
  onDataNotValid,
  onCancel,
}) {
  const [data, setdata] = useState({
    plaque: "",
    t: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toISOString().split("T")[1].split(".")[0],
  });
  const [error, seterror] = useState({});

  function onImageSelectChange(images) {
    // console.log("Pictures \n", pictures);
    setdata((old) => ({ ...old, images: images }));
  }

  async function onSave() {
    // const r = await UploadFile(supabase, imgdata.file, "bigbag", true);

    const { images, plaque, t: tonnage, bags, date, time } = data;

    const img = Object.entries(images).length === 3;
    const p = plaque !== undefined && plaque !== "" && plaque.length !== 0;
    const t = tonnage !== undefined && tonnage !== "" && tonnage.length !== 0;
    const b = bags !== undefined && bags !== "" && bags.length !== 0;
    const d = date !== undefined && date !== "" && date.length !== 0;
    const tm = time !== undefined && time !== "" && time.length !== 0;

    const valid = img && p && t && b && d && tm;
    const error = { img: img, p: p, t: t, b: b, d: d, tm: tm };
    seterror(error);

    if (valid) {
      onSaveBibag(data);
    } else {
      onDataNotValid(error);
    }
  }

  return (
    <div className=" container  ">
      <div>
        <div>Photos</div>

        <ImageItemContainer
          count={3}
          titles={["Bon", "Truck Front", "Truck Side"]}
          onImageSelectChange={onImageSelectChange}
        />
        {!error.img && (
          <div className=" bg-red-300 border border-red-900 text-xs text-red-500 inline-block rounded-md px-2   ">
            Field is required
          </div>
        )}
      </div>

      <div>
        <div>
          <div>Plaque</div>
          <div>
            <input
              className={CLASS_INPUT_TEXT}
              value={data.plaque || ""}
              onChange={(e) =>
                setdata((old) => ({ ...old, plaque: e.target.value }))
              }
            />
          </div>
          {!error.p && (
            <div className=" bg-red-300 border border-red-900 text-xs text-red-500 inline-block rounded-md px-2   ">
              Field is required
            </div>
          )}
        </div>
        <div>
          <div>Tonnage</div>
          <div>
            <input
              className={CLASS_INPUT_TEXT}
              value={data.t || ""}
              onChange={(e) =>
                setdata((old) => ({ ...old, t: e.target.value }))
              }
            />
          </div>
          {!error.t && (
            <div className=" bg-red-300 border border-red-900 text-xs text-red-500 inline-block rounded-md px-2   ">
              Field is required
            </div>
          )}
        </div>
        <div>
          <div>SACS</div>
          <div>
            <input
              className={CLASS_INPUT_TEXT}
              value={data.bags || ""}
              onChange={(e) =>
                setdata((old) => ({ ...old, bags: e.target.value }))
              }
            />
          </div>
          {!error.b && (
            <div className=" bg-red-300 border border-red-900 text-xs text-red-500 inline-block rounded-md px-2   ">
              Field is required
            </div>
          )}
        </div>
        <div>
          <div>DATE</div>
          <div>
            <input
              type="date"
              className={CLASS_INPUT_TEXT}
              value={data.date || new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setdata((old) => ({ ...old, date: e.target.value }))
              }
            />
          </div>
          {!error.d && (
            <div className=" bg-red-300 border border-red-900 text-xs text-red-500 inline-block rounded-md px-2   ">
              Field is required
            </div>
          )}
        </div>
        <div>
          <div>TIME</div>
          <div>
            <input
              type="time"
              className={CLASS_INPUT_TEXT}
              value={
                data.time ||
                new Date().toISOString().split("T")[1].split(".")[0]
              }
              onChange={(e) =>
                setdata((old) => ({ ...old, time: e.target.value }))
              }
            />
          </div>
          {!error.tm && (
            <div className=" bg-red-300 border border-red-900 text-xs text-red-500 inline-block rounded-md px-2   ">
              Field is required
            </div>
          )}
        </div>
      </div>

      <div>
        <button onClick={(e) => onSave()} className={CLASS_BTN}>
          SAVE
        </button>
        <button onClick={(e) => onCancel()} className={CLASS_BTN}>
          CANCEL
        </button>
      </div>
    </div>
  );
}
