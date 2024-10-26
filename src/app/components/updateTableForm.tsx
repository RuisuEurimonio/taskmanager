import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

const tableroSchema = z.object({
  id: z.number().min(1, "ID es requerido"),
  name: z.string().min(1, "Nombre es requerido"),
  description: z.string().min(1, "Descripción es requerida"),
  lista: z.object({
    id: z.number().min(1, "ID de lista es requerido"),
  }),
});

type TableroFormData = z.infer<typeof tableroSchema>;

interface UpdateTableroFormProps {
  tablero: TableroFormData;
  onUpdate: (data: TableroFormData) => void;
}

const UpdateTableroForm: React.FC<UpdateTableroFormProps> = ({ tablero, onUpdate }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<TableroFormData>();

  useEffect(() => {
    setValue("id", tablero.id);
    setValue("name", tablero.name);
    setValue("description", tablero.description);
    setValue("lista.id", tablero.lista.id);
  }, [tablero, setValue]);

  const onSubmit = async (data: TableroFormData) => {
    try {
      const response = await fetch('http://localhost:8080/api/lista/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el tablero');
      }

      onUpdate(data); // Llama a la función para actualizar la lista de tableros
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("id")} />

      <div>
        <label className="block text-gray-100 ">Nombre:</label>
        <input {...register("name")} className="w-full p-2 border text-gray-950 border-gray-700 rounded" />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      </div>

      <div>
        <label className="block text-gray-100 ">Descripción:</label>
        <textarea {...register("description")} className="w-full p-2 border text-gray-950 border-gray-700 rounded" />
        {errors.description && <span className="text-red-500">{errors.description.message}</span>}
      </div>

      <div>
        <label className="block text-gray-100 ">ID de Lista:</label>
        <input type="number" {...register("lista.id")} className="w-full p-2 border text-gray-950 border-gray-700 rounded" />
        {errors.lista?.id && <span className="text-red-500">{errors.lista.id.message}</span>}
      </div>

      <button type="submit" className="px-4 py-2 bg-blue-600 text-gray-100 rounded hover:bg-blue-500">Actualizar Tablero</button>
    </form>
  );
};

export default UpdateTableroForm;
