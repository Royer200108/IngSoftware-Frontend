import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
//import supabase from "../supabase/client";

interface User {
  id_persona: string;
  dni: string;
  nombres: string;
  apellidos: string;
  descriptor_facial: number[];
  fotografia: string;
  motivos_visita: string;
  guardia_uuid: string;
  descriptor?: Float32Array;
}

interface FaceRecognitionSystemProps {
  onUserIdentified: (user: User) => void;
}

const FaceRecognition: React.FC<FaceRecognitionSystemProps> = ({
  onUserIdentified,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [shouldDetect, setShouldDetect] = useState<boolean>(true);

  async function obtenerPersonas() {
    try {
      const responsePersonas = await fetch(
        "http://localhost:3000/persona/obtener",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      //console.log("Estado de la respuesta:", responsePersonas.status); // Imprime el código de estado HTTP
      //console.log("Headers de la respuesta:", responsePersonas.headers);

      if (!responsePersonas.ok) {
        const errorText = await responsePersonas.text(); // Captura el mensaje de error del servidor
        console.error(
          "Error al obtener las personas:",
          responsePersonas.status,
          errorText
        );
        return;
      }

      const data = await responsePersonas.json();
      //console.log("Datos recibidos:", data);
      return data;
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  }

  useEffect(() => {
    const initialize = async () => {
      const data = await obtenerPersonas();
      //console.log("La data obtenida es: ", data);
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        ]);

        setUsers(
          data.map((user: User) => ({
            ...user,
            descriptor: new Float32Array(user.descriptor_facial),
          }))
        );
        startWebcam();
      } catch (error) {
        console.error("Error inicializando:", error);
      } finally {
        setLoading(false);
      }
    };

    initialize();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startWebcam = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((err) => console.error("Error al acceder a la cámara:", err));
  };

  const compareWithDatabase = async (
    detectedDescriptor: Float32Array
  ): Promise<User | null> => {
    if (users.length === 0) return null;

    const labeledDescriptors = users.map(
      (user) =>
        new faceapi.LabeledFaceDescriptors(user.nombres, [
          user.descriptor as Float32Array,
        ])
    );
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
    const bestMatch = faceMatcher.findBestMatch(detectedDescriptor);

    if (bestMatch.label !== "unknown" && bestMatch.distance < 0.5) {
      return users.find((user) => user.nombres === bestMatch.label) || null;
    }
    return null;
  };

  useEffect(() => {
    if (loading || !videoRef.current || !shouldDetect) return;

    const detectFaces = async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current as HTMLVideoElement)
        .withFaceLandmarks()
        .withFaceDescriptors();
      if (detections.length > 0) {
        const detectedDescriptor = detections[0].descriptor;
        const user = await compareWithDatabase(detectedDescriptor);

        if (user && (!currentUser || user.dni !== currentUser.dni)) {
          setCurrentUser(user);
          setShouldDetect(false);
          onUserIdentified(user); // Enviar datos al componente padre
        }
      }
    };

    const intervalId = setInterval(detectFaces, 1000);
    return () => clearInterval(intervalId);
  }, [loading, users, currentUser, shouldDetect, onUserIdentified]);

  return (
    <div className="flex flex-col items-center gap-y-5">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="rounded-2xl w-3/5"
      />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      {currentUser && <p>Bienvenido, {currentUser.nombres}</p>}
    </div>
  );
};

export default FaceRecognition;
