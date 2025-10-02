import React from 'react';
import './MiniChart.styles.css';

interface MiniChartProps {
    data: number[];
    color?: string;
}

const MiniChart: React.FC<MiniChartProps> = ({
                                                 data,
                                                 color = '#0f0'
                                             }) => {
    const normalizeData = (values: number[]) => {
        if (values.length === 0) return [];

        const max = Math.max(...values.map(v => Math.abs(v)));
        if (max === 0) return values.map(() => 50);

        return values.map(v => (v / max) * 50 + 50);
    };

    const displayData = data.slice(-20);
    const normalized = normalizeData(displayData);

    return (
        <div className="mini-chart">
            <div className="chart-container">
                {normalized.map((value, index) => (
                    <div
                        key={index}
                        className="chart-bar"
                        style={{
                            height: `${Math.abs(value - 50) * 2}%`,
                            background: value >= 50 ? '#0f0' : '#f00',
                            bottom: value >= 50 ? '50%' : 'auto',
                            top: value < 50 ? '50%' : 'auto'
                        }}
                    />
                ))}
            </div>
            <div className="chart-zero-line" />
        </div>
    );
};

export default MiniChart;