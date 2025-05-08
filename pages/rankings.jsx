// pages/rankings.tsx
import { GetStaticProps } from 'next';

type CoinData = { name: string; market_cap: number; total_volume: number };
type ExchangeData = { name: string; trade_volume_24h_btc: number };

type RankingsPageProps = {
  topByMarketCap: CoinData[];
  topByVolume: CoinData[];
  topExchanges: { name: string; volumeUSD: number }[];
};

const RankingsPage: React.FC<RankingsPageProps> = ({ topByMarketCap, topByVolume, topExchanges }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Crypto Market Rankings</h1>

      {/* Top Cryptocurrencies by Market Cap */}
      <h2 className="text-xl font-semibold mb-2">🔝 Top 10 Cryptocurrencies by Market Cap</h2>
      <ol className="list-decimal list-inside mb-6">
        {topByMarketCap.map((coin, idx) => (
          <li key={idx} className="mb-1">
            {coin.name} – {coin.market_cap.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
          </li>
        ))}
      </ol>

      {/* Top Cryptocurrencies by 24h Volume */}
      <h2 className="text-xl font-semibold mb-2">💵 Top 10 by 24h Trading Volume</h2>
      <ol className="list-decimal list-inside mb-6">
        {topByVolume.map((coin, idx) => (
          <li key={idx} className="mb-1">
            {coin.name} – {coin.total_volume.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
          </li>
        ))}
      </ol>

      {/* Top Exchanges by Volume */}
      <h2 className="text-xl font-semibold mb-2">🏦 Top 5 Exchanges by 24h Volume</h2>
      <ol className="list-decimal list-inside mb-4">
        {topExchanges.map((exch, idx) => (
          <li key={idx} className="mb-1">
            {exch.name} – {exch.volumeUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
          </li>
        ))}
      </ol>
      <p className="text-sm text-gray-400">
        Data source: CoinGecko API [oai_citation:24‡algotrading101.com](https://algotrading101.com/learn/coingecko-api-guide/#:~:text=The%20CoinGecko%20API%20allows%20us,data%20from%20CoinGecko%20using%20code) (updated every few minutes)
      </p>
    </div>
  );
};

export const getStaticProps: GetStaticProps<RankingsPageProps> = async () => {
  // Fetch top 10 coins by market cap
  const res1 = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1');
  const coinsByCap: CoinData[] = await res1.json();
  // Fetch top 10 coins by 24h volume
  const res2 = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=10&page=1');
  const coinsByVol: CoinData[] = await res2.json();
  // Fetch top 5 exchanges by volume (CoinGecko returns volume in BTC)
  const res3 = await fetch('https://api.coingecko.com/api/v3/exchanges?per_page=5&page=1');
  const exchanges: ExchangeData[] = await res3.json();
  // Get current BTC price (to convert BTC volume to USD)
  const btcPrice = coinsByCap.find(c => c.name.toLowerCase() === 'bitcoin')?.market_cap / coinsByCap.find(c => c.name.toLowerCase() === 'bitcoin')?.total_volume!;
  // Alternatively, for accuracy we could call /simple/price for BTC, but this approximation suffices.

  const topExchanges = exchanges.map(exch => {
    const volumeBTC = exch.trade_volume_24h_btc || 0;
    return {
      name: exch.name,
      volumeUSD: volumeBTC * (btcPrice || 0)
    };
  });

  return {
    props: {
      topByMarketCap: coinsByCap,
      topByVolume: coinsByVol,
      topExchanges
    },
    revalidate: 300  // update every 5 minutes
  };
};

export default RankingsPage;
