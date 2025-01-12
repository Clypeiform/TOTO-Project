import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ProfitabilityTable from './components/ProfitabilityTable';
import './App.css';

function App() {
  const [profitabilityData, setProfitabilityData] = useState(null);
  const [error, setError] = useState(null);

  const calculateProfitability = async (jackpot, systemType, drawType) => {
    try {
      const response = await fetch('http://localhost:5000/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jackpot, systemType, drawType })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data); // Log data to check its structure

      // Ensure data is an array
      setProfitabilityData(Array.isArray(data) ? data : [data]);
      setError(null);
    } catch (error) {
      console.error('Error fetching profitability data:', error);
      setError(error.message);
    }
  };

  return (
    <div className="App">
      <h1>TOTO Profitability Calculator</h1>
      <InputForm calculateProfitability={calculateProfitability} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ProfitabilityTable data={profitabilityData} />
      {/* Add the text box directly */}
      <div className="text-box">
          This site is a work in progress, and is intended for demonstrating some System Design principles. Please don't gamble, the house always wins :DD
        </div>
    </div>
  );
}

export default App;