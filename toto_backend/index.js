// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Mock data: Replace with actual logic
const ticketSystems = [
  { ticketSystem: 'System 6', cost: 1, odds1: 0.00000007151123842, odds2: 0.0000004290674305, odds3: 0.00001802083208, odds4: 0.0000450520802, odds5: 0.0009235676442, odds6: 0.001231423526, odds7: 0.01641898034 },
  { ticketSystem: 'System 7', cost: 7, odds0: 0.00000001164136439, odds1: 0.0000005005786689, odds2: 0.000002933623827, odds3: 0.00006013928846, odds4: 0.0001503482211, odds5: 0.002004642949, odds6: 0.002672857265, odds7: 0.02606035833 },
  { ticketSystem: 'System 8', cost: 28, odds0: 0.00000009534831789, odds1: 0.000002002314676, odds2: 0.00001145510256, odds3: 0.0001527347008, odds4: 0.0003818367521, odds5: 0.003722908333, odds6: 0.004963877778, odds7: 0.03772547111 },
  { ticketSystem: 'System 9', cost: 84, odds0: 0.0000004395324898, odds1: 0.000006006944027, odds2: 0.00003352712945, odds3: 0.0003268895122, odds4: 0.0008172237805, odds5: 0.006210900731, odds6: 0.008281200975, odds7: 0.05106740601 },
  { ticketSystem: 'System 10', cost: 210, odds0: 0.000001501736007, odds1: 0.00001501736007, odds2: 0.00008172237805, odds3: 0.0006210900731, odds4: 0.001552725183, odds5: 0.009575138628, odds6: 0.0127668515, odds7: 0.06565809345 },
  { ticketSystem: 'System 11', cost: 462, odds0: 0.00000423566566, odds1: 0.00003303819215, odds2: 0.0001751792514, odds3: 0.00108027205, odds4: 0.002700680126, odds5: 0.01388921208, odds6: 0.01851894943, odds7: 0.08102040377 },
  { ticketSystem: 'System 12', cost: 924, odds0: 0.00001043311331, odds1: 0.0000660763843, odds2: 0.0003411385422, odds3: 0.001754426788, odds4: 0.004386066971, odds5: 0.019189043, odds6: 0.02558539067, odds7: 0.09665592029},
  // More systems here
];

// Function to calculate theoretical share prize 
const calculateSharePrize = (jackpot, drawType) => {
    // Variables for the share count winning within each group
    let totalShareCount = 0;
    if (drawType == 'CNY'){
      totalShareCount = -18600000 + 1200000 * Math.log(jackpot);
    }
    else{
      totalShareCount = 71682 + 0.0252 * jackpot + 0.00000000349 * jackpot ** 2 + 0.000000000000000159 * jackpot ** 3;
    }
    
    const shareCount1 = Math.round(totalShareCount * 0.000003819165739);
    const shareCount2 = Math.round(totalShareCount * 0.00002084295897);
    const shareCount3 = Math.round(totalShareCount * 0.000938896616);
    const shareCount4 = Math.round(totalShareCount * 0.002387717394);
    const shareCount5 = Math.round(totalShareCount * 0.04872627281);
    const shareCount6 = Math.round(totalShareCount * 0.0661075446);
    const shareCount7 = Math.round(totalShareCount * 0.8818149065);
    
    // Variables for dealing with snowball / cascade cases
    const estimatedTotalSales = 54 * totalShareCount;
    const newPrizePool = 0.54 * estimatedTotalSales;
    
    // Variables for the amount won by each share in each group
    const sharePrize1 = jackpot / Math.max(1, shareCount1);
    let sharePrize2 = 0;
    let sharePrize3 = 0;
    let sharePrize4 = 0;
    const sharePrize5 = 50;
    const sharePrize6 = 25;
    const sharePrize7 = 10;
  
    if (drawType == 'normal' || drawType == 'CNY'){
      sharePrize2 = 0.08 * (50 / 19) * jackpot / shareCount2;
      sharePrize3 = 0.055 * (50 / 19) * jackpot / shareCount3;
      sharePrize4 = 0.03 * (50 / 19) * jackpot / shareCount4;
    }
    else if (drawType == 'snowball' || drawType == 'cascade'){
      sharePrize2 = 0.08 * newPrizePool / shareCount2;
      sharePrize3 = 0.055 * newPrizePool/ shareCount3;
      sharePrize4 = 0.03 * newPrizePool / shareCount4
    }
    

    // Return all share counts and share prizes
    return {
        totalShareCount,
        shareCounts: {
            shareCount1,
            shareCount2,
            shareCount3,
            shareCount4,
            shareCount5,
            shareCount6,
            shareCount7,
        },
        sharePrizes: {
            sharePrize1,
            sharePrize2,
            sharePrize3,
            sharePrize4,
            sharePrize5,
            sharePrize6,
            sharePrize7,
        }
    };
}

