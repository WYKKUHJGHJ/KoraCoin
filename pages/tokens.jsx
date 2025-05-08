import Image from 'next/image';

const TokensPage = ({ tokens }) => {
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
            const changeColor = coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400';
            const priceFmt = coin.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6 });
            const volFmt = coin.total_volume.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

            let sparklinePoints = '';
            if (coin.sparkline_in_7d?.price) {
              const prices = coin.sparkline_in_7d.price;
              const minP = Math.min(...prices);
              const maxP = Math.max(...prices);
              sparklinePoints = prices.map((p, i) => {
                const x = (i / (prices.length - 1)) * 100;
                const y = 100 - ((p - minP) / (maxP - minP || 1)) * 100;
                return `${x},${y}`;
              }).join(' ');
            }

            return (
              <tr key={coin.id} className="border-b border-white/10 last:border-none">
                <td className="py-3 px-4 flex items-center space-x-2">
                  <Image src={`/images/${coin.symbol.toLowerCase()}.png`} alt={coin.name} width={24} height={24} />
                  <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                </td>
                <td className="py-3 px-4 text-right">{priceFmt}</td>
                <td className={`py-3 px-4 text-right ${changeColor}`}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td className="py-3 px-4 text-right">{volFmt}</td>
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

export async function getStaticProps() {
  const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin&order=market_cap_desc&sparkline=true';
  const res = await fetch(apiUrl);
  const data = await res.json();

  const krtToken = {
    id: 'kora-net',
    symbol: 'krt',
    name: 'Kora Net',
    current_price: 1.00,
    price_change_percentage_24h: 0.0,
    total_volume: 0,
    sparkline_in_7d: { price: [1, 1, 1, 1, 1, 1, 1] }
  };

  const tokens = [krtToken, ...data];

  return {
    props: { tokens },
    revalidate: 60
  };
}

export default TokensPage;
