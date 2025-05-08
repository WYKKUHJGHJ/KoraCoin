// pages/tokens.tsx
import { GetStaticProps } from 'next';
import Image from 'next/image';

type TokenInfo = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  sparkline_in_7d?: { price: number[] };
};

type TokensPageProps = {
  tokens: TokenInfo[];
};

const TokensPage: React.FC<TokensPageProps> = ({ tokens }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Cryptocurrency Prices</h1>
      <table className="min-w-full bg-white/5 backdrop-blur-md rounded-lg overflow-hidden">
        <thead className="bg-white/10">
          <tr>
            <th className="text-left py-3 px-4">Token</th>
            <th className="text-right py-3 px-4">Price (USD)</th>
            <th className="text-right py-3 px-4">24h Change</th>
            <th className="text-right py-3 px-4">24h Volume</th>
            <th className="text-right py-3 px-4">Last 7d</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((coin) => {
            // Determine color class for 24h change
            const changeColor = coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400';
            // Format numbers
            const priceFmt = coin.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6 });
            const volFmt = coin.total_volume.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
            // Prepare sparkline points if available
            let sparklinePoints = "";
            if (coin.sparkline_in_7d?.price) {
              const prices = coin.sparkline_in_7d.price;
              const minP = Math.min(...prices);
              const maxP = Math.max(...prices);
              sparklinePoints = prices.map((p, i) => {
                const x = (i / (prices.length - 1)) * 100;
                const y = 100 - ((p - minP) / (maxP - minP || 1)) * 100;
                return `${x},${y}`;
              }).join(" ");
            }
            return (
              <tr key={coin.id} className="border-b border-white/10 last:border-none">
                {/* Token name and icon */}
                <td className="py-3 px-4 flex items-center space-x-2">
                  <Image src={`/images/${coin.symbol.toLowerCase()}.png`} alt={coin.name} width={24} height={24} />
                  <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                </td>
                {/* Price */}
                <td className="py-3 px-4 text-right">{priceFmt}</td>
                {/* 24h Change */}
                <td className={`py-3 px-4 text-right ${changeColor}`}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                {/* 24h Volume */}
                <td className="py-3 px-4 text-right">{volFmt}</td>
                {/* Sparkline chart */}
                <td className="py-3 px-4 text-right">
                  {sparklinePoints ? (
                    <svg width="100" height="30" viewBox="0 0 100 100">
                      <polyline 
                        fill="none" 
                        stroke="#4ADE80" 
                        strokeWidth="2" 
                        points={sparklinePoints} 
                        vectorEffect="non-scaling-stroke" />
                    </svg>
                  ) : (
                    <span className="text-gray-400">–</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Fetch token data at build time
export const getStaticProps: GetStaticProps<TokensPageProps> = async () => {
  // CoinGecko API for selected tokens (BTC, ETH, USDT, BNB)
  const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin&order=market_cap_desc&sparkline=true';
  const res = await fetch(apiUrl);
  const data: TokenInfo[] = await res.json();

  // Add KRT as a custom token (dummy data, since KRT might not be on CoinGecko yet)
  const krtToken: TokenInfo = {
    id: 'kora-net',
    symbol: 'krt',
    name: 'Kora Net',
    current_price: 1.00,
    price_change_percentage_24h: 0.0,
    total_volume: 0,
    sparkline_in_7d: { price: [1, 1, 1, 1, 1, 1, 1] }  // flat placeholder sparkline
  };
  const tokens = [krtToken, ...data];

  return {
    props: { tokens },
    revalidate: 60  // re-generate page at most every 60 seconds for fresh data
  };
};

export default TokensPage;