// Function to calculate profitability  
// NOTE: The calculated revenue still seems to be a little wrong for all the systems
const calculateProfitability = (jackpot, system, drawType) => {
  const result = calculateSharePrize(jackpot, drawType);
  if (system.ticketSystem == 'System 6'){
    const prize1 = result.sharePrizes.sharePrize1;
    const prize2 = result.sharePrizes.sharePrize2;
    const prize3 = result.sharePrizes.sharePrize3;
    const prize4 = result.sharePrizes.sharePrize4;
    const prize5 = result.sharePrizes.sharePrize5;
    const prize6 = result.sharePrizes.sharePrize6;
    const prize7 = result.sharePrizes.sharePrize7;

    const expectedRev1 = system.odds1 * prize1;
    const expectedRev2 = system.odds2 * prize2;
    const expectedRev3 = system.odds3 * prize3;
    const expectedRev4 = system.odds4 * prize4;
    const expectedRev5 = system.odds5 * prize5;
    const expectedRev6 = system.odds6 * prize6;
    const expectedRev7 = system.odds7 * prize7;
    const totalRev = expectedRev1 + expectedRev2 + expectedRev3 + expectedRev4 + expectedRev5 + expectedRev6 + expectedRev7;

    return totalRev / system.cost;
  }
  else if (system.ticketSystem == 'System 7'){
    const prize0 = result.sharePrizes.sharePrize1 + 6 * result.sharePrizes.sharePrize2;
    const prize1 = result.sharePrizes.sharePrize1 + 6 * result.sharePrizes.sharePrize3;
    const prize2 = result.sharePrizes.sharePrize2 + result.sharePrizes.sharePrize3 + 5 * result.sharePrizes.sharePrize4;
    const prize3 = 2 * result.sharePrizes.sharePrize3 + 5 * result.sharePrizes.sharePrize5;
    const prize4 = 2 * result.sharePrizes.sharePrize4 + result.sharePrizes.sharePrize5 + 4 * result.sharePrizes.sharePrize6;
    const prize5 = 190;
    const prize6 = 85;
    const prize7 = 40;

    const expectedRev0 = system.odds0 * prize0;
    const expectedRev1 = system.odds1 * prize1;
    const expectedRev2 = system.odds2 * prize2;
    const expectedRev3 = system.odds3 * prize3;
    const expectedRev4 = system.odds4 * prize4;
    const expectedRev5 = system.odds5 * prize5;
    const expectedRev6 = system.odds6 * prize6;
    const expectedRev7 = system.odds7 * prize7;
    const totalRev = expectedRev0 + expectedRev1 + expectedRev2 + expectedRev3 + expectedRev4 + expectedRev5 + expectedRev6 + expectedRev7;

    return totalRev / system.cost;
  }
  else if (system.ticketSystem == 'System 8'){
    const prize0 = result.sharePrizes.sharePrize1 + 6 * result.sharePrizes.sharePrize2 + 6 * result.sharePrizes.sharePrize3 + 15 * result.sharePrizes.sharePrize4;
    const prize1 = result.sharePrizes.sharePrize1 + 12 * result.sharePrizes.sharePrize3 + 15 * result.sharePrizes.sharePrize5;
    const prize2 = result.sharePrizes.sharePrize2 + 2 * result.sharePrizes.sharePrize3 + 10 * result.sharePrizes.sharePrize4 + 5 * result.sharePrizes.sharePrize5 + 10 * result.sharePrizes.sharePrize6;
    const prize3 = 3 * result.sharePrizes.sharePrize3 + 15 * result.sharePrizes.sharePrize5 + 10 * result.sharePrizes.sharePrize7;
    const prize4 = 3 * result.sharePrizes.sharePrize4 + 490;
    const prize5 = 460;
    const prize6 = 190;
    const prize7 = 100;

    const expectedRev0 = system.odds0 * prize0;
    const expectedRev1 = system.odds1 * prize1;
    const expectedRev2 = system.odds2 * prize2;
    const expectedRev3 = system.odds3 * prize3;
    const expectedRev4 = system.odds4 * prize4;
    const expectedRev5 = system.odds5 * prize5;
    const expectedRev6 = system.odds6 * prize6;
    const expectedRev7 = system.odds7 * prize7;
    const totalRev = expectedRev0 + expectedRev1 + expectedRev2 + expectedRev3 + expectedRev4 + expectedRev5 + expectedRev6 + expectedRev7;

    return totalRev / system.cost;
  }
  // Still need to add the conditions for system 9 through 12

};

app.post('/api/calculate', (req, res) => {
  try {
      const { jackpot, systemType, drawType } = req.body;

      // Find the requested system
      const system = ticketSystems.find(s => s.ticketSystem === systemType);

      if (!system) {
          return res.status(400).json({ error: 'Invalid system type' });
      }

      // Calculate profitability for the requested system
      const profitabilityRatio = calculateProfitability(jackpot, system, drawType);

      // Calculate the share prize distribution for requested jackpot size 
      const sharePrizeResult = calculateSharePrize(jackpot, drawType);

      res.json({
          ...sharePrizeResult,  // Spread the entire share prize result
          ticketSystem: system.ticketSystem,
          profitabilityRatio
      });
  } catch (error) {
      res.status(500).json({ error: 'Server error' });
  }
});





const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
