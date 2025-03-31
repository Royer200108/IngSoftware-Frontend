import Footer from "../components/Footer";
import Header from "../components/Header";
import CameraCapture from "../components/CameraCapture";

//import supabase from "../client";

import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import FaceDescriptorExtractor from "../components/FaceDescriptorExtractor";
//import { useNavigate } from "react-router-dom";

import Arrow from "../assets/blue_arrow.png";

function RegisterVisitor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    foto: "",
    correo: "",
    dni: "",
    descriptor_facial: "",
  });
  const [correoError, setcorreoError] = useState("");
  const [capturedPhoto, setCapturedPhoto] = useState<{
    data: string;
    fileName: string;
  } | null>(null);

  //const navigate = useNavigate();

  // Maneja la foto recibida del componente hijo
  // Maneja la foto recibida del componente hijo y le asigna un nombre
  const handlePhotoCapture = (photoData: string) => {
    console.log("Foto recibida del hijo:", photoData);

    // Generar nombre de archivo basado en los datos del formulario
    const generateFileName = () => {
      const cleanId = formData.dni.replace(/-/g, "");
      const firstName = formData.nombres.split(" ")[0] || "visitante";
      const firstLastName = formData.apellidos.split(" ")[0] || "anonimo";

      // Formato: ID_Nombre_Apellido_timestamp.jpg
      return `${cleanId}_${firstName}_${firstLastName}_${Date.now()}.jpg`.toLowerCase();
    };

    setCapturedPhoto({
      data: photoData,
      fileName: generateFileName(), // Asignamos nombre aquí
    });

    // Actualiza también el campo foto en formData
    setFormData((prev) => ({
      ...prev,
      foto: generateFileName(),
    }));
  };

  // Función para formatear la dni con el patrón xxxx-xxxx-xxxxx
  const formatIdentity = (value: string) => {
    // Eliminar caracteres no numéricos
    value = value.replace(/\D/g, "");

    let formattedValue = "";

    if (value.length > 4) {
      formattedValue += value.substring(0, 4) + "-";
      if (value.length > 8) {
        formattedValue += value.substring(4, 8) + "-";
        formattedValue += value.substring(8, 13);
      } else {
        formattedValue += value.substring(4, 8);
      }
    } else {
      formattedValue = value;
    }

    return formattedValue;
  };

  // Función para formatear el correo con el patron correo@xyz.xyz
  function validatecorreo(correo: string) {
    const correoPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return correoPattern.test(correo);
  }

  // Valida el dni y el correo con lsa funciones definidas antes
  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "dni" ? formatIdentity(value) : value,
    }));

    if (name === "correo") {
      setcorreoError(
        validatecorreo(value) ? "" : "Correo electrónico no válido"
      );
    }

    console.log("FORMATEADO:", formData);
  }

  //Envia la información obtenida
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const base64ToBlob = async (base64: string) => {
        const response = await fetch(base64);
        return await response.blob();
      };

      const formDataImage = new FormData();

      if (capturedPhoto) {
        const blob = await base64ToBlob(capturedPhoto.data);
        formDataImage.append("file", blob, capturedPhoto.fileName);
      }

      // Agregar los demás datos del formulario
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "foto") {
          formDataImage.append(key, value);
        }
      });

      const photoResponse = await fetch("http://localhost:3000/image/upload", {
        method: "POST",
        body: formDataImage,
      });

      const finalPhotoResponse = await photoResponse.json();
      console.log("URL de la imagen:", finalPhotoResponse.imageUrl);

      formData.foto = finalPhotoResponse.imageUrl;

      console.log(formData);
      const formResponse = await fetch(
        "http://localhost:3000/persona/registrar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!photoResponse.ok && !formResponse.ok) {
        throw new Error("Error en el registro");
      }

      console.log("Usuario registrado exitosamente");
    } catch (error) {
      console.error("Error de autenticación:", error);
    }
  }

  function handleRoute(url: string) {
    //sessionStorage.removeItem("token");
    navigate(url);
  }

  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex-grow p-4 content-center justify-center items-center w-3/5 mx-auto h-225">
        <p className="pb-3 text-2xl">Registrar visitante</p>
        <div className="rounded-sm h-1 bg-gray-400"></div>
        <div className=" h-200 flex flex-col items-center sm:max-lg:mb-5">
          {/*El boton de salir */}
          <div
            className="flex flex-row items-center gap-x-10 w-3/3 pt-5 cursor-pointer "
            onClick={() => handleRoute("/authvisitor")}
          >
            <img src={Arrow} alt="" className="rotate-180" />
            <div className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
              Atrás
            </div>
          </div>
          <form
            className="w-4/5 h-40 pt-10 flex flex-col items-center gap-y-3"
            onSubmit={handleSubmit}
          >
            {/* Campo dni con formateo automático */}
            <div className="lg:w-3/5 w-2/3 lg:flex justify-center pl-2 pr-2 bg-white">
              <label className="w-1/3">dni:</label>
              <input
                name="dni"
                type="text"
                placeholder="0000-0000-00000"
                value={formData.dni} // Se mantiene sincronizado con el estado
                maxLength={15} // 13 números + 2 guiones
                className="bg-gray-200 rounded-sm border-gray-300 border-2"
                onChange={handleChange}
              />
            </div>
            <div className="lg:w-3/5 w-2/3 lg:flex justify-center pl-2 pr-2 bg-white">
              <label className="w-1/3">Nombres</label>
              <input
                name="nombres"
                type="text"
                placeholder="Primer y segundo nombre"
                className="bg-gray-200 rounded-sm border-gray-300 border-2"
                onChange={handleChange}
              />
            </div>
            <div className="lg:w-3/5 w-2/3 lg:flex justify-center pl-2 pr-2 bg-white">
              <label className="w-1/3">Apellidos</label>
              <input
                name="apellidos"
                type="text"
                placeholder="Primer y segundo apellido"
                className="bg-gray-200 rounded-sm border-gray-300 border-2"
                onChange={handleChange}
              />
            </div>

            <div className="lg:w-3/5 w-2/3 lg:flex justify-center pl-2 pr-2 bg-white">
              <label className="w-1/3">Correo Electrónico:</label>
              <input
                name="correo"
                type="email"
                placeholder="correo"
                className="bg-gray-200 rounded-sm border-gray-300 border-2"
                onChange={handleChange}
              />
            </div>
            {correoError && (
              <p className="text-red-500 text-sm">{correoError}</p>
            )}
            <CameraCapture onCapture={handlePhotoCapture} />

            {capturedPhoto && (
              <FaceDescriptorExtractor
                photoData={capturedPhoto.data}
                onDescriptorReady={(descriptor) => {
                  if (descriptor) {
                    setFormData((prev) => ({
                      ...prev,
                      descriptor_facial: JSON.stringify(descriptor),
                    }));
                  }
                }}
              />
            )}

            <button
              className={
                formData.descriptor_facial &&
                formData.nombres &&
                formData.apellidos &&
                formData.correo &&
                formData.dni
                  ? `rounded-sm bg-[#003B74] p-1 pl-5 pr-5 hover:bg-[#003274] text-white `
                  : `rounded-sm bg-gray-400 p-1 pl-5 pr-5  text-white`
              }
              disabled={!!correoError || !formData.descriptor_facial}
            >
              Crear usuario
            </button>
          </form>
        </div>
        <div className="rounded-sm h-1 bg-gray-400"></div>
      </main>
      <Footer />
    </div>
  );
}

export default RegisterVisitor;
