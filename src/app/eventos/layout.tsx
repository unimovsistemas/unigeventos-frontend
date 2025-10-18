"use client";

import Image from 'next/image';

export default function EventosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden max-w-full">
      {/* Clean Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Image
                src="/servinho.png"
                alt="Servinho"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  UniEventos
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Conectando Gerações</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-2 sm:space-x-4">
              <a
                href="/eventos"
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-orange-50 text-sm sm:text-base"
              >
                Eventos
              </a>
              <a
                href="/login"
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-orange-50 text-sm sm:text-base"
              >
                Entrar
              </a>
              <a
                href="/register"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                Cadastrar
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
            {/* Main Content */}
      <main className="flex-1 px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 w-full max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="text-center">
            <p className="text-gray-600 font-medium mb-1 text-sm sm:text-base">
              © 2025 UniEventos - Conectando pessoas através de eventos
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">
              Feito com ❤️ para nossa comunidade
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}