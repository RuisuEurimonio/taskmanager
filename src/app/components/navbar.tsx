import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleAuth = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <div className="flex space-x-4">
        <Link href="/" className="text-white text-lg font-semibold hover:text-gray-400">
          Inicio
        </Link>
        <Link href="/proyectos" className="text-white text-lg font-semibold hover:text-gray-400">
          Proyectos
        </Link>
        <Link href="/usuarios" className="text-white text-lg font-semibold hover:text-gray-400">
          Usuarios
        </Link>
      </div>
      <div>
        {isLoggedIn ? (
          <button
            onClick={handleAuth}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
          >
            Cerrar Sesión
          </button>
        ) : (
          <button
            onClick={handleAuth}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
