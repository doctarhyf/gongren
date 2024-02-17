import React, { useState, useRef } from "react";

const AudioRecorderPlayer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const audioRef = useRef(null);

  let mediaRecorder;
  let audioChunks = [];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = handleStop;

      setIsRecording(true);
      audioChunks = [];
      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    console.log(mediaRecorder);

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
    audioRef.current.src = URL.createObjectURL(blob);
    console.log(blob);
  };

  return (
    <div>
      <h2>Audio Recorder and Player</h2>

      <button onClick={startRecording}>
        {" "}
        {/*  disabled={isRecording}> */}
        Start Recording
      </button>
      <button onClick={stopRecording}>
        {" "}
        {/* disabled={!isRecording}> */}
        Stop Recording
      </button>

      {audioBlob && (
        <div>
          <h3>Audio Player</h3>
          <audio ref={audioRef} controls>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorderPlayer;
