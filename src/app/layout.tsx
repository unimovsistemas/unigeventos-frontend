import '@/app/styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'UniEventos',
  description: 'Conectando pessoas através de eventos',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="overflow-x-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="bg-gray-100 overflow-x-hidden max-w-full">
        <div className="max-w-full overflow-x-hidden">
          {children}
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
        </body>
    </html>
  );
}