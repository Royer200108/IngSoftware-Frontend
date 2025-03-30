import { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

interface FaceDescriptorExtractorProps {
  photoData: string | null;
  onDescriptorReady: (descriptor: number[] | null) => void;
}

const FaceDescriptorExtractor = ({
  photoData,
  onDescriptorReady,
}: FaceDescriptorExtractorProps) => {
  const modelsLoaded = useRef(false);
  const processedPhoto = useRef<string | null>(null);

  useEffect(() => {
    const extractDescriptor = async () => {
      // Evitar reprocesamiento de la misma foto
      if (!photoData || photoData === processedPhoto.current) return;

      processedPhoto.current = photoData;

      try {
        // Cargar modelos solo la primera vez
        if (!modelsLoaded.current) {
          await Promise.all([
            faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
            faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
            faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          ]);
          modelsLoaded.current = true;
        }

        // Procesar imagen
        const img = await faceapi.fetchImage(photoData);
        const detection = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();

        onDescriptorReady(detection ? Array.from(detection.descriptor) : null);
        console.log(detection?.descriptor);
      } catch (error) {
        console.error("Error al procesar:", error);
        onDescriptorReady(null);
      }
    };

    extractDescriptor();
  }, [photoData, onDescriptorReady]);

  return null;
};

export default FaceDescriptorExtractor;
