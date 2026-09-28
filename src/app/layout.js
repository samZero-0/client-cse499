import { Manrope } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Footer from '@/components/common/Footer';
import ChatBot from '@/components/ai/ChatBot';
import { Toaster } from 'react-hot-toast';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata = {
  title: 'PantryPal - Smart Grocery & Waste Reduction',
  description: 'Manage your pantry, reduce waste, and automate your grocery subscriptions.',
};

// Applies the saved (or system) theme before first paint to avoid a flash.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${manrope.className} min-h-screen flex flex-col bg-canvas text-ink`}>
        <AuthProvider>
          <CartProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--surface)',
                  color: 'var(--ink)',
                  border: '1px solid var(--line)',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(17, 23, 19, 0.12)',
                },
                success: {
                  iconTheme: {
                    primary: '#37493D',
                    secondary: '#E1E7B1',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#B4543A',
                    secondary: '#fff',
                  },
                },
              }}
            />
            {children}
            <Footer />
            <ChatBot />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
