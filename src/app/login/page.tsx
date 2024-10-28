// src/app/login/page.tsx

"use client"; 

import React, { useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation'; // Cambia la importación de useRouter
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter(); // Inicializar useRouter

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validar datos usando Zod
    const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
      setError(validationResult.error.errors.map(err => err.message).join(', '));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const userData = await response.json();

      // Guardar información del usuario en local storage
      localStorage.setItem('user', JSON.stringify(userData));
      window.dispatchEvent(new Event("userUpdated"));

      // Redirigir al usuario a la página de inicio después de iniciar sesión
      router.push('/'); // Cambia a la ruta de tu Home

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <div className="w-full max-w-xs">
        <form className="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleLogin}>
          <h2 className="text-white text-lg mb-4">Iniciar Sesión</h2>
          {error && <p className="text-red-500">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="tu-email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          <Link href="/register"> Registrarse. </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
