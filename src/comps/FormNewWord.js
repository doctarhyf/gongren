import React, { useEffect, useRef, useState } from "react";
import {
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  pinyinVowelsWithTones,
} from "../helpers/flow";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import ImageUpload from "../comps/ImageUpload";
import Loading from "../comps/Loading";
import PYKBD from "./PYKBD";

const AUDIO_TYPE = {
  PY: "Pinyin",
  LAT: "Latin",
};

function AudioRecPlay() {
  let chunks = [];
  let stream;
  let mediaRecorder;
  let blob;

  const [errors, seterrors] = useState({});
  const [recording, setrecording] = useState(false);
  const audio = useRef();

  async function startRecording() {
    seterrors([]);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia supported! ");

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        console.log("Stream ok : ", stream);

        mediaRecorder = new MediaRecorder(stream);

        console.log("mediaRecorder: ", mediaRecorder);

        setupMediRecorderListenenrs();

        console.log("starting rec ...");
        setrecording(true);
        console.log(chunks);
        mediaRecorder.start();
      } catch (e) {
        seterrors({ ...errors, [e.code]: e });
        console.table(e);
      }
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  }

  function stopRecording() {
    console.log("stopping rec ...");
    setrecording(false);
    console.log(chunks);
    mediaRecorder.stop();
  }

  function setupMediRecorderListenenrs() {
    console.log("setupMediRecorderListenenrs", mediaRecorder);
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = (e) => {
      blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.current.src = audioURL;

      console.log("recorder stopped : ", audioURL, "\nBlob :", blob);
    };
  }

  return (
    <div>
      <div>Media Rec Play</div>
      <div>
        <button
          onClick={startRecording}
          className={CLASS_BTN}
          disabled={recording}
        >
          Start Rec
        </button>
        <button
          onClick={stopRecording}
          className={CLASS_BTN}
          disabled={!recording}
        >
          Stop Rec
        </button>
        <audio ref={audio} controls />
      </div>
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
  const [audioType, setAudioType] = useState();

  useEffect(() => {
    if (upd) {
      setword({ ...upd });
    }
  }, []);

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
          console.log(s);
          setLoading(false);
          onWordUpdateSuccess(s);
        },
        (e) => {
          console.log(e);
          setLoading(false);
          onWordUpdateError(e);
        }
      );
    } else {
      const res = await SB.InsertItem(TABLES_NAMES.DICO, word);

      if (res === null) {
        onWordSaved(res);
        setLoading(false);
      }
    }

    setLoading(false);
  }

  function onImageUploadSuccsess(res, new_file_name) {
    console.log("onImageUploadSuccsess", res);

    setword((old) => ({ ...old, pics: ["dico/" + new_file_name] }));
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
          onBlur={(e) => {
            setpyfocused(false);
          }}
        />
        <input
          className={CLASS_INPUT_TEXT}
          name="py"
          onFocus={(e) => {
            setpyfocused(true);
            setAudioType(AUDIO_TYPE.PY);
          }}
          type="text"
          value={word.py || ""}
          onChange={onChange}
          placeholder="Pinyin"
        />
        <AudioRecPlay />
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
          onBlur={(e) => setpyfocused(false)}
          onFocus={(e) => {
            setpyfocused(false);
            setAudioType(AUDIO_TYPE.LAT);
          }}
        />
        <input
          className={CLASS_INPUT_TEXT}
          name="tags"
          value={word.tags || ""}
          onChange={onChange}
          type="text"
          placeholder="tags"
          onBlur={(e) => setpyfocused(false)}
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
