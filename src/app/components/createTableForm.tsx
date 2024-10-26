import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTableroCreated: () => void; // Nueva prop para ejecutar tras la creación
}

const tableroSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  listaId: z.string().min(1, "La lista es obligatoria"),
});

type TableroFormData = z.infer<typeof tableroSchema>;

interface Lista {
  id: number;
  name: string;
  description: string;
}

const CreateTableroModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onTableroCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listas, setListas] = useState<Lista[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TableroFormData>({
    resolver: zodResolver(tableroSchema),
  });

  useEffect(() => {
    const fetchListas = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/lista/all");
        if (response.ok) {
          const data = await response.json();
          setListas(data);
        } else {
          console.error("Error al obtener las listas");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    if (isOpen) {
      fetchListas();
    }
  }, [isOpen]);

  const onSubmit = async (data: TableroFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:8080/api/tablero/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          lista: { id: Number(data.listaId) },
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el tablero");
      }

      alert("Tablero creado exitosamente");
      reset();
      onTableroCreated(); // Llamada a la función de actualización tras creación exitosa
      onClose();
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al crear el tablero");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-gray-200 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Crear Nuevo Tablero</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm">Nombre del Tablero</label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-800"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm">Descripción del Tablero</label>
            <textarea
              {...register("description")}
              className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-800"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm">Seleccionar Lista</label>
            <select
              {...register("listaId")}
              className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-800"
            >
              <option value="">Seleccione una lista</option>
              {listas.map((lista) => (
                <option key={lista.id} value={lista.id}>
                  {lista.name} - {lista.description}
                </option>
              ))}
            </select>
            {errors.listaId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.listaId.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 bg-gray-700 rounded text-gray-300 hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTableroModal;
