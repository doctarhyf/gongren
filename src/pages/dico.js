import React, { useEffect, useReducer, useRef, useState } from "react";
import { CLASS_BTN, CLASS_INPUT_TEXT, CLASS_TD } from "../helpers/flow";
import Excelexport from "../comps/Excelexport";
import { TABLES_NAMES, supabase } from "../helpers/sb.config";
import Loading from "../comps/Loading";
import { _ } from "../helpers/func";
import * as SB from "../helpers/sb";

function ImageUpload({
  fileName,
  onImageUploadSuccsess,
  onImageUploadError,
  onImageUploadStart,
  bucketName = "dico",
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload!");
      return;
    }

    onImageUploadStart && onImageUploadStart(selectedFile);
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.storage
        .from(bucketName) // Replace with your bucket name
        .upload(fileName || selectedFile.name, selectedFile);

      if (error) {
        onImageUploadError(error);
        throw error;
      }

      console.log("Image uploaded successfully:", data);

      onImageUploadSuccsess(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <Loading isLoading={loading} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        className={` ${CLASS_BTN} text-xs ${loading ? "hidden" : "block"} `}
        onClick={handleUpload}
      >
        Upload Photo
      </button>
    </div>
  );
}

const SBBukcet = () => {
  const [publicUrls, setPublicUrls] = useState([]);

  useEffect(() => {
    const listFilesAndGeneratePublicUrls = async () => {
      try {
        const bucketName = "dico";

        // Fetch the files in the specified bucket
        const { data: files, error } = await supabase.storage
          .from(bucketName)
          .list();

        if (error) {
          console.error("Error fetching files:", error);
          return;
        }

        // Generate public URLs for each file
        const urls = files.map((file) =>
          supabase.storage.from(bucketName).getPublicUrl(file.name)
        );

        // Set the public URLs to state
        console.log(urls);
        setPublicUrls(urls);
      } catch (err) {
        console.error("Error:", err.message);
      }
    };

    // Call the function to list files and generate public URLs
    listFilesAndGeneratePublicUrls();
  }, []); // Run once on component mount

  return (
    <div>
      <h2>Public URLs for Files:</h2>
      <ul>
        {publicUrls.map((url, index) => (
          <li key={index}>
            <a
              href={url.data.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-32 h-32 overflow-clip object-cover ">
                <img src={url.data.publicUrl} className=" object-cover" />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

function FormNewWord({ upd }) {
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
      setword((old) => ({ ...old, zh: "cool upd" }));
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
    const res = await SB.InsertItem(TABLES_NAMES.DICO, word);

    if (res === null) {
      alert("New word saved!");
    }

    setLoading(false);
  }

  function onCancel() {}

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
        <div className=" font-serif text-sm italic ">
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
          <button onClick={onCancel} className={CLASS_BTN}>
            CANCEL
          </button>
        </div>
        <Loading isLoading={loading} center />
      </div>
    </div>
  );
}

const SECTIONS = {
  NEW_WORD: { id: 0, title: "Add New Word" },
  WORDS_LIST: { id: 0, title: "Add New Word" },
};

export default function Dico() {
  const [section, setsection] = useState(SECTIONS.NEW_WORD);
  return (
    <div>
      <FormNewWord />
    </div>
  );
}
