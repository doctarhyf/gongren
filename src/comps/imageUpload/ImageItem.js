import { useState } from "react";
import { CLASS_INPUT_TEXT } from "../../helpers/flow";

export function ImageItem({ title, idx, onImageDataSet }) {
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
        onImageDataSet(idx, imgdata);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div>Photo {title || idx}</div>
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
