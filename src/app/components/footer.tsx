const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Administrador de Tareas. Todos los derechos reservados.
          </p>
          <div className="mt-2">
            <a
              href="/privacy"
              className="text-gray-400 hover:text-gray-300 mx-2"
            >
              Política de Privacidad
            </a>
            |
            <a
              href="/terms"
              className="text-gray-400 hover:text-gray-300 mx-2"
            >
              Términos de Servicio
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  