'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
}

interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  rateUsd: string;
}

const Home: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [units, setUnits] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);

  const fetchCryptoData = async () => {
    try {
      const response = await axios.get('https://api.coincap.io/v2/assets?limit=5');
      setCryptoData(response.data.data);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    }
  };

  const fetchCryptoPrices = async () => {
    try {
      const response = await axios.get('https://api.coincap.io/v2/rates');
      setCryptoPrices(response.data.data);
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
    }
  };

  const handleBuy = () => {
    // Implement logic to handle the purchase, save transaction to the database
    console.log(`Buying ${units} units of ${selectedCrypto}`);

    // Show the modal
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
    }, 5000); // 5000 milliseconds (5 seconds) in this example
  };

  useEffect(() => {
    fetchCryptoData();
    const cryptoDataInterval = setInterval(fetchCryptoData, 60000);

    fetchCryptoPrices();
    const cryptoPricesInterval = setInterval(fetchCryptoPrices, 5000);

    return () => {
      clearInterval(cryptoDataInterval);
      clearInterval(cryptoPricesInterval);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-300">
      <div className="max-w-md p-6 bg-white rounded-md shadow-md text-black mr-4">
        <h1 className="text-3xl font-bold mb-6">Crypto Portfolio App</h1>
        <div className="mb-4">
          <label htmlFor="cryptoSelect" className="block text-sm font-medium">
            Select a cryptocurrency
          </label>
          <select
            id="cryptoSelect"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            onChange={(e) => setSelectedCrypto(e.target.value)}
          >
            <option value="" disabled selected>
              Select a cryptocurrency
            </option>
            {cryptoData.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="unitsInput" className="block text-sm font-medium">
            Enter units
          </label>
          <input
            type="number"
            id="unitsInput"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter units"
            onChange={(e) => setUnits(Number(e.target.value))}
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          onClick={handleBuy}
        >
          Buy
        </button>
      </div>

      {/* Crypto Prices Container */}
      <div className="max-w-md p-6 bg-white rounded-md shadow-md text-black">
        <h2 className="text-xl font-semibold mb-4">Top 5 Crypto Prices</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Symbol</th>
              <th className="py-2 px-4 border-b">Price (USD)</th>
            </tr>
          </thead>
          <tbody>
            {cryptoPrices.slice(0, 5).map((crypto) => (
              <tr key={crypto.id}>
                <td className="py-2 px-4 border-b">{crypto.id}</td>
                <td className="py-2 px-4 border-b">{crypto.symbol}</td>
                <td className="py-2 px-4 border-b" >{Number(crypto.rateUsd).toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="z-10 bg-white p-6 rounded-md shadow-md text-black">
            <p className="text-xl font-semibold mb-4">Order Confirmed!</p>
            <p>Your order has been successfully processed.</p>
            <button
              className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

