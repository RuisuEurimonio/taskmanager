"use client"

import { useState, useEffect } from "react";
import CreateTableroModal from "../components/createTableForm";
import UpdateTableroModal from "../components/updateTableModal";

interface Tablero {
  id: number;
  name: string;
  description: string;
  fechaCreacion: string;
  lista: {
    id: number;
    name: string;
    description: string;
    orden: string;
  };
}

const TableroList = () => {
  const [tableros, setTableros] = useState<Tablero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTablero, setSelectedTablero] = useState<Tablero | null>(null);

  const fetchTableros = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/tablero/all");
      if (response.ok) {
        const data = await response.json();
        setTableros(data);
      } else {
        console.error("Error al obtener los tableros");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  useEffect(() => {
    fetchTableros();
  }, []);

  const handleUpdateTablero = (updatedTablero: Tablero) => {
    setTableros((prevTableros) =>
      prevTableros.map((tablero) =>
        tablero.id === updatedTablero.id ? updatedTablero : tablero
      )
    );
    setIsUpdateModalOpen(false);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="m-auto w-11/12">
      <h1 className="text-2xl font-bold mb-4">Lista de Tableros</h1>
      <button
        onClick={handleOpenModal}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
      >
        Crear nuevo tablero
      </button>
      <table className="w-full border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Descripción</th>
            <th className="px-4 py-2">Fecha de Creación</th>
            <th className="px-4 py-2">Opciones</th>
          </tr>
        </thead>
        <tbody>
          {tableros.map((tablero) => (
            <tr key={tablero.id}>
            <td className="py-3 px-4 border-b border-gray-700">{tablero.name}</td>
            <td className="py-3 px-4 border-b border-gray-700">{tablero.description}</td>
            <td className="py-3 px-4 border-b border-gray-700">{tablero.fechaCreacion}</td>
            <td className="py-3 px-4 border-b border-gray-700">
              <button
                onClick={() => {
                  setSelectedTablero(tablero);
                  setIsUpdateModalOpen(true);
                }}
                className="text-blue-500 hover:underline"
              >
                Editar
              </button>
            </td>
          </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <CreateTableroModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onTableroCreated={fetchTableros} // Llama a fetchTableros al crear un tablero nuevo
        />
      )}

    {isUpdateModalOpen && selectedTablero && (
            <UpdateTableroModal
              tablero={selectedTablero}
              isOpen={isUpdateModalOpen}
              onClose={() => setIsUpdateModalOpen(false)}
              onUpdate={handleUpdateTablero}
            />
          )}
    </div>
  );
};

export default TableroList;
