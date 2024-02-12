import React, { useEffect, useReducer, useRef, useState } from "react";
import { CLASS_BTN, CLASS_INPUT_TEXT, CLASS_TD } from "../helpers/flow";
import Excelexport from "../comps/Excelexport";
import { TABLES_NAMES, supabase } from "../helpers/sb.config";
import Loading from "../comps/Loading";
import { _ } from "../helpers/func";
import * as SB from "../helpers/sb";
import FormNewWord from "../comps/FormNewWord";
import ItemNotSelected from "../comps/ItemNotSelected";

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

const SECTIONS = {
  NEW_WORD: { id: 0, title: "Add New Word" },
  WORDS_LIST: { id: 0, title: "Add New Word" },
};

function WordsList({ onSelectWord }) {
  const [words, setwords] = useState([]);
  const [wordsf, setwordsf] = useState([]);
  const [loading, setloading] = useState(false);
  const [q, setq] = useState("");

  useEffect(() => {
    loadWords();
  }, []);

  async function loadWords() {
    setloading(true);
    const res = await SB.LoadAllItems(TABLES_NAMES.DICO);

    setwords(res);
    setwordsf([...res]);
    setloading(false);
  }

  function onSearch(e) {
    const v = e.target.value && e.target.value.toLowerCase();
    setq(v);

    if (v.trim() === "") {
      setwordsf([...words]);
      return;
    }

    const f = words.filter((w, i) => {
      return (
        w.zh.toLowerCase().includes(v) ||
        w.py.toLowerCase().includes(v) ||
        w.lat.toLowerCase().includes(v)
      );
    });

    setwordsf(f);
  }

  return (
    <div>
      <Loading isLoading={loading} />
      <input
        type="search"
        value={q}
        onChange={onSearch}
        className={CLASS_INPUT_TEXT}
      />
      <ul>
        {wordsf.map((w, i) => (
          <li>
            <button onClick={(e) => onSelectWord(w)} className={CLASS_BTN}>
              {w.zh} - <span>{w.lat}</span>
            </button>
          </li>
        ))}

        {wordsf.length === 0 && <div>No words!</div>}
      </ul>
    </div>
  );
}

function WordCard({ word, onUpdateWord, onDeleteWord }) {
  const [publicUrl, setPublicUrl] = useState("");

  if (word === undefined) {
    return <div>-</div>;
  }

  const words_data = Object.entries(word);

  async function getPublicUrl(filePath) {
    filePath = filePath.replace("dico/", "");
    console.log("Getting public url of : ", filePath);
    try {
      const { data, error } = await supabase.storage
        .from("dico") // Replace 'your-bucket-name' with your actual bucket name
        .createSignedUrl(filePath, 60); // 60 seconds validity, adjust as needed

      if (error) {
        console.error("Error getting public URL:", error);
      } else {
        console.log("Public URL:", data.signedURL);
        console.log(data);
        setPublicUrl(data.signedUrl);
      }
    } catch (e) {
      console.error("An unexpected error occurred:", e);
    }
  }

  getPublicUrl(word.pics[0]);

  return (
    <div className=" bg-neutral-200 border-neutral-300 mt-2 border shadow-md rounded-md p-2 ">
      <div className="text-sky-500 text-lg">{word.zh}</div>
      <div>
        {words_data.map(
          (it, i) =>
            !["pics", "id", "created_at", "tags"].includes(it[0]) && (
              <div>
                <span className="text-sky-500">{it[0]}:</span> - {it[1]}
              </div>
            )
        )}

        <div className="flex gap-2">
          <span className="text-sky-500">tags:</span>{" "}
          {word.tags
            .split(";")
            .map(
              (t, i) =>
                i < word.tags.split(";").length - 1 && (
                  <span className="text-xs cursor-pointer px-2 text-white p-1 rounded-full bg-sky-400 hover:bg-sky-500 ">
                    {t}
                  </span>
                )
            )}
        </div>
        <div>
          <div>
            <span className="text-sky-500">Pictures:</span>
          </div>{" "}
          <div className="w-[180pt] h-[180pt] object-contain object-center overflow-hidden">
            <a href={publicUrl} target="_blank">
              {" "}
              <img src={publicUrl} />
            </a>
          </div>
        </div>
      </div>
      <button className={CLASS_BTN} onClick={(e) => onUpdateWord(word)}>
        UPDATE
      </button>
      <button className={CLASS_BTN} onClick={(e) => onDeleteWord(word)}>
        DELETE
      </button>
    </div>
  );
}

export default function Dico() {
  const [section, setsection] = useState(SECTIONS.NEW_WORD);
  const [showFormNewWord, setShowFomrNewWord] = useState(false);
  const [selectedWord, setSelectedWord] = useState();
  const [upd, setupd] = useState();
  const [rdk, setrdk] = useState(Math.random());

  function onSelectWord(word) {
    console.log(word);
    setSelectedWord(word);
    setShowFomrNewWord(false);
    setupd(undefined);
  }

  function onUpdateWord(word) {
    setupd(word);
    setShowFomrNewWord(true);
  }

  function init() {
    setrdk(Math.random());
    setSelectedWord(undefined);
    setShowFomrNewWord(false);
  }

  async function onDeleteWord(word) {
    deleteFile(word.pics[0], (s) => {
      if (window.confirm('Delete "' + word.zh + '"')) {
        delWordRecd(word);
      }

      console.log("word file : ", word.pics, " deleted!");
    });
  }

  async function delWordRecd(word) {
    const res = await SB.DeleteItem(TABLES_NAMES.DICO, word);
    console.log("del res ", res);
    if (res === null) {
      alert("Word deleted");
      init();
    }
  }

  async function deleteFile(filePath, onFileDeleteSuccess) {
    try {
      const { data, error } = await supabase.storage
        .from("dico") // Replace 'your-bucket-name' with your actual bucket name
        .remove([filePath]);

      if (error) {
        console.error("Error deleting file:", error);
      } else {
        console.log("File deleted successfully:", data);
        onFileDeleteSuccess(data);
      }
    } catch (e) {
      console.error("An unexpected error occurred:", e);
    }
  }

  return (
    <div className="md:flex gap-4 mt-4">
      <div>
        <button onClick={(e) => setShowFomrNewWord(true)} className={CLASS_BTN}>
          ADD NEW WORD
        </button>
        <button
          onClick={(e) => {
            setShowFomrNewWord(true);
            init();
          }}
          className={CLASS_BTN}
        >
          RELOAD
        </button>
        <WordsList key={rdk} onSelectWord={onSelectWord} />
      </div>
      {showFormNewWord && (
        <FormNewWord
          onWordUpdateError={(e) => {
            alert("Word update error!\n" + JSON.stringify(e));
            setShowFomrNewWord(false);
            init();
          }}
          onWordUpdateSuccess={(e) => {
            alert("Word update success");
            setShowFomrNewWord(false);
            init();
          }}
          onWordSaved={(e) => {
            alert("Word saved success!");
            setShowFomrNewWord(false);
            init();
          }}
          onCancel={(e) => {
            setShowFomrNewWord(false);
            setupd(undefined);
          }}
          upd={upd}
        />
      )}
      {!showFormNewWord && (
        <WordCard
          word={selectedWord}
          onUpdateWord={onUpdateWord}
          onDeleteWord={onDeleteWord}
        />
      )}
      <ItemNotSelected show={selectedWord} message={"Selected a word"} />
    </div>
  );
}
