import React, { useRef, useState, useEffect } from "react";

interface CameraProps {
  onCapture: (photoData: string) => void;
}

const CameraCapture: React.FC<CameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isPhoto, setIsPhoto] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Iniciar cámara
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsPhoto(false);
        setPhoto(null);
      }
    } catch (err) {
      console.error("Error de cámara:", err);
      alert("No se pudo acceder a la cámara");
    }
  };

  // Iniciar cámara automáticamente al montar
  useEffect(() => {
    startCamera();

    // Limpieza al desmontar
    return () => {
      stopCamera();
    };
  }, []);

  // Detener cámara
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  // Tomar foto y apagar cámara
  const takePhoto = () => {
    if (!videoRef.current || !stream) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const photoData = canvas.toDataURL("image/jpeg");
      setPhoto(photoData);
      setIsPhoto(true);
      onCapture(photoData);
      stopCamera(); // Apagar cámara después de capturar
    }
  };

  // Resetear foto y reactivar cámara
  const resetPhoto = () => {
    setPhoto(null);
    setIsPhoto(false);
    startCamera(); // Volver a encender la cámara
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      {!isPhoto && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "350px",
            maxHeight: "350px",
            backgroundColor: "#000",
            borderRadius: "4px",
          }}
        />
      )}

      {isPhoto && photo && (
        <div>
          <img
            src={photo}
            alt="Captura"
            style={{
              width: "350px",
              maxHeight: "350px",
              border: "2px solid #eee",
              borderRadius: "4px",
            }}
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "10px",
          margin: "15px 0",
          justifyContent: "center",
        }}
      >
        {!isPhoto && (
          <button
            onClick={takePhoto}
            disabled={!stream}
            style={{
              padding: "10px 15px",
              backgroundColor: stream ? "#2196F3" : "#cccccc",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: stream ? "pointer" : "not-allowed",
            }}
          >
            Tomar Foto
          </button>
        )}

        {isPhoto && (
          <button
            onClick={resetPhoto}
            style={{
              padding: "10px 15px",
              backgroundColor: "#FF9800",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Volver a Capturar
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
