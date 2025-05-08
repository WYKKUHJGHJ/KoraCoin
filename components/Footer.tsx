// components/Footer.tsx
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/10 backdrop-blur mt-8">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-sm text-gray-200">
        <span>© 2025 KoraNet. All rights reserved.</span>
        <div className="space-x-4">
          {/* Placeholder social links */}
          <Link href="#"><a className="hover:text-white">Twitter</a></Link>
          <Link href="#"><a className="hover:text-white">Discord</a></Link>
          <Link href="#"><a className="hover:text-white">GitHub</a></Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
