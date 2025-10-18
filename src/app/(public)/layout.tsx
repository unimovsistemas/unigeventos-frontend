import Image from 'next/image';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
      <div className="relative min-h-screen bg-gradient-to-r from-orange-400 via-red-500 to-black flex items-center justify-center p-4">
         {/* Conteúdo centralizado (páginas) */}
         <main>
          {children}
        </main>
        <Image
          src="/servinho.png"
          alt="Servinho"
          width={200}
          height={200}
          className="absolute left-[calc(50%+215px)] -scale-x-100"
        />
      </div>
  );
}