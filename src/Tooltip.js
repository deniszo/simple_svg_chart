import React from 'react';

const TOOLTIP_OFFSET = 10;

const Tooltip = ({
  x,
  y,
  trend,
  score,
}) => {

  const tooltipStyle = {
    transform: `translate(${x + TOOLTIP_OFFSET}px, ${y + TOOLTIP_OFFSET}px)`,
  }

  const trendWithNoSign = Math.abs(trend);
  const trendBadgeModifier = trend > 0
    ? 'positive'
    : (trend === 0
      ? 'static'
      : 'negative'
      );

  return (
    <div className="tooltip" style={tooltipStyle}>
      <div className="tooltip__data">
        <div className="score">{score}</div>
        <div className={`trend trend--${trendBadgeModifier}`}>{trendWithNoSign}</div>
      </div>
    </div>
  );
}

export default Tooltip;