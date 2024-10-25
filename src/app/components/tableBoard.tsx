"use client";

import { useEffect, useState } from 'react';

interface Lista {
  id: number;
  name: string;
  description: string;
  orden: string;
}

interface Tablero {
  id: number;
  name: string;
  description: string;
  fechaCreacion: string;
  lista: Lista;
}

const TableBoard = () => {
  const [tableros, setTableros] = useState<Tablero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTableros = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/tablero/all');
        if (!response.ok) {
          throw new Error('Error al cargar los tableros');
        }
        const data = await response.json();
        setTableros(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchTableros();
  }, []);

  if (loading) return <p className="text-gray-300">Cargando tableros...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto border border-gray-800 rounded-lg shadow-lg bg-gray-900 p-6">
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">Tableros</h2>
      <table className="min-w-full bg-gray-900 text-gray-200">
        <thead>
          <tr className="bg-gray-800">
            <th className="py-3 px-4 text-left border-b border-gray-700">Nombre</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Descripción</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Fecha de Creación</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Lista Asociada</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Descripción de la Lista</th>
          </tr>
        </thead>
        <tbody>
          {tableros.map((tablero) => (
            <tr key={tablero.id} className="hover:bg-gray-700 transition-colors">
              <td className="px-6 py-4 border-b border-gray-700">{tablero.name}</td>
              <td className="px-6 py-4 border-b border-gray-700">{tablero.description}</td>
              <td className="px-6 py-4 border-b border-gray-700">
                {new Date(tablero.fechaCreacion).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 border-b border-gray-700">{tablero.lista.name}</td>
              <td className="px-6 py-4 border-b border-gray-700">{tablero.lista.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableBoard;
