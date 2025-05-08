import { useEffect, useState } from 'react';
import Script from 'next/script';

const cryptoOptions = [
  { label: 'Bitcoin (BTC)', symbol: 'BINANCE:BTCUSDT' },
  { label: 'Ethereum (ETH)', symbol: 'BINANCE:ETHUSDT' },
  { label: 'BNB (BNB)', symbol: 'BINANCE:BNBUSDT' },
  { label: 'Tether (USDT)', symbol: 'BINANCE:USDTUSD' }
];

const ChartsPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(cryptoOptions[0].symbol);

  useEffect(() => {
    if (!window.TradingView) return;

    const container = document.getElementById('tv-chart-container');
    if (container) container.innerHTML = '';

    new window.TradingView.widget({
      container_id: 'tv-chart-container',
      autosize: true,
      symbol: selectedSymbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      hide_legend: false,
      save_image: false,
      studies: ['BB@tv-basicstudies'],
      chart_type: 'candlesticks'
    });
  }, [selectedSymbol]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">Cryptocurrency Charts</h1>

      <div className="mb-4">
        <label className="mr-2 font-medium">Select Token:</label>
        <select
          className="bg-gray-800 border border-gray-700 p-2 rounded"
          value={selectedSymbol}
          onChange={e => setSelectedSymbol(e.target.value)}
        >
          {cryptoOptions.map(opt => (
            <option value={opt.symbol} key={opt.symbol}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div id="tv-chart-container" className="h-[500px] w-full bg-white/5 rounded-md overflow-hidden" />

      <Script src="https://s3.tradingview.com/tv.js" strategy="lazyOnload" />
    </div>
  );
};

export default ChartsPage;
