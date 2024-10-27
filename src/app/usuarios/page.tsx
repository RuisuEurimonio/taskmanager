"use client"

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { User } from '../types/types';

// Define el esquema de Rol
const RolSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  description: z.string().optional(),
});

// Define el esquema de Usuario
const UsuarioSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: "El nombre es requerido" }),
  email: z.string().email({ message: "El email no es válido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  rol: RolSchema,
});

// Tipos de Rol y Usuario a partir de los esquemas
type Rol = z.infer<typeof RolSchema>;
type Usuario = z.infer<typeof UsuarioSchema>;

const UserView = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]); // Estado para roles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userE, setUserE] = useState<User | null>(null);
  const [newUsuario, setNewUsuario] = useState<Omit<Usuario, 'id'>>({
    name: '',
    email: '',
    password: '',
    rol: { id: 1, name: 'Admin', description: 'Administrador del sistema' } // Valor inicial
  });
  const [editUsuario, setEditUsuario] = useState<Usuario | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const getUser = () => {
    const user = localStorage.getItem('user');
    const parsedUser: User | null = user ? JSON.parse(user) : null;
    setUserE(parsedUser);
  };

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

  const fetchRoles = async () => { // Nueva función para obtener roles
    try {
      const response = await fetch('http://localhost:8080/api/rol/all');
      if (!response.ok) {
        throw new Error('Error al cargar los roles');
      }
      const data = await response.json();
      setRoles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  

  const createUsuario = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/usuario/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUsuario),
      });
      if (!response.ok) {
        throw new Error('Error al crear el usuario');
      }
      await fetchUsuarios();
      setNewUsuario({
        name: '',
        email: '',
        password: '',
        rol: roles.length > 0 ? roles[0] : { id: 1, name: 'Admin', description: 'Administrador del sistema' }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const updateUsuario = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/usuario/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editUsuario),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }
      await fetchUsuarios();
      setEditUsuario(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const deleteUsuario = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/usuario/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }
      await fetchUsuarios();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  useEffect(() => {
    getUser();
    fetchUsuarios();
    fetchRoles(); // Llama a la nueva función para obtener roles
  }, []);

  return (
    <div className="m-auto w-11/12 p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de usuarios.</h1>
      {userE ? (
        <>
          <p className="text-gray-300 mb-6">Aquí puedes ver la lista de usuarios registrados en el sistema.</p>
          {loading ? (
            <p className="text-gray-300">Cargando usuarios...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <div className="overflow-x-auto border border-gray-800 rounded-lg shadow-lg bg-gray-900 p-6">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">Usuarios</h2>

              {/* Formulario para crear o editar un usuario */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-100 mb-2">{editUsuario ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={editUsuario ? editUsuario.name : newUsuario.name}
                  onChange={(e) => editUsuario ? setEditUsuario({ ...editUsuario, name: e.target.value }) : setNewUsuario({ ...newUsuario, name: e.target.value })}
                  className="mr-2 p-2 border border-gray-600"
                />
                {validationErrors.name && <span className="text-red-500">{validationErrors.name}</span>}
                <input
                  type="email"
                  placeholder="Email"
                  value={editUsuario ? editUsuario.email : newUsuario.email}
                  onChange={(e) => editUsuario ? setEditUsuario({ ...editUsuario, email: e.target.value }) : setNewUsuario({ ...newUsuario, email: e.target.value })}
                  className="mr-2 p-2 border border-gray-600"
                />
                {validationErrors.email && <span className="text-red-500">{validationErrors.email}</span>}
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={editUsuario ? editUsuario.password : newUsuario.password}
                  onChange={(e) => editUsuario ? setEditUsuario({ ...editUsuario, password: e.target.value }) : setNewUsuario({ ...newUsuario, password: e.target.value })}
                  className="mr-2 p-2 border border-gray-600"
                />
                {validationErrors.password && <span className="text-red-500">{validationErrors.password}</span>}
                <select
                  value={editUsuario ? editUsuario.rol.id : newUsuario.rol.id}
                  onChange={(e) => {
                    const selectedRoleId = Number(e.target.value);
                    const selectedRole = roles.find(role => role.id === selectedRoleId);

                    if (selectedRole) {
                      if (editUsuario) {
                        setEditUsuario({ ...editUsuario, rol: selectedRole });
                      } else {
                        setNewUsuario({ ...newUsuario, rol: selectedRole });
                      }
                    }
                  }}
                  className="mr-2 p-2 border border-gray-600"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={editUsuario ? updateUsuario : createUsuario}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {editUsuario ? 'Actualizar' : 'Crear'}
                </button>
              </div>

              {/* Tabla de usuarios */}
              <table className="min-w-full border border-gray-800">
                <thead>
                  <tr>
                    <th className="border border-gray-600 px-4 py-2">ID</th>
                    <th className="border border-gray-600 px-4 py-2">Nombre</th>
                    <th className="border border-gray-600 px-4 py-2">Email</th>
                    <th className="border border-gray-600 px-4 py-2">Rol</th>
                    <th className="border border-gray-600 px-4 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td className="border border-gray-600 px-4 py-2">{usuario.id}</td>
                      <td className="border border-gray-600 px-4 py-2">{usuario.name}</td>
                      <td className="border border-gray-600 px-4 py-2">{usuario.email}</td>
                      <td className="border border-gray-600 px-4 py-2">{usuario.rol.name}</td>
                      <td className="border border-gray-600 px-4 py-2">
                        <button onClick={() => setEditUsuario(usuario)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
                        <button onClick={() => deleteUsuario(usuario.id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <p className="text-red-500">Por favor, inicia sesión para ver esta página.</p>
      )}
    </div>
  );
};

export default UserView;
