import React, { useState } from 'react';
import InputForm from './components/InputForm';
import './App.css';

function App() {
  const [profitabilityData, setProfitabilityData] = useState(null);
  const [error, setError] = useState(null);

  const calculateProfitability = async (jackpot, systemType, drawType) => {
    try {
      const response = await fetch('http://localhost:5000/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jackpot, systemType, drawType }),
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
      
      <div className="fixed-height-container">
        {(!profitabilityData || profitabilityData.length === 0) ? (
          <p className="no-data-message">No data available</p>
        ) : (
          <div className="profitability-table">
            <table>
              <thead>
                {profitabilityData.map((entry, index) => (
                    <tr key={index}>
                      <td colSpan="3" className="total-shares">
                        Total Share Count: {entry?.totalShareCount ?? 'N/A'}
                      </td>
                    </tr>
                  ))}
                <tr>
                  <th>Prize Group</th>
                  <th>Share Count</th>
                  <th>Share Prize</th>
                </tr>
              </thead>
              <tbody>
                
                {[1, 2, 3, 4, 5, 6, 7].map((group) => (
                  <tr key={group}>
                    <td>Prize Group {group}</td>
                    <td>
                      {profitabilityData[0]?.shareCounts?.[`shareCount${group}`] ?? 'N/A'}
                    </td>
                    <td>
                      {profitabilityData[0]?.sharePrizes?.[`sharePrize${group}`] !== undefined
                        ? `$${profitabilityData[0].sharePrizes[`sharePrize${group}`].toLocaleString()}`
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Add the text box directly */}
      <div className="text-box">
        This site is a work in progress, and is intended for demonstrating some System Design principles. Please don't gamble, the house always wins :D
      </div>
    </div>
  );
}

export default App;