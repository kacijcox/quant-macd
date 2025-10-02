// server/index.ts
import express, { Request, Response } from 'express';
import { analysisRouter } from './routes/analysis';
import { historicalRouter } from './routes/historical';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - simple implementation without the cors package
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Routes
app.use('/api/analysis', analysisRouter);
app.use('/api/historical', historicalRouter);

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        timestamp: Date.now(),
        service: 'Quantum MACD Scanner API'
    });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Quantum MACD Scanner API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            analysis: '/api/analysis',
            historical: '/api/historical'
        }
    });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: any) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Quantum MACD Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});