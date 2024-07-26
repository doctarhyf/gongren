import { useEffect, useState } from "react";
import { CLASS_BTN, CLASS_INPUT_TEXT } from "../../helpers/flow";
import ImageUpload from "../ImageUpload";
import { UploadFile } from "../../helpers/FileUpload";
import { supabase } from "../../helpers/sb.config";

function ImageItem({ idx, onImageDataSet }) {
  const [imgdata, setimgdata] = useState({ b64: undefined, file: undefined });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // setimgdata((old) => ({ ...old, file: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgb64 = reader.result;
        const imgdata = { file: file, b64: imgb64 };
        setimgdata(imgdata);
        onImageDataSet(imgdata);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className=" w-full relative md:w-48 h-auto bg-slate-600 rounded-md overflow-hidden border-slate-700    ">
        <img src={imgdata.b64} className=" object-cover w-full  " />
      </div>
      <input
        type="file"
        className={CLASS_INPUT_TEXT}
        onChange={handleFileChange}
      />
    </div>
  );
}

function ImageItemContainer({ count }) {
  const [dataArray, setDataArray] = useState([]);

  function onImageDataSet(data) {
    if (dataArray.length === 0) {
      setDataArray([data]);
    } else {
      const f = dataArray.findIndex((it) => it.name === data.name);
      console.log(f);
    }
  }

  return (
    <div className=" md:flex ">
      {[...Array(3)].map((it, i) => (
        <ImageItem idx={i} onImageDataSet={onImageDataSet} />
      ))}
    </div>
  );
}

export default function FormNewBigbagTruck({ onSaveBibag }) {
  const [data, setdata] = useState({ plaque: "", t: "" });

  const [imguploaded, setimguploaded] = useState(false);

  async function onSave() {
    // const r = await UploadFile(supabase, imgdata.file, "bigbag", true);
    //console.log("Res => ", r);
  }

  return (
    <div className=" container  ">
      <div>
        <div>Bon</div>

        <ImageItemContainer count={3} />
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
