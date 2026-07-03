import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'CampusBook - Old Book Resell & Rental System',
  description: 'Buy, sell, and rent books on campus easily.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.botpressWebChat.init({
                configUrl: 'https://files.bpcontent.cloud/2026/07/03/10/20260703105214-HZ9G06I8.json'
              });
            `
          }}
        />
      </head>
      <body className="bg-gray-50 flex flex-col min-h-screen">
        <AuthProvider>
          <CartProvider>
            <Toaster position="top-center" />
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-white border-t py-8 text-center text-gray-500">
              <p>&copy; {new Date().getFullYear()} CampusBook. All rights reserved.</p>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
