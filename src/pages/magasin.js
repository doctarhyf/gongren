import React, { useState, useRef, useEffect } from "react";
import { CLASS_BTN } from "../helpers/flow";
import RoulementEquipes from "../comps/RoulementEquipes";

let chunks = [];
let stream;
let mediaRecorder;
let blob;

export default function Magasin() {
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
      {Object.entries(errors).length > 0 && (
        <div className="text-white bg-red-500 p-1 rounded-md text-xs">
          {Object.entries(errors).map((e, i) => (
            <div>
              {i + 1}. code: {e.toString()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
