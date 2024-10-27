import React, { useEffect, useState } from 'react';
import { z } from 'zod';

interface Prioridad {
  id: number;
  name: string;
  description: string;
}

const prioridadSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
});

const TablePriority: React.FC = () => {
  const [prioridades, setPrioridades] = useState<Prioridad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [newPrioridad, setNewPrioridad] = useState({ name: '', description: '' });
  const [editPrioridad, setEditPrioridad] = useState<Prioridad | null>(null);

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

  const createPrioridad = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null); // Resetea el error de validación previo

    // Validación con Zod
    const result = prioridadSchema.safeParse(newPrioridad);
    if (!result.success) {
      setValidationError(result.error.errors.map((err) => err.message).join(', '));
      return;
    }

    try {
      console.log(newPrioridad)
      const response = await fetch('http://localhost:8080/api/prioridad/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrioridad),
      });

      const createdPrioridad = await response.json();
      setPrioridades([...prioridades, createdPrioridad]);
      setNewPrioridad({ name: '', description: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const deletePrioridad = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta prioridad?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/prioridad/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar la prioridad');

      setPrioridades(prioridades.filter((prioridad) => prioridad.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const updatePrioridad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrioridad) return;

    // Validación con Zod
    const result = prioridadSchema.safeParse(editPrioridad);
    if (!result.success) {
      setValidationError(result.error.errors.map((err) => err.message).join(', '));
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/prioridad/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editPrioridad),
      });

      const updatedPrioridad = await response.json();
      setPrioridades(
        prioridades.map((prioridad) => (prioridad.id === updatedPrioridad.id ? updatedPrioridad : prioridad))
      );
      setEditPrioridad(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleEditClick = (prioridad: Prioridad) => {
    console.log(prioridad);
    setEditPrioridad(prioridad);
  };

  if (loading) return <p className="text-gray-300">Cargando prioridades...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto border border-gray-800 rounded-lg shadow-lg bg-gray-900 p-6">
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">Prioridades</h2>

      {/* Mensaje de error de validación */}
      {validationError && <p className="text-red-500 mb-4">{validationError}</p>}

      {/* Formulario para crear prioridad */}
      <form onSubmit={createPrioridad} className="mb-6">
        <h3 className="text-xl text-gray-100 mb-2">Crear Prioridad</h3>
        <input
          type="text"
          placeholder="Nombre de Prioridad"
          value={newPrioridad.name}
          onChange={(e) => setNewPrioridad({ ...newPrioridad, name: e.target.value })}
          className="border rounded px-4 py-2 mr-2 mb-2 bg-gray-800 text-gray-100"
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newPrioridad.description}
          onChange={(e) => setNewPrioridad({ ...newPrioridad, description: e.target.value })}
          className="border rounded px-4 py-2 mb-2 bg-gray-800 text-gray-100"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Crear
        </button>
      </form>

      {/* Formulario para actualizar prioridad */}
      {editPrioridad && (
        <form onSubmit={updatePrioridad} className="mb-6">
          <h3 className="text-xl text-gray-100 mb-2">Actualizar Prioridad</h3>
          <input
            type="text"
            placeholder="Nombre de Prioridad"
            value={editPrioridad.name}
            onChange={(e) => setEditPrioridad({ ...editPrioridad, name: e.target.value })}
            className="border rounded px-4 py-2 mr-2 mb-2 bg-gray-800 text-gray-100"
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={editPrioridad.description}
            onChange={(e) => setEditPrioridad({ ...editPrioridad, description: e.target.value })}
            className="border rounded px-4 py-2 mb-2 bg-gray-800 text-gray-100"
            required
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Actualizar
          </button>
          <button
            type="button"
            onClick={() => setEditPrioridad(null)}
            className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </form>
      )}

      <table className="min-w-full bg-gray-900 text-gray-200">
        <thead>
          <tr className="bg-gray-800">
            <th className="py-3 px-4 text-left border-b border-gray-700">Prioridad</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Descripción</th>
            <th className="py-3 px-4 text-left border-b border-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prioridades.map((prioridad) => (
            <tr key={prioridad.id} className="hover:bg-gray-700 transition-colors">
            <td className="px-6 py-4 border-b border-gray-700">{prioridad.name}</td>
            <td className="px-6 py-4 border-b border-gray-700">{prioridad.description}</td>
            <td className="px-6 py-4 border-b border-gray-700">
              <button
                onClick={() => handleEditClick(prioridad)}
                className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => deletePrioridad(prioridad.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Eliminar
              </button>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePriority;
