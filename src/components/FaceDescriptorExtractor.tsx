import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";

interface FaceDetectionWithDescriptor extends faceapi.FaceDetection {
  descriptor: Float32Array;
}

const FaceDescriptorExtractor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false);
  const [descriptor, setDescriptor] = useState<number[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Cargar modelos al montar el componente
  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        ]);
        setModelsLoaded(true);
        console.log("Modelos cargados correctamente");
      } catch (error) {
        console.error("Error cargando modelos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  // Procesar imagen cuando cambia
  useEffect(() => {
    if (!image || !modelsLoaded || !imageRef.current) return;

    const processImage = async () => {
      try {
        const imgElement = imageRef.current;
        if (!imgElement) return;

        // Extraer descriptor facial
        const detections = (await faceapi
          .detectSingleFace(imgElement)
          .withFaceLandmarks()
          .withFaceDescriptor()) as FaceDetectionWithDescriptor | undefined;

        if (detections) {
          const newDescriptor = Array.from(detections.descriptor);
          console.log("Descriptor facial extraído:", newDescriptor);
          setDescriptor(newDescriptor);
        } else {
          console.warn("No se detectó ningún rostro en la imagen");
          setDescriptor(null);
        }
      } catch (error) {
        console.error("Error procesando la imagen:", error);
        setDescriptor(null);
      }
    };

    processImage();
  }, [image, modelsLoaded]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setDescriptor(null);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Extractor de Descriptores Faciales</h2>

      <div style={{ margin: "20px 0" }}>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageUpload}
          disabled={loading || !modelsLoaded}
        />
      </div>

      {loading && <p>Cargando modelos de reconocimiento facial...</p>}
      {!loading && !modelsLoaded && (
        <p>Error cargando los modelos. Recarga la página.</p>
      )}

      {image && (
        <div style={{ marginTop: "20px" }}>
          <h4>Imagen cargada:</h4>
          <img
            ref={imageRef}
            src={image}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: "400px" }}
            onLoad={() =>
              imageRef.current && console.log("Imagen cargada en el DOM")
            }
          />
        </div>
      )}

      {descriptor && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f0f0f0",
            borderRadius: "5px",
          }}
        >
          <h4>Descriptor Facial:</h4>
          <pre
            style={{
              wordWrap: "break-word",
              fontFamily: "monospace",
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "4px",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(descriptor, null, 2)}
          </pre>
          <p>Longitud: {descriptor.length} valores (normalmente 128)</p>
        </div>
      )}

      {image && !descriptor && (
        <p style={{ color: "#666", marginTop: "20px" }}>
          Procesando imagen... (revisa la consola para más detalles)
        </p>
      )}
    </div>
  );
};

export default FaceDescriptorExtractor;
