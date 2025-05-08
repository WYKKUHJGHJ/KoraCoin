// pages/swap.tsx
import { useState } from 'react';
import { ethers } from 'ethers';

type TokenOption = {
  symbol: string;
  address: string;
  decimals: number;
};

// Define some token options (on Ethereum mainnet)
const TOKENS: TokenOption[] = [
  { symbol: 'KRT', address: '0x...KRT_CONTRACT_ADDRESS...', decimals: 18 },  // placeholder address
  { symbol: 'ETH', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', decimals: 18 }, // 1inch uses 0xEeee for native ETH
  { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
  { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals: 6 }
];

const SwapPage: React.FC = () => {
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [amount, setAmount] = useState<string>('');
  const [account, setAccount] = useState<string | null>(null);
  const [quote, setQuote] = useState<{ toTokenAmount: string } | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  // Connect MetaMask wallet
  const connectWallet = async () => {
    if (!(window as any).ethereum) {
      alert('MetaMask is not installed');
      return;
    }
    try {
      const accounts: string[] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length) {
        setAccount(accounts[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch quote from 1inch API
  const getQuote = async () => {
    setQuote(null);
    if (!amount || isNaN(Number(amount))) {
      alert('Enter a valid amount');
      return;
    }
    try {
      // Convert amount to base units (wei or smallest token unit)
      const amountBN = ethers.parseUnits(amount, fromToken.decimals);
      const url = `https://api.1inch.io/v5.0/1/quote?fromTokenAddress=${fromToken.address}&toTokenAddress=${toToken.address}&amount=${amountBN.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      setQuote(data);
    } catch (err) {
      console.error('Quote error:', err);
      alert('Failed to fetch quote. Please try again.');
    }
  };

  // Execute swap via 1inch API -> MetaMask
  const executeSwap = async () => {
    if (!account) {
      alert('Connect your wallet first.');
      return;
    }
    if (!amount) {
      alert('Enter an amount to swap.');
      return;
    }
    try {
      setTxStatus('pending');
      const amountBN = ethers.parseUnits(amount, fromToken.decimals);
      const swapUrl = `https://api.1inch.io/v5.0/1/swap?fromTokenAddress=${fromToken.address}&toTokenAddress=${toToken.address}&amount=${amountBN.toString()}&fromAddress=${account}&slippage=1`;
      const res = await fetch(swapUrl);
      const swapData = await res.json();
      if (swapData.tx) {
        // Send transaction via MetaMask
        const txParams = {
          from: swapData.tx.from,
          to: swapData.tx.to,
          data: swapData.tx.data,
          value: swapData.tx.value || '0x0'
        };
        await (window as any).ethereum.request({
          method: 'eth_sendTransaction',
          params: [txParams]
        });
        setTxStatus('success');
      } else {
        throw new Error(swapData.description || 'Swap API error');
      }
    } catch (err) {
      console.error('Swap error:', err);
      setTxStatus('failed');
      alert('Swap transaction failed or was rejected.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Token Swap</h1>
      {/* Wallet Connection */}
      <div className="mb-4">
        {account ? (
          <div className="text-green-400">Connected: {account.substring(0, 6)}...{account.slice(-4)}</div>
        ) : (
          <button onClick={connectWallet} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
            Connect Wallet
          </button>
        )}
      </div>
      {/* Swap Form */}
      <div className="bg-white/5 p-4 rounded-md backdrop-blur">
        <div className="mb-3">
          <label className="block font-medium mb-1">From:</label>
          <select 
            className="w-full bg-gray-800 border border-gray-700 p-2 rounded mb-2"
            value={fromToken.symbol} 
            onChange={e => setFromToken(TOKENS.find(t => t.symbol === e.target.value)!)}
          >
            {TOKENS.map(token => (
              <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
            ))}
          </select>
          <input 
            type="number" 
            placeholder="Amount" 
            className="w-full bg-gray-800 border border-gray-700 p-2 rounded" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium mb-1">To:</label>
          <select 
            className="w-full bg-gray-800 border border-gray-700 p-2 rounded"
            value={toToken.symbol} 
            onChange={e => setToToken(TOKENS.find(t => t.symbol === e.target.value)!)}
          >
            {TOKENS.map(token => (
              <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={getQuote} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-2"
        >
          Get Quote
        </button>
        {quote && (
          <div className="text-sm text-gray-200 mb-2">
            1 {fromToken.symbol} ≈ {(Number(quote.toTokenAmount) / 10 ** toToken.decimals / Number(amount)).toFixed(6)} {toToken.symbol} 
            <br/>
            You&apos;ll receive ~ <span className="font-semibold">
            {(Number(quote.toTokenAmount) / 10 ** toToken.decimals).toFixed(6)} {toToken.symbol}
            </span>
          </div>
        )}
        <button 
          onClick={executeSwap} 
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          disabled={!quote || !account}
        >
          Swap
        </button>
        {txStatus === 'pending' && <p className="text-yellow-400 mt-2">Transaction pending... confirm in your wallet.</p>}
        {txStatus === 'success' && <p className="text-green-400 mt-2">Swap successful!</p>}
        {txStatus === 'failed' && <p className="text-red-500 mt-2">Swap failed.</p>}
      </div>
    </div>
  );
};

export default SwapPage;
