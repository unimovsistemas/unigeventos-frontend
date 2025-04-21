import '@/app/styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100">
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
        </body>
    </html>
  );
}