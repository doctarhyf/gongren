import React, { useState, useRef, useEffect } from "react";
import { CLASS_BTN } from "../helpers/flow";
import FrStereo from "../comps/FrStereo";

function AudioRecorder({ onRecordStop, tag }) {
  const [stream, setstream] = useState(null);
  const [error, seterror] = useState([]);
  const [mediaRecord, setMediaRecord] = useState();
  const [recording, setrecording] = useState(false);
  const [chunks, setchunks] = useState([]);

  const audio = useRef();

  useEffect(() => {
    init();
  }, []);

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
        //chunks.push(e.data);
        setchunks([...chunks, e.data]);
      };

      mediaRecord.onstop = (e) => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });

        //chunks = [];
        setchunks([]);
        const audioURL = window.URL.createObjectURL(blob);
        audio.current.src = audioURL;

        console.log("recorder stopped : ", audioURL);
        onRecordStop({ audioURL: audioURL, blob: blob, tag: tag });
      };
    }
  }, [mediaRecord]);

  async function init() {
    console.log("Initializing ... audio tag: ", tag);

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

  function startRecording() {
    console.log("starting rec ...");
    setrecording(true);
    console.log(chunks);
    mediaRecord.start();
  }

  function stopRecording() {
    console.log("stopping rec ...");
    setrecording(false);
    console.log(chunks);
    mediaRecord.stop();
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
      <div>{}</div>
    </div>
  );
}

export default function Magasin() {
  function onRecordStop(audioURL, blob, tag) {
    console.log("Audio tag: ", tag);
    console.log("audioUrl : ", audioURL);
    console.log("blob: ", blob);
  }

  return (
    <div>
      <div>Magasin</div>
      <div>
        {/* <AudioRecorder key={1} onRecordStop={onRecordStop} tag={`audio_${1}`} /> */}
        <FrStereo />
      </div>
    </div>
  );
}
