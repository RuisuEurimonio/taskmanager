import React, { useEffect, useState } from 'react';

interface Prioridad {
  id: number;
  name: string;
  description: string;
}

const TablePriority: React.FC = () => {
  const [prioridades, setPrioridades] = useState<Prioridad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrioridades = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/prioridad/all');
        if (!response.ok) {
          throw new Error('Error al cargar las prioridades');
        }
        const data = await response.json();
        setPrioridades(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchPrioridades();
  }, []);

  if (loading) return <p className="text-gray-300">Cargando prioridades...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto border border-gray-800 rounded-lg shadow-lg bg-gray-900 p-6">
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">Prioridades</h2>
      <table className="min-w-full bg-gray-900 text-gray-200">
        <thead>
          <tr className="bg-gray-800">
            <th className="py-3 px-4 text-left border-b border-gray-700">Prioridad</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {prioridades.map((prioridad) => (
            <tr key={prioridad.id} className="hover:bg-gray-700 transition-colors">
              <td className="px-6 py-4 border-b border-gray-700">{prioridad.name}</td>
              <td className="px-6 py-4 border-b border-gray-700">{prioridad.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePriority;
