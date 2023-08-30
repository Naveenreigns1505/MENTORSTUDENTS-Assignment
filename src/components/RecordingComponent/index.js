import React, { useState, useRef } from "react";
import styles from "./styles.module.css";
import Webcam from "react-webcam"

const videoConstraints = {
  width: 450,
  facingMode: 'environment'
}

const RecordingComponent = () => {
  const [recording, setRecording] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const webcamRef = useRef(null);
  const [url, setUrl] = useState(null)
  const recordedChunksRef = useRef([]);



  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const recorder = new MediaRecorder(stream);
      setMediaStream(stream);
      setMediaRecorder(recorder);
      setRecordedChunks([]);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.start();
      setRecording(true);
      window.alert("Recording started. Click 'Stop Recording' to finish.");
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const capturePhoto = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setUrl(imageSrc)
  }, [webcamRef])

  const onUserMedia = (e) => {
    console.log(e)
  }


  const stopRecording = () => {
    if (mediaRecorder && mediaStream) {
      mediaRecorder.stop();
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
      setMediaRecorder(null);
      setRecording(false);

      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(blob);
      localStorage.setItem("recordedVideoUrl", videoUrl);
    }
  };

  const handleAudioPermission = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setAudioPermission(true);
      window.alert("Audio permission granted. You can now start recording.");
    } catch (error) {
      console.error("Error getting audio permission:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location = "/login"
  };

  return (
    <>
      <div className="cont">
        <div className="container"></div>
        <div className={styles.main_container}>
          <nav className={styles.navbar}>
            <button className={styles.white_btn} onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </div>
        <div>
          <Webcam
            ref={webcamRef}
            audio={true}
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
            onUserMedia={onUserMedia}
            mirrored={true}
            className="webcam_form_container"
          />
          <div className="con">
            {!recording ? (
              <button onClick={startRecording} className={styles.white_btnn}>Start Recording</button>
            ) : (
              <button onClick={stopRecording} className={styles.white_btnn}>Stop Recording</button>
            )}
            {!audioPermission && (
              <button onClick={handleAudioPermission} className={styles.white_btnn}>Grant Audio Permission</button>
            )}
            <button onClick={capturePhoto} className={styles.white_btnn}>Capture</button>
            <button onClick={() => setUrl(null)} className={styles.white_btnn}>Refresh</button>
          </div>
          {url && (
            <div>
              <img src={url} alt="screenshot" className="image" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecordingComponent;
