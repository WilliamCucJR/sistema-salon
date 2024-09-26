import './AppointmentModal.css'; // Aquí pondrás el estilo para el fondo difuminado

const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null; // Si el modal no está abierto, no renderizamos nada

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
};

export default Modal;
