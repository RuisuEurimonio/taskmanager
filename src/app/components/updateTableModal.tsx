import React from 'react';
import UpdateTableroForm from './updateTableForm';

interface UpdateTableroModalProps {
  tablero: any; // Cambia este tipo según la estructura real de tu tablero
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void; // Cambia este tipo según la estructura real de tu tablero
}

const UpdateTableroModal: React.FC<UpdateTableroModalProps> = ({ tablero, isOpen, onClose, onUpdate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <button onClick={onClose} className="absolute top-2 right-2 text-white">
          &times;
        </button>
        <h2 className="text-xl text-gray-100 mb-4">Actualizar Tablero</h2>
        <UpdateTableroForm tablero={tablero} onUpdate={onUpdate} />
      </div>
    </div>
  );
};

export default UpdateTableroModal;
