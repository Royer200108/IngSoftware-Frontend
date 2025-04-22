import Footer from "../components/Footer";
import Header from "../components/Header";
import CameraCapture from "../components/CameraCapture";
import FaceDescriptorExtractor from "../components/FaceDescriptorExtractor";
//import supabase from "../client";

import Arrow from "../assets/blue_arrow.png";

import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function SignUp() {
  const [formData, setFormData] = useState({
    identidad: "",
    nombre: "",
    apellidos: "",
    rol: "",
    centros: "",
    areas: "",
    email: "",
    password: "",
    descriptor_facial: [] as number[],
    foto: "",
  });
  const [emailError, setEmailError] = useState("");
  const [roles, setRoles] = useState<{ id_rol: number; nombre_rol: string }[]>(
    []
  );
  const [centros, setCentros] = useState<
    { id_centro_regional: number; centro_regional: string }[]
  >([]);
  const [areas, setAreas] = useState<
    { id_area: number; nombre_area: string; ubicacion: string }[]
  >([]);

  const [capturedPhoto, setCapturedPhoto] = useState<{
    data: string;
    fileName: string;
  } | null>(null);

  const navigate = useNavigate();

  // Función para formatear la identidad con el patrón xxxx-xxxx-xxxxx
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

  const handlePhotoCapture = (photoData: string) => {
    //console.log("Foto recibida del hijo:", photoData);

    // Generar nombre de archivo basado en los datos del formulario
    const generateFileName = () => {
      const cleanId = formData.identidad.replace(/-/g, "");
      const firstName = formData.nombre.split(" ")[0] || "visitante";
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

  function validateEmail(email: string) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "identidad" ? formatIdentity(value) : value,
    }));

    if (name === "email") {
      setEmailError(validateEmail(value) ? "" : "Correo electrónico no válido");
    }

    //console.log("FORMATEADO:", formData);
  }

  function handleRoute(url: string) {
    //sessionStorage.removeItem("token");
    navigate(url);
  }

  async function obtenerRoles() {
    try {
      const responseRoles = await fetch(`${API_BASE_URL}/auth/roles`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!responseRoles.ok) {
        const errorText = await responseRoles.text(); // Captura el mensaje de error del servidor
        console.error(
          "Error al obtener los roles:",
          responseRoles.status,
          errorText
        );
        return;
      }

      const data = await responseRoles.json();
      //console.log("Los roles recibidos:", data);
      return data;
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  }

  async function obtenerCentros() {
    try {
      const responseRoles = await fetch(`${API_BASE_URL}/auth/centros`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!responseRoles.ok) {
        const errorText = await responseRoles.text(); // Captura el mensaje de error del servidor
        console.error(
          "Error al obtener los centros:",
          responseRoles.status,
          errorText
        );
        return;
      }

      const data = await responseRoles.json();
      //console.log("Los centros recibidos:", data);
      return data;
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  }

  async function obtenerAreas(nombre_centro: string) {
    try {
      const responseRoles = await fetch(`${API_BASE_URL}/auth/areas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_centro }),
      });

      if (!responseRoles.ok) {
        const errorText = await responseRoles.text(); // Captura el mensaje de error del servidor
        console.error(
          "Error al obtener los centros:",
          responseRoles.status,
          errorText
        );
        return;
      }

      const data = await responseRoles.json();
      //console.log("Las areas recibidos:", data);
      setAreas(data);
      return data;
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  }

  useEffect(() => {
    const initialize = async () => {
      const roles = await obtenerRoles();
      const centros = await obtenerCentros();

      if (roles && centros) {
        setRoles(roles);
        setCentros(centros);
      }
    };

    initialize();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setFormData;
    //console.log("La data enviada es: ", formData);
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

      // Agregar los demás datos dael formulario
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "foto") {
          formDataImage.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : value
          );
        }
      });

      const photoResponse = await fetch(`${API_BASE_URL}/image/upload`, {
        method: "POST",
        body: formDataImage,
      });

      const finalPhotoResponse = await photoResponse.json();
      //console.log("URL de la imagen:", finalPhotoResponse.imageUrl);

      formData.foto = finalPhotoResponse.imageUrl;
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error en el registro");
      }

      //console.log("Usuario registrado exitosamente");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error de autenticación:", error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow p-4 content-center items-center w-3/5 mx-auto">
        <p className="pb-3 text-2xl">Seleccione una opción</p>
        <div className="rounded-sm h-1 bg-gray-400"></div>
        <div className=" flex flex-col gap-y-7 items-center pt-10">
          <div
            className="flex flex-row items-center gap-x-10 w-3/3 pt-5 cursor-pointer "
            onClick={() => handleRoute("/login")}
          >
            <img src={Arrow} alt="" className="rotate-180" />
            <div className="w-100 text-2xl hover:text-blue-700 bg-blue-300 pl-2 pr-2 rounded-md">
              Atrás
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-7 items-center pt-5 mb-10">
          {/**Aqui iba el formulario */}
          <div className="flex flex-col gap-y-7 items-center pt-5 mb-10">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col  w-3/3 pt-5 items-center"
            >
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <label className="w-1/6">Identidad:</label>
                <input
                  name="identidad"
                  type="text"
                  placeholder="0000-0000-00000"
                  value={formData.identidad}
                  maxLength={15}
                  className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <label className="w-1/6">Nombres</label>
                <input
                  name="nombre"
                  type="text"
                  placeholder="Primer y segundo nombre"
                  className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <label className="w-1/6">Apellidos</label>
                <input
                  name="apellidos"
                  type="text"
                  placeholder="Primer y segundo apellido"
                  className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <label className="w-1/6">Rol:</label>
                <select
                  name="rol"
                  className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                  onChange={handleChange}
                >
                  <option value=""></option>
                  {roles.map((rol) => (
                    <option key={rol.id_rol}>{rol.nombre_rol}</option> // Ajusta según la estructura real del objeto
                  ))}
                </select>
              </div>
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <label className="w-1/6">Centro Regional:</label>
                <select
                  name="centros"
                  className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                  onChange={(event) => {
                    handleChange(event);
                    if (event.target.name === "centros") {
                      obtenerAreas(event.target.value);
                    }
                  }}
                >
                  <option value=""></option>
                  {centros.map((centro) => (
                    <option key={centro.id_centro_regional}>
                      {centro.centro_regional}
                    </option> // Ajusta según la estructura real del objeto
                  ))}
                </select>
              </div>
              {formData.rol === "Guardia" ? (
                <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                  <label className="w-1/6">Area:</label>
                  <select
                    name="areas"
                    className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                    onChange={handleChange}
                  >
                    <option value=""></option>
                    {areas.map((area) => (
                      <option key={area.id_area}>{area.nombre_area}</option> // Ajusta según la estructura real del objeto
                    ))}
                  </select>
                </div>
              ) : (
                ""
              )}
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <label className="w-1/6">Correo Electrónico:</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                  onChange={handleChange}
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
              <div className="flex flex-row gap-x-10 w-3/3 pt-5">
                <label className="w-1/6">Contraseña:</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-5/6 bg-gray-200 rounded-sm border-gray-300 border-2 pl-2 pr-2"
                  onChange={handleChange}
                />
              </div>
              <CameraCapture onCapture={handlePhotoCapture} />

              {capturedPhoto && (
                <FaceDescriptorExtractor
                  photoData={capturedPhoto.data}
                  onDescriptorReady={(descriptor) => {
                    if (descriptor) {
                      setFormData((prev) => ({
                        ...prev,
                        descriptor_facial: descriptor,
                      }));
                    }
                  }}
                />
              )}
              <button
                className=" rounded-sm bg-[#003B74] p-1 pl-5 pr-5 hover:bg-[#003274] text-white mt-10 cursor-pointer"
                disabled={!!emailError}
              >
                Crear usuario
              </button>
            </form>
          </div>
        </div>
        <div className="rounded-sm h-1 bg-gray-400"></div>
      </main>

      <Footer />
    </div>
  );
}

export default SignUp;
