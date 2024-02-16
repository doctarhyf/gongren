import React, { useState } from "react";
import { CLASS_BTN } from "../helpers/flow";
import AudioPlayer from "react-audio-player";

/* // Check if enumerateDevices is supported by the browser
if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
  // Use enumerateDevices to get a list of media devices
  navigator.mediaDevices
    .enumerateDevices()
    .then((deviceInfos) => {
      // Loop through the list of deviceInfos
      deviceInfos.forEach((deviceInfo) => {
        console.log("Device ID:", deviceInfo.deviceId);
        console.log("Kind:", deviceInfo.kind);
        console.log("Label:", deviceInfo.label);
        console.log("------------------------");
      });
    })
    .catch((error) => {
      console.error("Error enumerating devices:", error);
    });
} else {
  console.error("enumerateDevices is not supported in this browser");
}
 */

console.log(navigator);

const MicrophoneRecorder = ({ onAudioRecorded }) => {
  const [audioStream, setAudioStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      setRecording(true);
      console.log("recording ...");
    } catch (error) {
      console.error("Error accessing microphone:", error.message);
      alert("Error accessing microphone:", error.message);
    }
  };

  const stopRecording = () => {
    if (audioStream) {
      const tracks = audioStream.getTracks();
      tracks.forEach((track) => track.stop());
      setAudioStream(null);
      setRecording(false);
      console.log(audioStream);
    }
  };

  const handleAudioRecorded = (blob) => {
    setRecordedAudioBlob(blob);
    onAudioRecorded(blob);
  };

  return (
    <div>
      <button
        className={CLASS_BTN}
        onClick={startRecording}
        disabled={recording}
      >
        Start Recording
      </button>
      <button
        className={CLASS_BTN}
        onClick={stopRecording}
        disabled={!recording}
      >
        Stop Recording
      </button>

      {recordedAudioBlob && (
        <div>
          <p>Recorded Audio:</p>
          <AudioPlayer src={URL.createObjectURL(recordedAudioBlob)} controls />
        </div>
      )}
    </div>
  );
};

export default function Magasin() {
  return (
    <div>
      <div>Magasin cool</div>
      <MicrophoneRecorder />
    </div>
  );
}
