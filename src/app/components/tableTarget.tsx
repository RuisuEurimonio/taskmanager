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
    id: number;
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
    prioridad: { id: 1 },
  });
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

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
        const response = await fetch('http://localhost:8080/api/prioridad/all');
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

  const addOrUpdateCard = async () => {
    try {
      setValidationErrors([]);
      cardSchema.parse(newCard);

      const url = isEditing
        ? `http://localhost:8080/api/tarjeta/update`
        : 'http://localhost:8080/api/tarjeta/create';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard),
      });

      if (!response.ok) throw new Error('Error al guardar la tarjeta');

      const savedCard = await response.json();

      if (isEditing) {
        setCards(cards.map(card => (card.id === savedCard.id ? savedCard : card)));
      } else {
        setCards([...cards, savedCard]);
      }

      resetForm();
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

  const editCard = (card: Card) => {
    setNewCard(card);
    setIsEditing(true);
  };

  const resetForm = () => {
    setNewCard({
      titulo: '',
      description: '',
      fechaCreacion: new Date().toISOString(),
      fechaVencimiento: '',
      estado: { id: 1, description: 'La tarea se ha creado recientemente' },
      prioridad: { id: 1 },
    });
    setIsEditing(false);
    setValidationErrors([]);
  };

  return (
    <>
      <div className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold text-white">Bienvenido al Administrador de Tareas</h1>
        <p className="mt-4 text-lg text-white">
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

        {/* Form para añadir o actualizar tarjetas */}
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
            className="ml-2 p-2 border border-gray-600 rounded text-black"
          >
            {statuses.map(status => (
              <option key={status.id} value={status.id}>{status.name}</option>
            ))}
          </select>
          <select
            value={newCard.prioridad.id}
            onChange={(e) => setNewCard({ ...newCard, prioridad: { id: Number(e.target.value) } })}
            className="ml-2 p-2 border border-gray-600 rounded text-black"
          >
            {priorities.map(priority => (
              <option key={priority.id} value={priority.id}>{priority.name}</option>
            ))}
          </select>
          <button onClick={addOrUpdateCard} className="ml-2 bg-green-500 text-white py-1 px-3 rounded">
            {isEditing ? 'Actualizar Tarjeta' : 'Añadir Tarjeta'}
          </button>
          {isEditing && (
            <button onClick={resetForm} className="ml-2 bg-gray-500 text-white py-1 px-3 rounded">
              Cancelar Edición
            </button>
          )}
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
            {cards.map((card) => (
              <tr key={card.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{card.id}</td>
                <td className="border border-gray-300 px-4 py-2">{card.titulo}</td>
                <td className="border border-gray-300 px-4 py-2">{card.description}</td>
                <td className="border border-gray-300 px-4 py-2">{card.fechaCreacion}</td>
                <td className="border border-gray-300 px-4 py-2">{card.fechaVencimiento}</td>
                <td className="border border-gray-300 px-4 py-2">{card.estado.description}</td>
                <td className="border border-gray-300 px-4 py-2">{card.prioridad.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button onClick={() => editCard(card)} className="bg-blue-500 text-white py-1 px-2 rounded">
                    Editar
                  </button>
                  <button onClick={() => deleteCard(card.id!)} className="ml-2 bg-red-500 text-white py-1 px-2 rounded">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
