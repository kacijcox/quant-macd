import React from 'react';
import './CorrelationMatrix.styles.css';

interface CorrelationMatrixProps {
    correlation?: number[][];
}

const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ correlation }) => {
    const defaultMatrix = [
        [1.00, 0.85, 0.72],
        [0.85, 1.00, 0.68],
        [0.72, 0.68, 1.00]
    ];

    const matrix = correlation || defaultMatrix;
    const labels = ['MACD', 'RSI', 'VOL'];

    const getCorrelationColor = (value: number) => {
        const intensity = Math.abs(value);
        return `rgba(0, 255, 0, ${intensity * 0.4})`;
    };

    return (
        <div className="correlation-matrix">
            <div className="matrix-title">CORRELATION MATRIX</div>
            <div className="correlation-grid">
                {/* Header row */}
                <div className="correlation-header"></div>
                {labels.map(label => (
                    <div key={`header-${label}`} className="correlation-header">
                        {label}
                    </div>
                ))}

                {/* Matrix rows */}
                {matrix.map((row, i) => (
                    <React.Fragment key={`row-${i}`}>
                        <div className="correlation-label">{labels[i]}</div>
                        {row.map((value, j) => (
                            <div
                                key={`cell-${i}-${j}`}
                                className="correlation-cell"
                                style={{ background: getCorrelationColor(value) }}
                            >
                                {value.toFixed(2)}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CorrelationMatrix;