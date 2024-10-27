"use client";

import { useEffect, useState } from 'react';
import { z } from 'zod';

// Esquema de validación de Zod
const cardSchema = z.object({
  id: z.number().optional(),
  titulo: z.string().min(1, 'El título es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  fechaCreacion: z.string().optional(),
  fechaVencimiento: z.string().nonempty('La fecha de vencimiento es obligatoria'),
  estado: z.object({
    id: z.number().positive('ID de estado inválido'),
    description: z.string().optional(),
  }),
  prioridad: z.object({
    id: z.number().positive('ID de prioridad inválido'),
  }),
});

interface Card {
  id?: number;
  titulo: string;
  description: string;
  fechaCreacion?: string;
  fechaVencimiento: string;
  estado: {
    id: number;
    description?: string;
  };
  prioridad: {
    id: number,
    name?: string;
  };
}

interface Status {
  id: number;
  name: string;
}

interface Priority {
  id: number;
  name: string;
}

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [newCard, setNewCard] = useState<Card>({
    titulo: '',
    description: '',
    fechaCreacion: new Date().toISOString(),
    fechaVencimiento: '',
    estado: { id: 1, description: 'La tarea se ha creado recientemente' },
    prioridad: { id: 1 }, // Agregando prioridad por defecto
  });

  const [statuses, setStatuses] = useState<Status[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/tarjeta/all');
        if (!response.ok) throw new Error('Error al cargar las tarjetas');
        const data = await response.json();
        setCards(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };

    const fetchStatuses = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/estado/all');
        const data = await response.json();
        setStatuses(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchPriorities = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/prioridad/all'); // Asegúrate de que esta ruta sea correcta
        const data = await response.json();
        setPriorities(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCards();
    fetchStatuses();
    fetchPriorities();
  }, []);

  const addCard = async () => {
    try {
      setValidationErrors([]);
      cardSchema.parse(newCard); // Validación con Zod

      const response = await fetch('http://localhost:8080/api/tarjeta/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard),
      });

      if (!response.ok) throw new Error('Error al crear la tarjeta');

      const createdCard = await response.json();
      setCards([...cards, createdCard]);
      setNewCard({
        titulo: '',
        description: '',
        fechaCreacion: new Date().toISOString(),
        fechaVencimiento: '',
        estado: { id: 1, description: 'La tarea se ha creado recientemente' },
        prioridad: { id: 1 }, // Reset de prioridad
      }); // Reset form
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationErrors(err.errors.map(e => e.message));
      } else {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    }
  };

  const deleteCard = async (cardId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tarjeta/delete/${cardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar la tarjeta');

      setCards(cards.filter(card => card.id !== cardId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  return (
    <>
      <div className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold text-gray-900">Bienvenido al Administrador de Tareas</h1>
        <p className="mt-4 text-lg text-gray-700">
          Aquí puedes gestionar tus tareas y proyectos de manera eficiente. A continuación, encontrarás un resumen de tus actividades.
        </p>

        {/* Mensajes de error */}
        {error && <p className="text-red-500">{error}</p>}
        {validationErrors.length > 0 && (
          <ul className="text-red-500">
            {validationErrors.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        )}

        {/* Form para añadir nuevas tarjetas */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Título de la tarjeta"
            value={newCard.titulo}
            onChange={(e) => setNewCard({ ...newCard, titulo: e.target.value })}
            className="p-2 border border-gray-600 rounded"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={newCard.description}
            onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
            className="ml-2 p-2 border border-gray-600 rounded"
          />
          <input
            type="datetime-local"
            value={newCard.fechaVencimiento}
            onChange={(e) => setNewCard({ ...newCard, fechaVencimiento: e.target.value })}
            className="ml-2 p-2 border border-gray-600 rounded"
          />
          <select
            value={newCard.estado.id}
            onChange={(e) => setNewCard({ ...newCard, estado: { ...newCard.estado, id: Number(e.target.value) } })}
            className="ml-2 p-2 border border-gray-600 rounded"
          >
            {statuses.map(status => (
              <option key={status.id} value={status.id}>{status.name}</option>
            ))}
          </select>
          <select
            value={newCard.prioridad.id}
            onChange={(e) => setNewCard({ ...newCard, prioridad: { id: Number(e.target.value) } })}
            className="ml-2 p-2 border border-gray-600 rounded"
          >
            {priorities.map(priority => (
              <option key={priority.id} value={priority.id}>{priority.name}</option>
            ))}
          </select>
          <button onClick={addCard} className="ml-2 bg-green-500 text-white py-1 px-3 rounded">Añadir Tarjeta</button>
        </div>

        {/* Tabla de tarjetas */}
        <h2 className="text-2xl font-semibold">Tarjetas</h2>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-900">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Título</th>
              <th className="border border-gray-300 px-4 py-2">Descripción</th>
              <th className="border border-gray-300 px-4 py-2">Fecha Creación</th>
              <th className="border border-gray-300 px-4 py-2">Fecha Vencimiento</th>
              <th className="border border-gray-300 px-4 py-2">Estado</th>
              <th className="border border-gray-300 px-4 py-2">Prioridad</th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cards.map(card => (
              <tr key={card.id} className="border-b hover:bg-gray-950">
                <td className="border border-gray-300 px-4 py-2">{card.id}</td>
                <td className="border border-gray-300 px-4 py-2">{card.titulo}</td>
                <td className="border border-gray-300 px-4 py-2">{card.description}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {card.fechaCreacion ? new Date(card.fechaCreacion).toLocaleString() : 'Fecha no disponible'}
                </td>
                <td className="border border-gray-300 px-4 py-2">{new Date(card.fechaVencimiento).toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">{card.estado.description}</td>
                <td className="border border-gray-300 px-4 py-2">{card.prioridad.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button onClick={() => deleteCard(card.id!)} className="bg-red-500 text-white py-1 px-3 rounded">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
