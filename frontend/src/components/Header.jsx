import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">

        <Link to="/" className="flex flex-col">
          <span className="font-bold text-xl leading-tight">ShineLab - </span>
          <span className="text-xs text-gray-500">Reservá tu turno de detailing</span>
        </Link>

        <div className="flex gap-2">
          <button className="border px-3 py-1 rounded">Crear cuenta</button>
          <button className="bg-blue-600 text-white px-3 py-1 rounded">
            Iniciar sesión
          </button>
        </div>
      </div>
    </header>
  );
}

