import Image from 'next/image';

const HomePage = () => {
  return (
    <div className="relative flex items-center justify-center min-h-[80vh] bg-[url('/images/hero-bg.jpg')] bg-cover bg-center">
      {/* Overlay backdrop */}
      <div className="bg-white/20 backdrop-blur-md rounded-xl p-10 max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold mb-6">Kora Net (KRT)</h1>
        <p className="text-xl mb-6">
          Welcome to <strong>KoraNet</strong> – an innovative cryptocurrency powering the next generation of DeFi solutions. 
          Discover our features, track live market data, and swap tokens seamlessly.
        </p>
        <a href="/swap" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold px-6 py-3 rounded-md">
          Get KRT Now
        </a>
      </div>
    </div>
  );
};

export default HomePage;
