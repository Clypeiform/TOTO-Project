// src/components/InputForm.js
import React, { useState } from 'react';

function InputForm({ calculateProfitability }) {
  const [jackpot, setJackpot] = useState('');
  const [system, setSystem] = useState('');
  const [drawType, setDrawType] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (jackpot && system && drawType) {
      calculateProfitability(jackpot, system, drawType);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="number" 
        placeholder="Enter Jackpot Amount" 
        value={jackpot}
        onChange={(e) => setJackpot(e.target.value)}
        style={{ padding: '8px', fontSize: '16px' }}
      />
      <select 
        value={system}
        onChange={(e) => setSystem(e.target.value)}
        style={{ padding: '8px', fontSize: '16px' }}
      >
        <option value="" disabled>Select System Type</option>
        {Array.from({ length: 7 }, (_, i) => `System ${i + 6}`).map(systemOption => (
          <option key={systemOption} value={systemOption}>
            {systemOption}
          </option>
        ))}
      </select>
      <select 
        value={drawType}
        onChange={(e) => setDrawType(e.target.value)}
        style={{ padding: '8px', fontSize: '16px' }}
      >
        <option value="" disabled>Select Draw Type</option>
        <option value="normal">Normal</option>
        <option value="snowball">Snowball</option>
        <option value="cascade">Cascade</option>
        <option value="CNY">CNY</option>
      </select>
      <button type="submit" style={{ padding: '10px', fontSize: '16px' }}>Calculate</button>
    </form>
  );
}

export default InputForm;