import { useState } from "react";
import { CLASS_BTN, CLASS_INPUT_TEXT } from "../../helpers/flow";
import ImageUpload from "../ImageUpload";
import { UploadFile } from "../../helpers/FileUpload";
import { supabase } from "../../helpers/sb.config";

export default function FormNewBigbagTruck({ onSaveBibag }) {
  const [data, setdata] = useState({ plaque: "", t: "" });
  const [imgdata, setimgdata] = useState({ b64: undefined, file: undefined });
  const [imguploaded, setimguploaded] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setimgdata((old) => ({ ...old, file: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgb64 = reader.result;
        setimgdata((old) => ({ ...old, b64: imgb64 }));
        console.log(imgb64);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSave() {
    const r = await UploadFile(supabase, imgdata.file, "bigbag", true);

    console.log("Res => ", r);
  }

  return (
    <div className=" container  ">
      <div>
        <div>Bon</div>
        <input
          type="file"
          className={CLASS_INPUT_TEXT}
          onChange={handleFileChange}
        />
        <div className=" w-40 h-auto bg-slate-600 rounded-md overflow-hidden border-slate-700    ">
          <img src={imgdata.b64} />
        </div>
      </div>
      <div>
        <div>Plaque</div>
        <div>
          <input className={CLASS_INPUT_TEXT} />
        </div>
      </div>
      <div>
        <div>Tonnage</div>
        <div>
          <input className={CLASS_INPUT_TEXT} />
        </div>
      </div>
      <div>
        <div>SACS</div>
        <div>
          <input className={CLASS_INPUT_TEXT} />
        </div>
      </div>
      <div>
        <div>DATE</div>
        <div>
          <input
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            className={CLASS_INPUT_TEXT}
          />
        </div>
      </div>
      <div>
        <div>TIME</div>
        <div>
          <input
            defaultValue={new Date().toISOString().split("T")[1].split(".")[0]}
            type="time"
            className={CLASS_INPUT_TEXT}
          />
        </div>
      </div>
      <div>
        <button onClick={(e) => onSave()} className={CLASS_BTN}>
          SAVE
        </button>
        <button className={CLASS_BTN}>CANCEL</button>
      </div>
    </div>
  );
}
