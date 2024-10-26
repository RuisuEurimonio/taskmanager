"use client";

import { useEffect, useState } from 'react';

interface Rol {
  id: number;
  name: string;
  description: string;
}

interface Usuario {
  id: number;
  name: string;
  email: string;
  password: string;
  rol: Rol;
}

const UserView = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/usuario/all');
        if (!response.ok) {
          throw new Error('Error al cargar los usuarios');
        }
        const data = await response.json();
        setUsuarios(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-100 mb-4">Bienvenido a la Vista de Usuarios</h1>
      <p className="text-gray-300 mb-6">Aquí puedes ver la lista de usuarios registrados en el sistema.</p>

      {loading ? (
        <p className="text-gray-300">Cargando usuarios...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="overflow-x-auto border border-gray-800 rounded-lg shadow-lg bg-gray-900 p-6">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">Usuarios</h2>
          <table className="min-w-full bg-gray-900 text-gray-200">
            <thead>
              <tr className="bg-gray-800">
                <th className="py-3 px-4 text-left border-b border-gray-700">ID</th>
                <th className="py-3 px-4 text-left border-b border-gray-700">Nombre</th>
                <th className="py-3 px-4 text-left border-b border-gray-700">Email</th>
                <th className="py-3 px-4 text-left border-b border-gray-700">Rol</th>
                <th className="py-3 px-4 text-left border-b border-gray-700">Descripción del Rol</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 border-b border-gray-700 text-center">{usuario.id}</td>
                  <td className="px-6 py-4 border-b border-gray-700 text-center">{usuario.name}</td>
                  <td className="px-6 py-4 border-b border-gray-700 text-center">{usuario.email}</td>
                  <td className="px-6 py-4 border-b border-gray-700 text-center">{usuario.rol.name}</td>
                  <td className="px-6 py-4 border-b border-gray-700 text-center">{usuario.rol.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserView;
