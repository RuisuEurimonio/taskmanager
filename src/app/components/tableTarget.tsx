import { useEffect, useState } from 'react';

interface Tarjeta {
  id: number;
  titulo: string;
  description: string;
  fechaCreacion: string;
  fechaVencimiento: string;
  estado: {
    id: number;
    name: string;
    description: string;
  };
  prioridad: {
    id: number;
    name: string;
    description: string;
  };
}

const TableTarget = () => {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTarjetas = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/tarjeta/all');
        if (!response.ok) {
          throw new Error('Error al cargar las tareas');
        }
        const data = await response.json();
        setTarjetas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchTarjetas();
  }, []);

  if (loading) return <p className="text-gray-300">Cargando...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full bg-gray-900">
        <thead>
          <tr className="w-full bg-gray-800 text-gray-100">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Título</th>
            <th className="py-2 px-4">Descripción</th>
            <th className="py-2 px-4">Fecha Creación</th>
            <th className="py-2 px-4">Fecha Vencimiento</th>
            <th className="py-2 px-4">Estado</th>
            <th className="py-2 px-4">Prioridad</th>
          </tr>
        </thead>
        <tbody>
          {tarjetas.map((tarjeta) => (
            <tr key={tarjeta.id} className="hover:bg-gray-700">
              <td className="border px-4 py-2 text-gray-300">{tarjeta.id}</td>
              <td className="border px-4 py-2 text-gray-300">{tarjeta.titulo}</td>
              <td className="border px-4 py-2 text-gray-300">{tarjeta.description}</td>
              <td className="border px-4 py-2 text-gray-300">{new Date(tarjeta.fechaCreacion).toLocaleString()}</td>
              <td className="border px-4 py-2 text-gray-300">{new Date(tarjeta.fechaVencimiento).toLocaleString()}</td>
              <td className="border px-4 py-2 text-gray-300">{tarjeta.estado.name}</td>
              <td className="border px-4 py-2 text-gray-300">{tarjeta.prioridad.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableTarget;
