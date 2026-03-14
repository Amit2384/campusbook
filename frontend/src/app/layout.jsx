import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'CampusBook - Old Book Resell & Rental System',
  description: 'Buy, sell, and rent books on campus easily.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-white border-t py-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} CampusBook. All rights reserved.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
