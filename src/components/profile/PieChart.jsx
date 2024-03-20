import React from 'react';
import { Tooltip } from 'react-tooltip';

const PieChart = ({ data }) => {
  const [hoveredValue, setHoveredValue] = React.useState(null);
  let colors = ['#1976D2', '#4CAF50', '#FB8C00', '#7E57C2', '#E57373'];

  const isAllZero = data.every(value => value === 0);

  if (isAllZero) {
    data = [1]
    colors = ['#384c74']
  }
  const total = data.reduce((acc, value) => acc + value, 0);

  let startAngle = 0;
  const holeRadius = 0.8;

  const handleMouseOver = (value) => {
    setHoveredValue(value);
  };

  const handleMouseOut = () => {
    setHoveredValue(null);
  }


  const donutSections = data.map((value, index) => {
    const percentage = (value / total) * 100;
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    const largeArcFlag = angle > 180 ? 1 : 0;

    const innerStartX = Math.cos(startAngle * (Math.PI / 180)) * holeRadius;
    const innerStartY = Math.sin(startAngle * (Math.PI / 180)) * holeRadius;
    const innerEndX = Math.cos(endAngle * (Math.PI / 180)) * holeRadius;
    const innerEndY = Math.sin(endAngle * (Math.PI / 180)) * holeRadius;

    const outerStartX = Math.cos(startAngle * (Math.PI / 180));
    const outerStartY = Math.sin(startAngle * (Math.PI / 180));
    const outerEndX = Math.cos(endAngle * (Math.PI / 180));
    const outerEndY = Math.sin(endAngle * (Math.PI / 180));

    const pathData = `
      M ${innerStartX} ${innerStartY}
      A ${holeRadius} ${holeRadius} 0 ${largeArcFlag} 1 ${innerEndX} ${innerEndY}
      L ${outerEndX} ${outerEndY}
      A 1 1 0 ${largeArcFlag} 0 ${outerStartX} ${outerStartY}
      Z
    `;

    const style = {
      fill: colors[index % colors.length],
      stroke: 'gray',
      strokeWidth: '0.01',
    };

    let tooltipContent;
    if (colors[index % colors.length] === '#1976D2') {
      tooltipContent = `Beginner: ${value}`;
    } else if (colors[index % colors.length] === '#4CAF50') {
      tooltipContent = `Easy: ${value}`;
    } else if (colors[index % colors.length] === '#FB8C00') {
      tooltipContent = `Medium: ${value}`;
    } else if (colors[index % colors.length] === '#7E57C2') {
      tooltipContent = `Hard: ${value}`;
    } else if (colors[index % colors.length] === '#E57373') {
      tooltipContent = `Insane: ${value}`;
    }


    startAngle += angle;

    return <path
      key={index}
      d={pathData}
      style={style}
      data-tooltip-content={tooltipContent}
      data-tooltip-id="pie-chart-tooltip"
      data-tooltip-place="top"
      onMouseOver={() => handleMouseOver(value)}
      onMouseOut={handleMouseOut} />;
  });

  const centerX = 0;
  const centerY = 0;

  const numberStyle = {
    fontSize: 0.3,
    textAnchor: 'text-middle',
    fill: '#fff',
  };

  if (isAllZero) {
    return (
      <div>
        <svg width="170" height="170" viewBox="-1 -1 2 2">
          {donutSections}
          <text x={centerX} y={centerY} style={{ fontSize: 0.2, textAnchor: 'text-middle', fill: '#fff' }}>
            <tspan className="font-bold" x={centerX} dx="-0.725" dy="-0.05">No Challenges</tspan>
            <tspan className="font-bold" x={centerX} dx="-0.53" dy="0.3">Solved Yet</tspan>
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div>
      <Tooltip id="pie-chart-tooltip" />
      <svg width="170" height="170" viewBox="-1 -1 2 2">
        {donutSections}

        <text x={centerX} y={centerY} style={numberStyle}>
          <tspan className="font-bold" x={centerX} dx="-0.19" dy="-0.1">{total}</tspan>
          <tspan x={centerX} dx="-0.48" dy="0.35">Solved</tspan>
        </text>
      </svg>
    </div>
  );
};

export default PieChart;