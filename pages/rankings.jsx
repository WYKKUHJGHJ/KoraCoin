const RankingsPage = ({ topByMarketCap, topByVolume, topExchanges }) => {
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
        Data source: CoinGecko API (updated every few minutes)
      </p>
    </div>
  );
};

export async function getStaticProps() {
  const res1 = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1');
  const coinsByCap = await res1.json();

  const res2 = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=10&page=1');
  const coinsByVol = await res2.json();

  const res3 = await fetch('https://api.coingecko.com/api/v3/exchanges?per_page=5&page=1');
  const exchanges = await res3.json();

  const btc = coinsByCap.find(c => c.name.toLowerCase() === 'bitcoin');
  const btcPrice = btc?.market_cap / btc?.total_volume || 0;

  const topExchanges = exchanges.map(exch => {
    const volumeBTC = exch.trade_volume_24h_btc || 0;
    return {
      name: exch.name,
      volumeUSD: volumeBTC * btcPrice
    };
  });

  return {
    props: {
      topByMarketCap: coinsByCap,
      topByVolume: coinsByVol,
      topExchanges
    },
    revalidate: 300
  };
}

export default RankingsPage;
