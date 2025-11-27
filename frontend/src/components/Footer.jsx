export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center">
        <span>
          © {new Date().getFullYear()} ShineLab. Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
}

