"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '../types/types';

const Navbar = () => {

  const [userE, setUserE] = useState<boolean>(false);
  const router = useRouter();
  
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      setUserE(!!storedUser); // Verifica si hay un usuario autenticado
    };

    checkUser(); // Verifica al montar el componente

    // Escucha el evento "userUpdated" para actualizar el estado
    window.addEventListener("userUpdated", checkUser);

    // Limpia el listener cuando se desmonta el componente
    return () => {
      window.removeEventListener("userUpdated", checkUser);
    };
  }, []);

  const handleLogout = () => {

    localStorage.removeItem("user");
    setUserE(false);
    window.dispatchEvent(new Event("userUpdated")); // Emite el evento personalizado
    router.push("/login");
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
        {userE ?
              <button key={userE ? "si" : "no"} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                onClick={(handleLogout)}
              >
                Cerrar sesión.
              </button>
          :
          <Link href="/login"
            key={userE ? "si" : "no"}
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
