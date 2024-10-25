"use client";

import { useEffect, useState } from 'react';

interface Etiqueta {
  id: number;
  name: string;
  color: {
    id: number;
    name: string;
    description: string;
  };
}

const TableLabel = () => {
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    fetchEtiquetas();
  }, []);

  if (loading) return <p className="text-gray-300">Cargando etiquetas...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto border border-gray-800 rounded-lg shadow-lg bg-gray-900 p-6">
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">Etiquetas</h2>
      <table className="min-w-full bg-gray-900 text-gray-200">
        <thead>
          <tr className="bg-gray-800">
            <th className="py-3 px-4 text-left border-b border-gray-700">ID</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Nombre</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Color</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Descripción del Color</th>
          </tr>
        </thead>
        <tbody>
          {etiquetas.map((etiqueta) => (
            <tr key={etiqueta.id} className="hover:bg-gray-700 transition-colors">
              <td className="px-6 py-4 border-b border-gray-700 text-center">{etiqueta.id}</td>
              <td className="px-6 py-4 border-b border-gray-700 text-center">{etiqueta.name}</td>
              <td className="px-6 py-4 border-b border-gray-700 text-center">{etiqueta.color.name}</td>
              <td className="px-6 py-4 border-b border-gray-700 text-center">{etiqueta.color.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableLabel;
