import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  CLASS_TD,
  USER_LEVEL,
} from "../helpers/flow";
import Excelexport from "../comps/Excelexport";
import { TABLES_NAMES, supabase } from "../helpers/sb.config";
import Loading from "../comps/Loading";
import { _ } from "../helpers/func";
import * as SB from "../helpers/sb";
import FormNewWord from "../comps/FormNewWord";
import ItemNotSelected from "../comps/ItemNotSelected";
import WordsList from "../comps/WordsList";
import WordCard from "../comps/WordCard";
import { UserContext } from "../App";
import ButtonPrint from "../comps/ButtonPrint";

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

export default function Dico() {
  const [, , user] = useContext(UserContext);
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
    //let audioDeleted = false;
    //let picDeleted = false;

    if (window.confirm("Delete word? " + word.zh)) {
      const { audios, pics } = word;

      if (pics.length === 0 && audios.length === 0) {
        delWordRecd(word);
        return;
      }

      const audiofname =
        audios[0] && audios[0].split("/")[audios[0].split("/").length - 1];
      deleteFile(audiofname, (s) => {
        console.log("audio file : “", s, "” deleted");
        // audioDeleted = true;
        delWordRecd(word);
      });

      const picfname = pics[0] && pics[0].replace("dico/", "");
      deleteFile(picfname, (s) => {
        console.log("pic file : “", word.pics, "” deleted!");
        //picDeleted = true;
        delWordRecd(word);
      });
    }
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
    console.log(`Deleting file : ${filePath}`);

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

  function onOkay(word) {
    setSelectedWord(undefined);
  }

  function onPrintWords(words) {
    console.log(words);
  }

  return (
    <div className="md:flex gap-4 mt-4">
      {!showFormNewWord && (
        <div className={` ${selectedWord ? "hidden" : "block"} `}>
          {user.user_level > USER_LEVEL.ADMIN}

          {true && (
            <>
              {" "}
              <button
                onClick={(e) => setShowFomrNewWord(true)}
                className={CLASS_BTN}
              >
                ADD NEW WORD
              </button>{" "}
            </>
          )}
          <button
            onClick={(e) => {
              setShowFomrNewWord(true);
              init();
            }}
            className={CLASS_BTN}
          >
            RELOAD
          </button>

          <WordsList
            onPrintWords={onPrintWords}
            key={rdk}
            onSelectWord={onSelectWord}
          />
        </div>
      )}
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
          onOkay={onOkay}
        />
      )}
      {!showFormNewWord && (
        <div className=" hidden md:block ">
          <ItemNotSelected show={selectedWord} message={"Selected a word"} />
        </div>
      )}
    </div>
  );
}
