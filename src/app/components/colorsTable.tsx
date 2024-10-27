"use client";

import { useEffect, useState } from 'react';
import { z } from 'zod';

// Define el esquema de validación para un color
const colorSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
});

interface Color {
  id: number;
  name: string;
  description: string;
}

const ColorsTable = () => {
  const [colores, setColores] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newColor, setNewColor] = useState({ name: '', description: '' });
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [updateData, setUpdateData] = useState<{ name: string; description: string }>({ name: '', description: '' });

  useEffect(() => {
    const fetchColores = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/color/all');
        if (!response.ok) {
          throw new Error('Error al cargar los colores');
        }
        const data = await response.json();
        setColores(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchColores();
  }, []);

  const handleCreate = async () => {
    try {
      // Validar los datos de entrada
      colorSchema.parse(newColor);

      const response = await fetch('http://localhost:8080/api/color/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newColor),
      });
      if (!response.ok) {
        throw new Error('Error al crear el color');
      }
      const newColorResponse = await response.json();
      setColores([...colores, newColorResponse]);
      setNewColor({ name: '', description: '' }); // Reset form
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleUpdate = async () => {
    if (updateId === null) return; // Asegúrate de que updateId no sea null
    try {
      // Validar los datos de entrada
      colorSchema.parse(updateData);

      const response = await fetch(`http://localhost:8080/api/color/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updateId, // Envía el id en el cuerpo de la solicitud
          name: updateData.name,
          description: updateData.description,
        }),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el color');
      }
      const updatedColor = await response.json();
      setColores(colores.map(c => (c.id === updateId ? updatedColor : c)));
      setUpdateId(null); // Reset update state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/color/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el color');
      }
      setColores(colores.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  if (loading) return <p className="text-gray-300">Cargando colores...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto border border-gray-800 rounded-lg shadow-lg bg-gray-900 p-6">
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">Colores</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre del color"
          value={newColor.name}
          onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
          className="p-2 border border-gray-600 rounded"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newColor.description}
          onChange={(e) => setNewColor({ ...newColor, description: e.target.value })}
          className="ml-2 p-2 border border-gray-600 rounded"
        />
        <button onClick={handleCreate} className="ml-2 bg-blue-600 text-white p-2 rounded">Crear</button>
      </div>

      {updateId !== null && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Nombre del color"
            value={updateData.name}
            onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
            className="p-2 border border-gray-600 rounded"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={updateData.description}
            onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
            className="ml-2 p-2 border border-gray-600 rounded"
          />
          <button onClick={handleUpdate} className="ml-2 bg-yellow-600 text-white p-2 rounded">Actualizar</button>
        </div>
      )}

      <table className="min-w-full bg-gray-900 text-gray-200">
        <thead>
          <tr className="bg-gray-800">
            <th className="py-3 px-4 text-left border-b border-gray-700">ID</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Nombre</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Descripción</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {colores.map((color) => (
            <tr key={color.id} className="hover:bg-gray-700 transition-colors">
              <td className="px-6 py-4 border-b border-gray-700 text-center">{color.id}</td>
              <td className="px-6 py-4 border-b border-gray-700 text-center">{color.name}</td>
              <td className="px-6 py-4 border-b border-gray-700 text-center">{color.description}</td>
              <td className="px-6 py-4 border-b border-gray-700 text-center">
                <button onClick={() => { setUpdateId(color.id); setUpdateData({ name: color.name, description: color.description }); }} className="bg-yellow-600 text-white p-1 rounded">Editar</button>
                <button onClick={() => handleDelete(color.id)} className="ml-2 bg-red-600 text-white p-1 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ColorsTable;
