"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // Aunque es recomendable no guardar la contraseña en el localStorage.
  rol: Role;
}

const Navbar = () => {

  const user = localStorage.getItem('user');
  const parsedUser : User | null = user ? JSON.parse(user) : null;

  const router = useRouter();

  const clearLocalStorage = () => {
    localStorage.clear();
  }

  const handleLogout = () => {
    clearLocalStorage(); // Limpiar el local storage
    router.push('/login'); // Redirigir a la página de inicio de sesión
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <div className="flex space-x-4">
        <Link href="/" className="text-white text-lg font-semibold hover:text-gray-400">
          Inicio
        </Link>
        <Link href="/tableros" className="text-white text-lg font-semibold hover:text-gray-400">
          Tableros
        </Link>
        <Link href="/usuarios" className="text-white text-lg font-semibold hover:text-gray-400">
          Usuarios
        </Link>
      </div>
      <div>
        {parsedUser ?
              <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                onClick={(handleLogout)}
              >
                Cerrar sesión.
              </button>
          :
          <Link href="/login"
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
          >
            Iniciar sesión
          </Link>
        }
      </div>
    </nav>
  );
};

export default Navbar;
