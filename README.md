# 🚀 Quantum MACD Scanner - Solana Statistical Arbitrage System

A sophisticated statistical arbitrage scanner for Solana tokens using MACD divergence detection, quantitative risk metrics, and machine learning enhancements.

## 🎯 Features

### Core Analysis
- **MACD(12,26,9)** calculation with adaptive mode
- **Multi-timeframe analysis** (1m, 5m, 15m, 1h, 4h, daily)
- **Statistical metrics**: Sharpe ratio, Sortino ratio, VaR, CVaR
- **Market regime detection** using Hidden Markov Models
- **Kelly Criterion** for optimal position sizing

### Risk Management
- **Value at Risk (95% & 99%)** calculations
- **Maximum drawdown** tracking
- **Sortino ratio** for downside risk
- **Z-score normalization** for outlier detection
- **Correlation matrix** for cross-asset analysis

### Technical Features
- Real-time Solana blockchain integration
- WebSocket support for live updates
- Matrix rain visual effect
- Terminal-style console logging
- Responsive design for all devices

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/quantum-macd-scanner.git
cd quantum-macd-scanner

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm start
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with your configuration:

```env
REACT_APP_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
REACT_APP_HELIUS_API_KEY=your_key_here
REACT_APP_BIRDEYE_API_KEY=your_key_here
```

### Supported RPC Providers
- **Solana Public RPC** (default)
- **Helius** (recommended for production)
- **QuickNode**
- **Alchemy**

## 🏗️ Architecture

```
src/
├── core/              # Core algorithms
│   ├── indicators/    # MACD, EMA calculations
│   ├── statistics/    # Risk metrics
│   └── analysis/      # Regime detection
├── services/          # External integrations
│   ├── solana/       # Blockchain connection
│   ├── api/          # DEX APIs
│   └── websocket/    # Real-time data
├── components/        # React UI components
├── hooks/            # Custom React hooks
└── types/            # TypeScript definitions
```

## 💻 Usage

### Basic Usage

1. Enter a Solana token contract address
2. Select timeframe (1m to 1d)
3. Choose analysis mode:
    - **Standard**: Traditional MACD
    - **Adaptive**: Volatility-adjusted periods
    - **ML-Enhanced**: Machine learning predictions
4. Click "Execute Scan"

### Example Token Addresses

```
SOL:  So11111111111111111111111111111111111111112
USDC: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
RAY:  4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R
```

## 📊 API Integration

### Fetching Token Data

```typescript
import { SolanaService } from '@/services/solana/connection';

const service = new SolanaService();
const tokenInfo = await service.getTokenInfo(tokenAddress);
const transactions = await service.getRecentTransactions(tokenAddress);
```

### Calculating MACD

```typescript
import { MACDCalculator } from '@/core/indicators/macd';

const calculator = new MACDCalculator();
const result = calculator.calculate(prices);
console.log(`MACD: ${result.macd}, Signal: ${result.signal}`);
```

### Risk Metrics

```typescript
import { StatisticalAnalyzer } from '@/core/statistics';

const analyzer = new StatisticalAnalyzer();
const sharpe = analyzer.calculateSharpeRatio(returns);
const var95 = analyzer.calculateVaR(returns, 0.95);
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
vercel --prod
```

### Deploy to Netlify

```bash
netlify deploy --prod --dir=build
```

## 📈 Performance

- **MACD Calculation**: <10ms for 1000 data points
- **Statistical Analysis**: <50ms full suite
- **UI Updates**: 60 FPS smooth animations
- **Memory Usage**: <50MB typical
- **Bundle Size**: ~250KB gzipped

## 🔬 Mathematical Formulas

### MACD
```
MACD = EMA(12) - EMA(26)
Signal = EMA(9) of MACD
Histogram = MACD - Signal
```

### Sharpe Ratio
```
Sharpe = (Rp - Rf) / σp
Where:
- Rp = Portfolio return
- Rf = Risk-free rate
- σp = Standard deviation
```

### Kelly Criterion
```
f* = (p * b - q) / b
Where:
- f* = Optimal fraction
- p = Win probability
- b = Win/loss ratio
- q = Loss probability
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📚 Documentation

- [API Documentation](docs/API.md)
- [Algorithm Explanations](docs/ALGORITHMS.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript 5
- **Blockchain**: Solana Web3.js
- **Styling**: CSS3 with animations
- **Build**: Webpack 5
- **Testing**: Jest, React Testing Library
- **Charts**: Custom canvas implementation

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 👨‍💻 Author

Built for demonstrating quantitative finance and software engineering skills to firms like D.E. Shaw.

## 🙏 Acknowledgments

- Solana Foundation for blockchain infrastructure
- TradingView for charting inspiration
- Quantitative finance community for formulas

## 📞 Support

- GitHub Issues: [Create Issue](https://github.com/yourusername/quantum-macd-scanner/issues)
- Email: your.email@example.com
- Discord: [Join Server](https://discord.gg/yourserver)

---

**Note**: This is a demonstration project showcasing statistical arbitrage concepts. Always perform your own research and risk management when trading.