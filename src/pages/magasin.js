import React, { useState, useRef, useEffect } from "react";
import { CLASS_BTN } from "../helpers/flow";

let chunks = [];

export default function Magasin() {
  const [stream, setstream] = useState(null);
  const [error, seterror] = useState([]);
  const [mediaRecord, setMediaRecord] = useState();
  const [recording, setrecording] = useState(false);

  const audio = useRef();

  useEffect(() => {
    console.log("Stream set Okay : \n", stream);
    if (stream) {
      setMediaRecord(new MediaRecorder(stream));
    }
  }, [stream]);

  useEffect(() => {
    if (mediaRecord) {
      console.log("mediaRecord.state : ", mediaRecord.state);
      console.log("chunks :", chunks);
      mediaRecord.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecord.onstop = (e) => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });

        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        audio.current.src = audioURL;

        console.log("recorder stopped : ", audioURL);
      };
    }
  }, [mediaRecord]);

  async function onClick() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia supported! ");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setstream(stream);

        console.log("Stream ok : ", stream);
      } catch (e) {
        seterror([...error, e]);
        console.log("Stream error : ", e);
      }
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  }

  function startRec() {
    console.log("starting rec ...");
    setrecording(true);
    console.log(chunks);
    mediaRecord.start();
  }

  function stopRec() {
    console.log("stopping rec ...");
    setrecording(false);
    console.log(chunks);
    mediaRecord.stop();
  }

  return (
    <div>
      <button onClick={onClick}>INIT</button>
      {mediaRecord && (
        <div>
          <button onClick={startRec} className={CLASS_BTN} disabled={recording}>
            Start Rec
          </button>
          <button onClick={stopRec} className={CLASS_BTN} disabled={!recording}>
            Stop Rec
          </button>
          <audio ref={audio} controls />
        </div>
      )}
    </div>
  );
}
