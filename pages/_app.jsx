// pages/_app.tsx
import type { AppProps } from 'next/app';
import '../styles/globals.css';   // Import Tailwind CSS styles
import Header from '../components/Header';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header Navigation Bar */}
      <Header />
      {/* Main page content */}
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default MyApp;
