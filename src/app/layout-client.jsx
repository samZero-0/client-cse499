import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            {/* The ChatBot sits here, on top of everything */}
            
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}