import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
    label: string;
    value: string;
    change?: number;
    positive?: boolean;
    negative?: boolean;
    subtitle?: string;
}

interface RiskMetricCardProps {
    label: string;
    value: string;
}

interface SignalCardProps {
    timeframe: string;
    signal: string;
}

// ADD THIS INTERFACE AND EXPORT IT
export interface DashboardProps {
    tokenAddress: string;
    setTokenAddress: (address: string) => void;
    timeframe: string;
    setTimeframe: (tf: string) => void;
    mode: 'STANDARD' | 'ADAPTIVE' | 'ML_ENHANCED';
    setMode: (mode: 'STANDARD' | 'ADAPTIVE' | 'ML_ENHANCED') => void;
    loading: boolean;
    onExecute: () => void;
    macdResult: any;
    statistics: any;
    regime: any;
    timeframeSignals: any[];
    consoleMessages: string[];
}

// CHANGE THIS LINE - accept props instead of empty ()
const Dashboard: React.FC<DashboardProps> = ({
                                                 tokenAddress,
                                                 setTokenAddress,
                                                 timeframe,
                                                 setTimeframe,
                                                 mode,
                                                 setMode,
                                                 loading,
                                                 onExecute
                                             }) => {
    // REMOVE these lines since they come from props now
    // const [tokenAddress, setTokenAddress] = useState('');
    // const [timeframe, setTimeframe] = useState('5m');
    // const [loading, setLoading] = useState(false);

    const [activeTab, setActiveTab] = useState('analysis');

    // Mock data for demonstration
    const macdData = [
        { time: '10:00', macd: 0.0012, signal: 0.0010, histogram: 0.0002 },
        { time: '10:05', macd: 0.0015, signal: 0.0011, histogram: 0.0004 },
        { time: '10:10', macd: 0.0018, signal: 0.0013, histogram: 0.0005 },
        { time: '10:15', macd: 0.0016, signal: 0.0014, histogram: 0.0002 },
        { time: '10:20', macd: 0.0014, signal: 0.0015, histogram: -0.0001 },
        { time: '10:25', macd: 0.0011, signal: 0.0016, histogram: -0.0005 },
    ];

    const priceData = [
        { time: '10:00', price: 0.0245 },
        { time: '10:05', price: 0.0248 },
        { time: '10:10', price: 0.0252 },
        { time: '10:15', price: 0.0249 },
        { time: '10:20', price: 0.0247 },
        { time: '10:25', price: 0.0251 },
    ];

    const metrics = {
        sharpe: 1.82,
        sortino: 2.14,
        var95: -2.35,
        maxDrawdown: -8.5,
        kellyCriterion: 15.3,
        currentPrice: 0.0251,
        change24h: 5.2,
        volume24h: 1250000
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #F5F0E8 0%, #E8E3DB 100%)',
            fontFamily: "'Playfair Display', 'Georgia', serif",
            color: '#1a1a1a'
        }}>
            {/* Header */}
            <header style={{
                background: '#1a1a1a',
                padding: '1.5rem 3rem',
                borderBottom: '2px solid #C9A961',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#F5F0E8',
                        letterSpacing: '0.5px',
                        margin: 0
                    }}>
                        COX & CO
                    </h1>
                    <div style={{
                        height: '30px',
                        width: '1px',
                        background: '#C9A961'
                    }}></div>
                    <span style={{
                        color: '#C9A961',
                        fontSize: '0.9rem',
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: '2px',
                        fontWeight: '300'
                    }}>
            QUANTITATIVE ANALYSIS
          </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{
              color: '#F5F0E8',
              fontSize: '0.85rem',
              fontFamily: "'Inter', sans-serif"
          }}>
            {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })}
          </span>
                </div>
            </header>

            {/* Main Content */}
            <div style={{ padding: '2rem 3rem' }}>
                {/* Search Bar */}
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    marginBottom: '2rem'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '1rem', alignItems: 'end' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '0.75rem',
                                fontFamily: "'Inter', sans-serif",
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: '#666'
                            }}>
                                Token Address
                            </label>
                            <input
                                type="text"
                                value={tokenAddress}
                                onChange={(e) => setTokenAddress(e.target.value)}
                                placeholder="Enter Solana token address..."
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    fontFamily: "'Inter', sans-serif",
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#C9A961'}
                                onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#ddd'}
                            />
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '0.75rem',
                                fontFamily: "'Inter', sans-serif",
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: '#666'
                            }}>
                                Timeframe
                            </label>
                            <select
                                value={timeframe}
                                onChange={(e) => setTimeframe(e.target.value)}
                                style={{
                                    padding: '0.75rem 1rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    fontFamily: "'Inter', sans-serif",
                                    background: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="1m">1 Minute</option>
                                <option value="5m">5 Minutes</option>
                                <option value="15m">15 Minutes</option>
                                <option value="1h">1 Hour</option>
                                <option value="4h">4 Hours</option>
                                <option value="1d">1 Day</option>
                            </select>
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '0.75rem',
                                fontFamily: "'Inter', sans-serif",
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: '#666'
                            }}>
                                Mode
                            </label>
                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value as any)}
                                style={{
                                    padding: '0.75rem 1rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    fontFamily: "'Inter', sans-serif",
                                    background: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="STANDARD">Standard</option>
                                <option value="ADAPTIVE">Adaptive</option>
                                <option value="ML_ENHANCED">ML Enhanced</option>
                            </select>
                        </div>
                        <button
                            onClick={onExecute}
                            disabled={!tokenAddress || loading}
                            style={{
                                padding: '0.75rem 2rem',
                                background: tokenAddress && !loading ? '#1a1a1a' : '#999',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                                fontFamily: "'Inter', sans-serif",
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                cursor: tokenAddress && !loading ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s',
                                fontWeight: '500'
                            }}
                            onMouseOver={(e) => {
                                if (tokenAddress && !loading) {
                                    (e.target as HTMLButtonElement).style.background = '#C9A961';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (tokenAddress && !loading) {
                                    (e.target as HTMLButtonElement).style.background = '#1a1a1a';
                                }
                            }}
                        >
                            {loading ? 'Analyzing...' : 'Execute'}
                        </button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <MetricCard
                        label="Current Price"
                        value={`$${metrics.currentPrice.toFixed(6)}`}
                        change={metrics.change24h}
                        positive={metrics.change24h > 0}
                    />
                    <MetricCard
                        label="Sharpe Ratio"
                        value={metrics.sharpe.toFixed(2)}
                        subtitle="Risk-adjusted return"
                    />
                    <MetricCard
                        label="Max Drawdown"
                        value={`${metrics.maxDrawdown.toFixed(1)}%`}
                        negative={true}
                    />
                    <MetricCard
                        label="24h Volume"
                        value={`$${(metrics.volume24h / 1000000).toFixed(2)}M`}
                    />
                </div>

                {/* Tabs */}
                <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        display: 'flex',
                        borderBottom: '1px solid #e0e0e0',
                        background: '#fafafa'
                    }}>
                        {['Analysis', 'MACD', 'Risk Metrics', 'Signals'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                                style={{
                                    padding: '1rem 2rem',
                                    border: 'none',
                                    background: activeTab === tab.toLowerCase().replace(' ', '-') ? 'white' : 'transparent',
                                    borderBottom: activeTab === tab.toLowerCase().replace(' ', '-') ? '2px solid #C9A961' : '2px solid transparent',
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    color: activeTab === tab.toLowerCase().replace(' ', '-') ? '#1a1a1a' : '#666',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div style={{ padding: '2rem' }}>
                        {activeTab === 'analysis' && (
                            <div>
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    marginBottom: '1.5rem',
                                    fontFamily: "'Inter', sans-serif"
                                }}>
                                    Price Movement
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={priceData}>
                                        <defs>
                                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#C9A961" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#C9A961" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="time" style={{ fontSize: '0.75rem', fontFamily: "'Inter', sans-serif" }} />
                                        <YAxis style={{ fontSize: '0.75rem', fontFamily: "'Inter', sans-serif" }} />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'white',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                fontFamily: "'Inter', sans-serif"
                                            }}
                                        />
                                        <Area type="monotone" dataKey="price" stroke="#C9A961" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {activeTab === 'macd' && (
                            <div>
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    marginBottom: '1.5rem',
                                    fontFamily: "'Inter', sans-serif"
                                }}>
                                    MACD Indicator
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={macdData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="time" style={{ fontSize: '0.75rem', fontFamily: "'Inter', sans-serif" }} />
                                        <YAxis style={{ fontSize: '0.75rem', fontFamily: "'Inter', sans-serif" }} />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'white',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                fontFamily: "'Inter', sans-serif"
                                            }}
                                        />
                                        <Line type="monotone" dataKey="macd" stroke="#1a1a1a" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="signal" stroke="#C9A961" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="histogram" stroke="#666" strokeWidth={1} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {activeTab === 'risk-metrics' && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '2rem'
                            }}>
                                <RiskMetricCard label="Value at Risk (95%)" value={`${metrics.var95.toFixed(2)}%`} />
                                <RiskMetricCard label="Sortino Ratio" value={metrics.sortino.toFixed(2)} />
                                <RiskMetricCard label="Kelly Criterion" value={`${metrics.kellyCriterion.toFixed(1)}%`} />
                            </div>
                        )}

                        {activeTab === 'signals' && (
                            <div>
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    marginBottom: '1.5rem',
                                    fontFamily: "'Inter', sans-serif"
                                }}>
                                    Multi-Timeframe Signals
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    {['1m', '5m', '15m', '1h', '4h', '1d'].map((tf) => (
                                        <SignalCard key={tf} timeframe={tf} signal={Math.random() > 0.5 ? 'BULL' : 'BEAR'} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    marginTop: '3rem',
                    padding: '2rem',
                    textAlign: 'center',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.75rem',
                    color: '#666'
                }}>
                    <p style={{ margin: '0.5rem 0' }}>Cox & Co. © 2025 • Quantitative Analysis Platform</p>
                    <p style={{ margin: '0.5rem 0' }}>Statistical arbitrage and risk management for institutional investors</p>
                </div>
            </div>
        </div>
    );
};

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, positive, negative, subtitle }) => (
    <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0'
    }}>
        <div style={{
            fontSize: '0.75rem',
            fontFamily: "'Inter', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#666',
            marginBottom: '0.75rem'
        }}>
            {label}
        </div>
        <div style={{
            fontSize: '1.75rem',
            fontWeight: '600',
            color: negative ? '#dc3545' : positive !== undefined ? (positive ? '#28a745' : '#dc3545') : '#1a1a1a',
            fontFamily: "'Inter', sans-serif",
            marginBottom: '0.25rem'
        }}>
            {value}
        </div>
        {change !== undefined && (
            <div style={{
                fontSize: '0.85rem',
                color: change > 0 ? '#28a745' : '#dc3545',
                fontFamily: "'Inter', sans-serif"
            }}>
                {change > 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
            </div>
        )}
        {subtitle && (
            <div style={{
                fontSize: '0.75rem',
                color: '#999',
                fontFamily: "'Inter', sans-serif",
                marginTop: '0.5rem'
            }}>
                {subtitle}
            </div>
        )}
    </div>
);

const RiskMetricCard: React.FC<RiskMetricCardProps> = ({ label, value }) => (
    <div style={{
        padding: '1.5rem',
        borderLeft: '3px solid #C9A961',
        background: '#fafafa'
    }}>
        <div style={{
            fontSize: '0.75rem',
            fontFamily: "'Inter', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#666',
            marginBottom: '0.5rem'
        }}>
            {label}
        </div>
        <div style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1a1a1a',
            fontFamily: "'Inter', sans-serif"
        }}>
            {value}
        </div>
    </div>
);

const SignalCard: React.FC<SignalCardProps> = ({ timeframe, signal }) => (
    <div style={{
        padding: '1rem',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        textAlign: 'center'
    }}>
        <div style={{
            fontSize: '0.75rem',
            fontFamily: "'Inter', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#666',
            marginBottom: '0.5rem'
        }}>
            {timeframe}
        </div>
        <div style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: signal === 'BULL' ? '#28a745' : '#dc3545',
            fontFamily: "'Inter', sans-serif"
        }}>
            {signal}
        </div>
    </div>
);

export default Dashboard;