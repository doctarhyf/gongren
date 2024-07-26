import { useState } from "react";
import { CLASS_BTN, CLASS_INPUT_TEXT } from "../../helpers/flow";

export default function FormNewBigbagTruck({ onSaveBibag }) {
  const [data, setdata] = useState({ plaque: "", t: "" });
  const [selimg, setselimg] = useState("");
  const [selimgf, setselimgf] = useState();

  const handleFileChange = (event) => {
    setselimg(event.target.value);
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgb64 = reader.result;
        setselimgf(imgb64);
        console.log(imgb64);
      };
      reader.readAsDataURL(file);
    }
  };

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
          <img src={selimgf} />
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
        <button onClick={(e) => onSaveBibag(data)} className={CLASS_BTN}>
          SAVE
        </button>
        <button className={CLASS_BTN}>CANCEL</button>
      </div>
    </div>
  );
}
