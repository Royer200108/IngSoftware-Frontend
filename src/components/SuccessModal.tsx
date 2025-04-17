import { useNavigate } from "react-router-dom";

interface SuccessModalProps {
  setShowModal: (value: boolean) => void;
}

function SuccessModal({ setShowModal }: SuccessModalProps) {
  const navigate = useNavigate();

  function handleClose() {
    setShowModal(false);
    navigate("/");
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white rounded-sm shadow-lg p-6 opacity-100 text-center">
        <h2 className="text-xl font-semibold mb-4">¡Registro exitoso!</h2>
        <p>La entrada ha sido registrada correctamente.</p>
        <button
          className="mt-4 bg-[#003B74] text-white px-4 py-2 rounded-sm hover:bg-[#003274] cursor-pointer"
          onClick={handleClose}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;
