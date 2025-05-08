// pages/charts.tsx
import { useEffect, useState } from 'react';
import Script from 'next/script';

const cryptoOptions = [
  { label: 'Bitcoin (BTC)', symbol: 'BINANCE:BTCUSDT' },
  { label: 'Ethereum (ETH)', symbol: 'BINANCE:ETHUSDT' },
  { label: 'BNB (BNB)', symbol: 'BINANCE:BNBUSDT' },
  { label: 'Tether (USDT)', symbol: 'BINANCE:USDTUSD' }
  // (KRT could be added here if it had a TradingView symbol or custom chart data)
];

const ChartsPage: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(cryptoOptions[0].symbol);

  // This effect runs whenever the selectedSymbol changes and renders the TradingView widget
  useEffect(() => {
    // Ensure TradingView script is loaded
    if (!(window as any).TradingView) return;
    // Clear any existing widget
    const container = document.getElementById('tv-chart-container');
    if (container) container.innerHTML = '';
    // Create a new TradingView chart widget
    new (window as any).TradingView.widget({
      container_id: 'tv-chart-container',
      autosize: true,
      symbol: selectedSymbol,
      interval: 'D',         // daily candles by default
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',           // 1 = candlestick
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      hide_legend: false,
      save_image: false,
      studies: ['BB@tv-basicstudies'], // example: Bollinger Bands
      chart_type: 'candlesticks'
    });
  }, [selectedSymbol]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">Cryptocurrency Charts</h1>
      {/* Symbol selection dropdown */}
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
      {/* TradingView chart container */}
      <div id="tv-chart-container" className="h-[500px] w-full bg-white/5 rounded-md overflow-hidden" />
      {/* Include TradingView widget script */}
      <Script src="https://s3.tradingview.com/tv.js" strategy="lazyOnload" />
    </div>
  );
};

export default ChartsPage;
