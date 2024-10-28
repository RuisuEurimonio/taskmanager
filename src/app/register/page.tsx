"use client"

import React, { useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation'; // Cambia la importación de useRouter

const registerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial."
  })
});

const Register: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter(); // Inicializar useRouter

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const validatedData = registerSchema.parse({ name, email, password });
      const response = await fetch('http://localhost:8080/api/usuario/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...validatedData, rol: { id: 1 } }), // Agregar rol
      });

      if (!response.ok) {
        throw new Error('Error al crear el usuario');
      }

      // Aquí puedes redirigir a otra página o mostrar un mensaje de éxito
      alert('Usuario creado exitosamente');
      router.push("/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleRegister} className="bg-gray-800 p-6 rounded shadow-md">
        <h2 className="text-xl text-white mb-4">Registro</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-white mb-1">Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded text-gray-950"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-white mb-1">Correo Electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded text-gray-950"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-white mb-1">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded text-gray-950"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
};

export default Register;
