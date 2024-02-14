import React, { useEffect, useState } from "react";
import { CLASS_BTN, CLASS_INPUT_TEXT } from "../helpers/flow";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import ImageUpload from "../comps/ImageUpload";
import Loading from "../comps/Loading";

function PYKBD({ show, onType, onHidePYKBD }) {
  return (
    <div className={` ${show ? "block" : "hidden"} `}>
      <button
        onClick={onHidePYKBD}
        className="text-white bg-red-500 text-xs rounded-full w-6 h-6"
      >
        X
      </button>
      <button className={CLASS_BTN} onClick={(e) => onType("A")}>
        A
      </button>
      <button className={CLASS_BTN} onClick={(e) => onType("B")}>
        B
      </button>
    </div>
  );
}

export default function FormNewWord({
  upd,
  onCancel,
  onWordUpdateSuccess,
  onWordSaved,
  onWordUpdateError,
}) {
  const [word, setword] = useState({
    zh: "",
    py: "",
    lat: "",
    tags: "",
    pics: [],
  });
  const [loading, setLoading] = useState(false);
  const [pyfocused, setpyfocused] = useState(false);

  useEffect(() => {
    if (upd) {
      setword({ ...upd });
    }
  }, []);

  useEffect(() => {
    console.log(word);
  }, [word]);

  function onChange(e) {
    const { name, value } = e.target;
    setword((old) => ({ ...old, [name]: value }));
  }

  async function onSaveNewWord() {
    console.log(word);
    setLoading(true);

    if (upd) {
      const res = await SB.UpdateItem(
        TABLES_NAMES.DICO,
        word,
        (s) => {
          //alert("Word Update Success\n", JSON.stringify(s));
          console.log(s);
          setLoading(false);
          onWordUpdateSuccess(s);
        },
        (e) => {
          //alert("Word Update Error \n", JSON.stringify(e));
          console.log(e);
          setLoading(false);
          onWordUpdateError(e);
        }
      );
    } else {
      const res = await SB.InsertItem(TABLES_NAMES.DICO, word);

      if (res === null) {
        //alert("New word saved!");
        onWordSaved(res);
        setLoading(false);
      }
    }

    setLoading(false);
  }

  function onImageUploadSuccsess(res) {
    console.log("onImageUploadSuccsess", res);

    setword((old) => ({ ...old, pics: [res.fullPath] }));
    console.log(word);
  }

  function onImageUploadError(e) {
    console.log("onImageUploadError", e);
  }

  function onImageUploadStart(file) {
    console.log("onImageUploadStart", file);
  }

  function onTypePy(py) {
    let npy = word.py + py;
    setword((old) => ({ ...old, py: npy }));
  }

  return (
    <div>
      <div>New Word</div>
      <div className="flex flex-col w-min gap-2">
        <input
          className={CLASS_INPUT_TEXT}
          name="zh"
          value={word.zh || ""}
          onChange={onChange}
          type="text"
          placeholder="中文"
        />
        <input
          className={CLASS_INPUT_TEXT}
          name="py"
          onFocus={(e) => setpyfocused(true)}
          // onBlur={}//(e) => //setpyfocused(false)}
          type="text"
          value={word.py || ""}
          onChange={onChange}
          placeholder="Pinyin"
        />

        <PYKBD
          onHidePYKBD={(e) => setpyfocused(false)}
          show={pyfocused}
          onType={onTypePy}
        />

        <input
          className={CLASS_INPUT_TEXT}
          name="lat"
          value={word.lat || ""}
          onChange={onChange}
          type="text"
          placeholder="Definition"
        />
        <input
          className={CLASS_INPUT_TEXT}
          name="tags"
          value={word.tags || ""}
          onChange={onChange}
          type="text"
          placeholder="tags"
        />
        <div className=" font-serif text-xs text-neutral-400 italic ">
          Separate tags with the caracter <span className=" kbd ">";"</span>
        </div>
        <div>PHOTO</div>
        <ImageUpload
          onImageUploadStart={onImageUploadStart}
          onImageUploadSuccsess={onImageUploadSuccsess}
          onImageUploadError={onImageUploadError}
        />
        <div>
          <button className={` ${CLASS_BTN}  `} onClick={onSaveNewWord}>
            SAVE
          </button>
          <button onClick={onCancel} className={CLASS_BTN}>
            CANCEL
          </button>
        </div>

        <Loading isLoading={loading} center />
      </div>
    </div>
  );
}
