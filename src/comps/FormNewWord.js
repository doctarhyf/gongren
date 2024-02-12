import React, { useEffect, useState } from "react";
import { CLASS_BTN, CLASS_INPUT_TEXT } from "../helpers/flow";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import ImageUpload from "../comps/ImageUpload";
import Loading from "../comps/Loading";

export default function FormNewWord({ upd, onCancel }) {
  const [imgUploaded, setImgUploaded] = useState(false);
  const [word, setword] = useState({
    zh: "",
    py: "",
    lat: "",
    tags: "",
    pics: [],
  });
  const [loading, setLoading] = useState(false);

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
          alert("Success\n", JSON.stringify(s));
          console.log(s);
          setLoading(false);
        },
        (e) => {
          alert("Error \n", JSON.stringify(e));
          console.log(e);
          setLoading(false);
        }
      );
    } else {
      const res = await SB.InsertItem(TABLES_NAMES.DICO, word);

      if (res === null) {
        alert("New word saved!");
        setLoading(false);
      }
    }

    setLoading(false);
  }

  function onImageUploadSuccsess(res) {
    console.log("onImageUploadSuccsess", res);
    setImgUploaded(true);
    setword((old) => ({ ...old, pics: [...old.pics, res.fullPath] }));
    console.log(word);
  }

  function onImageUploadError(e) {
    console.log("onImageUploadError", e);
  }

  function onImageUploadStart(file) {
    console.log("onImageUploadStart", file);
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
          type="text"
          value={word.py || ""}
          onChange={onChange}
          placeholder="Pinyin"
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
        <div className={` ${imgUploaded ? "block" : "hidden"} `}>
          <button onClick={onSaveNewWord} className={CLASS_BTN}>
            SAVE
          </button>
        </div>
        <button onClick={onCancel} className={CLASS_BTN}>
          CANCEL
        </button>
        <Loading isLoading={loading} center />
      </div>
    </div>
  );
}
