import React, { useState } from "react";

const AudioRecorderPlayer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);

  let mediaRecorder;
  let audioChunks = [];

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.onstop = handleStop;

        setIsRecording(true);
        audioChunks = [];
        mediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };

  const handleStop = () => {
    const blob = new Blob(audioChunks, { type: "audio/wav" });
    setAudioBlob(blob);
    setAudioURL(URL.createObjectURL(blob));
  };

  return (
    <div>
      <h2>Audio Recorder and Player</h2>

      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>

      {audioBlob && (
        <div>
          <h3>Audio Player</h3>
          <audio controls>
            <source src={audioURL} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorderPlayer;
