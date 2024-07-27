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
  const [loading, setloading] = useState(false);

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

    if (valid) {
      onSaveBibag(data);
    } else {
      onDataNotValid({ img: img, p: p, t: t, b: b, d: d, tm: tm });
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
