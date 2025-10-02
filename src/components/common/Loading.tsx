import React from 'react';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'dots' | 'bars' | 'quantum';
  overlay?: boolean;
  progress?: number;
}

const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  size = 'medium',
  variant = 'quantum',
  overlay = false,
  progress
}) => {
  const renderSpinner = () => (
    <div className={`spinner ${size}`}>
      <div className="spinner-circle"></div>
    </div>
  );

  const renderDots = () => (
    <div className={`dots-loader ${size}`}>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );

  const renderBars = () => (
    <div className={`bars-loader ${size}`}>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
  );

  const renderQuantum = () => (
    <div className={`quantum-loader ${size}`}>
      <div className="quantum-ring">
        <div className="quantum-particle"></div>
        <div className="quantum-particle"></div>
        <div className="quantum-particle"></div>
      </div>
      <div className="quantum-core"></div>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return renderSpinner();
      case 'dots':
        return renderDots();
      case 'bars':
        return renderBars();
      case 'quantum':
      default:
        return renderQuantum();
    }
  };

  const LoadingContent = () => (
    <div className={`loading-container ${size} ${variant}`}>
      {renderLoader()}
      {message && (
        <div className="loading-message">
          {message}
        </div>
      )}
      {typeof progress === 'number' && (
        <div className="loading-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            ></div>
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        <LoadingContent />
      </div>
    );
  }

  return <LoadingContent />;
};

export default Loading;