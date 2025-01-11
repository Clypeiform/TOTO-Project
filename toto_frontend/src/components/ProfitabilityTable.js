// src/components/ProfitabilityTable.js
import React from 'react';

function ProfitabilityTable({ data }) {
  if (!data) return null;

  return (
    <table>
      <thead>
        <tr>
          <th>Ticket System</th>
          <th>Profitability Ratio</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.ticketSystem}</td>
            <td>{item.profitabilityRatio}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProfitabilityTable;
