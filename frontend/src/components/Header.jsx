import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white fixed top-0 left-0 w-full flex justify-between items-center p-4 shadow-md z-50">
      <Link to="/" className="text-xl font-bold">
        D&G Car Detail
      </Link>
      <div className="space-x-4">
        <button className="bg-gray-700 px-3 py-1 rounded">Crear cuenta</button>
        <button className="bg-gray-700 px-3 py-1 rounded">Iniciar sesión</button>
      </div>
    </header>
  );
}
