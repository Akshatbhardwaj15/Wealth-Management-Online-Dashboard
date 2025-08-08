const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const sampleHoldings = [
    { symbol: "RELIANCE", name: "Reliance Industries Ltd", quantity: 50, avgPrice: 2450.00, currentPrice: 2830.50, sector: "Energy", marketCap: "Large" },
    { symbol: "TCS", name: "Tata Consultancy Services", quantity: 75, avgPrice: 3200.00, currentPrice: 3850.25, sector: "Technology", marketCap: "Large" },
    { symbol: "HDFCBANK", name: "HDFC Bank Ltd", quantity: 100, avgPrice: 1500.00, currentPrice: 1475.80, sector: "Banking", marketCap: "Large" },
    { symbol: "INFY", name: "Infosys Limited", quantity: 120, avgPrice: 1450.00, currentPrice: 1650.75, sector: "Technology", marketCap: "Large" },
    { symbol: "ICICIBANK", name: "ICICI Bank Ltd", quantity: 150, avgPrice: 900.00, currentPrice: 1150.45, sector: "Banking", marketCap: "Large" },
    { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", quantity: 200, avgPrice: 850.00, currentPrice: 1215.90, sector: "Telecom", marketCap: "Large" },
    { symbol: "SBIN", name: "State Bank of India", quantity: 250, avgPrice: 500.00, currentPrice: 830.60, sector: "Banking", marketCap: "Large" },
    { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd", quantity: 40, avgPrice: 7000.00, currentPrice: 7250.00, sector: "Financial Services", marketCap: "Large" },
    { symbol: "DMART", name: "Avenue Supermarts Ltd", quantity: 60, avgPrice: 3800.00, currentPrice: 4850.50, sector: "Retail", marketCap: "Mid" },
    { symbol: "TATAMOTORS", name: "Tata Motors Ltd", quantity: 300, avgPrice: 650.00, currentPrice: 980.20, sector: "Automobile", marketCap: "Large" },
    { symbol: "ZOMATO", name: "Zomato Ltd", quantity: 500, avgPrice: 120.00, currentPrice: 185.75, sector: "Technology", marketCap: "Mid" },
    { symbol: "IRCTC", name: "Indian Railway Catering & Tourism Corp Ltd", quantity: 100, avgPrice: 750.00, currentPrice: 1010.30, sector: "Travel", marketCap: "Mid" },
    { symbol: "NYKAA", name: "FSN E-Commerce Ventures Ltd", quantity: 400, avgPrice: 200.00, currentPrice: 170.15, sector: "Retail", marketCap: "Small" },
];

const historicalPerformance = {
    timeline: [
        { date: "2024-01-01", portfolio: 1850000, nifty50: 21700, gold: 63000 },
        { date: "2024-02-01", portfolio: 1950000, nifty50: 22000, gold: 64000 },
        { date: "2024-03-01", portfolio: 2100000, nifty50: 22300, gold: 66500 },
        { date: "2024-04-01", portfolio: 2050000, nifty50: 22600, gold: 71000 },
        { date: "2024-05-01", portfolio: 2200000, nifty50: 22500, gold: 72000 },
        { date: "2024-06-01", portfolio: 2350000, nifty50: 23300, gold: 71500 },
        { date: "2024-07-01", portfolio: 2450000, nifty50: 24000, gold: 72500 },
    ],
    returns: {
        portfolio: { "1month": 4.2, "3months": 16.6, "1year": 25.5 },
        nifty50: { "1month": 3.0, "3months": 7.5, "1year": 14.8 },
        gold: { "1month": 1.4, "3months": 2.1, "1year": 15.2 }
    }
};

const calculateHoldingMetrics = (holding) => {
    const value = holding.quantity * holding.currentPrice;
    const gainLoss = (holding.currentPrice - holding.avgPrice) * holding.quantity;
    const gainLossPercent = (gainLoss / (holding.avgPrice * holding.quantity)) * 100;
    return { ...holding, value, gainLoss, gainLossPercent: parseFloat(gainLossPercent.toFixed(2)) };
};

app.get('/api/portfolio/holdings', (req, res) => {
    try {
        const holdingsWithMetrics = sampleHoldings.map(calculateHoldingMetrics);
        res.json(holdingsWithMetrics);
    } catch (error) {
        res.status(500).json({ message: "Error processing holdings data", error: error.message });
    }
});

app.get('/api/portfolio/allocation', (req, res) => {
    try {
        const holdingsWithMetrics = sampleHoldings.map(calculateHoldingMetrics);
        const totalValue = holdingsWithMetrics.reduce((acc, curr) => acc + curr.value, 0);

        const bySector = {};
        const byMarketCap = {};

        holdingsWithMetrics.forEach(holding => {
            if (!bySector[holding.sector]) {
                bySector[holding.sector] = { value: 0 };
            }
            bySector[holding.sector].value += holding.value;

            if (!byMarketCap[holding.marketCap]) {
                byMarketCap[holding.marketCap] = { value: 0 };
            }
            byMarketCap[holding.marketCap].value += holding.value;
        });
        
        for (const sector in bySector) {
            bySector[sector].percentage = parseFloat(((bySector[sector].value / totalValue) * 100).toFixed(2));
        }
        for (const cap in byMarketCap) {
            byMarketCap[cap].percentage = parseFloat(((byMarketCap[cap].value / totalValue) * 100).toFixed(2));
        }

        res.json({ bySector, byMarketCap });
    } catch (error) {
        res.status(500).json({ message: "Error calculating allocation", error: error.message });
    }
});

app.get('/api/portfolio/performance', (req, res) => {
    try {
        res.json(historicalPerformance);
    } catch (error) {
        res.status(500).json({ message: "Error fetching performance data", error: error.message });
    }
});

app.get('/api/portfolio/summary', (req, res) => {
    try {
        const holdingsWithMetrics = sampleHoldings.map(calculateHoldingMetrics);
        const totalValue = holdingsWithMetrics.reduce((acc, curr) => acc + curr.value, 0);
        const totalInvested = sampleHoldings.reduce((acc, curr) => acc + (curr.avgPrice * curr.quantity), 0);
        const totalGainLoss = totalValue - totalInvested;
        const totalGainLossPercent = (totalGainLoss / totalInvested) * 100;
        
        const sortedByPerformance = [...holdingsWithMetrics].sort((a, b) => b.gainLossPercent - a.gainLossPercent);
        const topPerformer = sortedByPerformance[0];
        const worstPerformer = sortedByPerformance[sortedByPerformance.length - 1];

        const uniqueSectors = new Set(sampleHoldings.map(h => h.sector)).size;
        const diversificationScore = parseFloat((uniqueSectors / sampleHoldings.length * 10).toFixed(1));

        const marketCapAllocation = holdingsWithMetrics.reduce((acc, holding) => {
            if (!acc[holding.marketCap]) acc[holding.marketCap] = 0;
            acc[holding.marketCap] += holding.value;
            return acc;
        }, {});
        
        const largeCapPercent = (marketCapAllocation['Large'] / totalValue) * 100;
        let riskLevel = "Moderate";
        if (largeCapPercent > 70) riskLevel = "Low";
        if (largeCapPercent < 40) riskLevel = "High";
        
        res.json({
            totalValue: parseFloat(totalValue.toFixed(2)),
            totalInvested: parseFloat(totalInvested.toFixed(2)),
            totalGainLoss: parseFloat(totalGainLoss.toFixed(2)),
            totalGainLossPercent: parseFloat(totalGainLossPercent.toFixed(2)),
            topPerformer: {
                symbol: topPerformer.symbol,
                name: topPerformer.name,
                gainPercent: topPerformer.gainLossPercent
            },
            worstPerformer: {
                symbol: worstPerformer.symbol,
                name: worstPerformer.name,
                gainPercent: worstPerformer.gainLossPercent
            },
            diversificationScore,
            riskLevel
        });

    } catch (error) {
        res.status(500).json({ message: "Error calculating summary", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
