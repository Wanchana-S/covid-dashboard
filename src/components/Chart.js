import React from 'react';
import { Line } from 'react-chartjs-2';

const Chart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Confirmed',
        data: data.map(item => item.cases),
        borderColor: 'blue',
        fill: false,
      },
      {
        label: 'Deaths',
        data: data.map(item => item.deaths),
        borderColor: 'red',
        fill: false,
      },
      {
        label: 'Recovered',
        data: data.map(item => item.recovered),
        borderColor: 'green',
        fill: false,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default Chart;
