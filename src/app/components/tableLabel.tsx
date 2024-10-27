"use client";

import { useEffect, useState } from 'react';

interface Color {
  id: number;
  name: string;
  description: string;
}

interface Etiqueta {
  id: number;
  name: string;
  color: Color;
}

const TableLabel = () => {
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [colores, setColores] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEtiqueta, setNewEtiqueta] = useState({ name: '', color: { id: 1 } });
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [updateData, setUpdateData] = useState<{ name: string; colorId: number }>({ name: '', colorId: 1 });

  useEffect(() => {
    const fetchEtiquetas = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/etiqueta/all');
        if (!response.ok) {
          throw new Error('Error al cargar las etiquetas');
        }
        const data = await response.json();
        setEtiquetas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

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
      }
    };

    fetchEtiquetas();
    fetchColores();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/etiqueta/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEtiqueta),
      });
      if (!response.ok) {
        throw new Error('Error al crear la etiqueta');
      }
      const newLabel = await response.json();
      setEtiquetas([...etiquetas, newLabel]);
      setNewEtiqueta({ name: '', color: { id: 1 } }); // Reset form
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleUpdate = async () => {
    if (updateId === null) return; // Asegúrate de que updateId no sea null
    try {
      const response = await fetch(`http://localhost:8080/api/etiqueta/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updateId, // Envía el id en el cuerpo de la solicitud
          name: updateData.name,
          color: { id: updateData.colorId },
        }),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la etiqueta');
      }
      const updatedLabel = await response.json();
      setEtiquetas(etiquetas.map(et => (et.id === updateId ? updatedLabel : et)));
      setUpdateId(null); // Reset update state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/etiqueta/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar la etiqueta');
      }
      setEtiquetas(etiquetas.filter(et => et.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  if (loading) return <p className="text-gray-300">Cargando etiquetas...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto border border-gray-800 rounded-lg shadow-lg bg-gray-900 p-6">
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">Etiquetas</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre de etiqueta"
          value={newEtiqueta.name}
          onChange={(e) => setNewEtiqueta({ ...newEtiqueta, name: e.target.value })}
          className="p-2 border border-gray-600 rounded"
        />
        <select
          value={newEtiqueta.color.id}
          onChange={(e) => setNewEtiqueta({ ...newEtiqueta, color: { id: Number(e.target.value) } })}
          className="ml-2 p-2 border border-gray-600 rounded"
        >
          {colores.map(color => (
            <option key={color.id} value={color.id}>{color.name}</option>
          ))}
        </select>
        <button onClick={handleCreate} className="ml-2 bg-blue-600 text-white p-2 rounded">Crear</button>
      </div>

      {updateId !== null && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Nombre de etiqueta"
            value={updateData.name}
            onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
            className="p-2 border border-gray-600 rounded"
          />
          <select
            value={updateData.colorId}
            onChange={(e) => setUpdateData({ ...updateData, colorId: Number(e.target.value) })}
            className="ml-2 p-2 border border-gray-600 rounded"
          >
            {colores.map(color => (
              <option key={color.id} value={color.id}>{color.name}</option>
            ))}
          </select>
          <button onClick={handleUpdate} className="ml-2 bg-yellow-600 text-white p-2 rounded">Actualizar</button>
        </div>
      )}

      <table className="min-w-full bg-gray-900 text-gray-200">
        <thead>
          <tr className="bg-gray-800">
            <th className="py-3 px-4 text-left border-b border-gray-700">ID</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Nombre</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Color</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Descripción del Color</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {etiquetas.map((etiqueta) => (
            <tr key={etiqueta.id} className="hover:bg-gray-700 transition-colors">
              <td className="px-6 py-4 border-b border-gray-700 text-center">{etiqueta.id}</td>
              <td className="px-6 py-4 border-b border-gray-700 text-center">{etiqueta.name}</td>
              <td className="px-6 py-4 border-b border-gray-700 text-center">{etiqueta.color.name}</td>
              <td className="px-6 py-4 border-b border-gray-700 text-center">{etiqueta.color.description}</td>
              <td className="px-6 py-4 border-b border-gray-700 text-center">
                <button onClick={() => { setUpdateId(etiqueta.id); setUpdateData({ name: etiqueta.name, colorId: etiqueta.color.id }); }} className="bg-yellow-600 text-white p-1 rounded">Editar</button>
                <button onClick={() => handleDelete(etiqueta.id)} className="ml-2 bg-red-600 text-white p-1 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableLabel;
