import React from 'react';

const PieChart = ({ data }) => {
  const total = data.reduce((acc, value) => acc + value, 0);

  let startAngle = 0;
  const colors = ['#1976D2', '#4CAF50', '#FB8C00', '#7E57C2', '#E57373'];
  const holeRadius = 0.8;

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
    startAngle += angle;

    return <path key={index} d={pathData} style={style} />;
  });

  const centerX = 0;
  const centerY = 0;

  const numberStyle = {
    fontSize: 0.3,
    textAnchor: 'text-middle',
    fill: '#fff',
  };

  return (
    <svg width="170" height="170" viewBox="-1 -1 2 2">
      {donutSections}
      <text x={centerX} y={centerY} style={numberStyle}>
        <tspan className="font-bold" x={centerX} dx="-0.19" dy="-0.1">{45}</tspan>
        <tspan x={centerX} dx="-0.48" dy="0.35">Solved</tspan>
      </text>
    </svg>
  );
};

export default PieChart;