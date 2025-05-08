// components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';

const Header: React.FC = () => {
  return (
    <header className="backdrop-blur bg-white/10 border-b border-white/20 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="text-2xl font-bold">KoraNet <span className="text-indigo-200">KRT</span></div>
        {/* Navigation Links */}
        <ul className="flex space-x-8 text-lg">
          <li><Link href="/"><a className="hover:text-indigo-300">Home</a></Link></li>
          <li><Link href="/tokens"><a className="hover:text-indigo-300">Tokens</a></Link></li>
          <li><Link href="/charts"><a className="hover:text-indigo-300">Charts</a></Link></li>
          <li><Link href="/swap"><a className="hover:text-indigo-300">Swap</a></Link></li>
          <li><Link href="/rankings"><a className="hover:text-indigo-300">Rankings</a></Link></li>
          <li><Link href="/blockchain"><a className="hover:text-indigo-300">Blockchain</a></Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
