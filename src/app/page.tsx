import Image from "next/image";
import '@/app/styles/globals.css';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/servinho.png"
                alt="Servinho"
                width={40}
                height={40}
                className="rounded-full"
              />
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                UniEventos
              </h1>
            </div>
            <nav className="flex items-center space-x-4">
              <a
                href="/public-events"
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200 font-medium"
              >
                Eventos
              </a>
              <a
                href="/login"
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200 font-medium"
              >
                Entrar
              </a>
              <a
                href="/register"
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md"
              >
                Cadastrar
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 mb-6">
            Bem-vindo ao UniEventos
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Sua plataforma completa para gestão e participação em eventos da nossa comunidade. 
            Descubra, participe e conecte-se através de experiências transformadoras.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/public-events"
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg text-lg"
            >
              Ver Eventos Disponíveis
            </a>
            <a
              href="/login"
              className="border border-orange-300 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-lg transition-all duration-200 font-medium text-lg"
            >
              Área do Administrador
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-orange-200 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🎪</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Eventos Variados
            </h3>
            <p className="text-gray-600">
              Retiros, conferências, seminários e muito mais para fortalecer sua fé e comunhão.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-orange-200 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Fácil Inscrição
            </h3>
            <p className="text-gray-600">
              Sistema intuitivo para se inscrever nos eventos de seu interesse de forma rápida e segura.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-orange-200 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Comunidade Conectada
            </h3>
            <p className="text-gray-600">
              Conecte-se com outros membros e participe ativamente da vida da nossa comunidade.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-lg border-t border-orange-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2025 UniEventos - Gerenciando eventos com excelência
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}