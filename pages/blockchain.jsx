// pages/blockchain.tsx
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

type NetworkStats = {
  block: number;
  tps: number;
  gasPrice: number;
  activeAddrs: number;
};

const BlockchainPage: React.FC = () => {
  const [ethStats, setEthStats] = useState<NetworkStats | null>(null);
  const [polyStats, setPolyStats] = useState<NetworkStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Ethereum Mainnet provider (using a public RPC endpoint)
        const ethProvider = new ethers.JsonRpcProvider('https://cloudflare-eth.com');
        const latestBlock = await ethProvider.getBlock('latest');
        const prevBlock = await ethProvider.getBlock(latestBlock.number - 1);
        const ethGasPrice = await ethProvider.getGasPrice();
        // Calculate simple TPS estimate from last block
        const ethBlockTime = latestBlock.timestamp - (prevBlock?.timestamp || latestBlock.timestamp);
        const ethTps = ethBlockTime > 0 ? (latestBlock.transactions.length / ethBlockTime) : 0;
        setEthStats({
          block: latestBlock.number,
          tps: parseFloat(ethTps.toFixed(2)),
          gasPrice: parseFloat(ethers.formatUnits(ethGasPrice, 'gwei')),
          activeAddrs: 500000  // placeholder for Ethereum daily active addresses
        });
      } catch (err) {
        console.error('Ethereum stats error:', err);
      }

      try {
        // Polygon Mainnet provider (public RPC)
        const polyProvider = new ethers.JsonRpcProvider('https://polygon-bor-rpc.publicnode.com');
        const latestBlock = await polyProvider.getBlock('latest');
        const prevBlock = await polyProvider.getBlock(latestBlock.number - 1);
        const polyGasPrice = await polyProvider.getGasPrice();
        const polyBlockTime = latestBlock.timestamp - (prevBlock?.timestamp || latestBlock.timestamp);
        const polyTps = polyBlockTime > 0 ? (latestBlock.transactions.length / polyBlockTime) : 0;
        setPolyStats({
          block: latestBlock.number,
          tps: parseFloat(polyTps.toFixed(2)),
          gasPrice: parseFloat(ethers.formatUnits(polyGasPrice, 'gwei')),
          activeAddrs: 500000  // placeholder for Polygon active addresses
        });
      } catch (err) {
        console.error('Polygon stats error:', err);
      }
    };

    fetchStats();
    // (Optionally, set an interval to refresh stats every X seconds)
  }, []);

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Blockchain Network Stats</h1>

      {/* Ethereum Network Stats */}
      <h2 className="text-xl font-semibold mb-2">🌐 Ethereum Network</h2>
      {ethStats ? (
        <ul className="mb-6">
          <li>Current Block: <span className="font-medium">{ethStats.block.toLocaleString()}</span></li>
          <li>Transactions/sec (approx): <span className="font-medium">{ethStats.tps.toFixed(2)}</span></li>
          <li>Avg Gas Price: <span className="font-medium">{ethStats.gasPrice.toFixed(2)} Gwei</span></li>
          <li>Active Addresses (24h): <span className="font-medium">{ethStats.activeAddrs.toLocaleString()}</span></li>
        </ul>
      ) : (
        <p className="mb-6">Loading Ethereum stats...</p>
      )}

      {/* Polygon Network Stats */}
      <h2 className="text-xl font-semibold mb-2">🌐 Polygon Network</h2>
      {polyStats ? (
        <ul>
          <li>Current Block: <span className="font-medium">{polyStats.block.toLocaleString()}</span></li>
          <li>Transactions/sec (approx): <span className="font-medium">{polyStats.tps.toFixed(2)}</span></li>
          <li>Avg Gas Price: <span className="font-medium">{polyStats.gasPrice.toFixed(2)} Gwei</span></li>
          <li>Active Addresses (24h): <span className="font-medium">{polyStats.activeAddrs.toLocaleString()}</span></li>
        </ul>
      ) : (
        <p>Loading Polygon stats...</p>
      )}
    </div>
  );
};

export default BlockchainPage;
