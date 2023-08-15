import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import Table from './Table';
import '../components/Dashboard.css'

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const columns = [
    { Header: 'Date', accessor: 'date' },
    { Header: 'Confirmed', accessor: 'cases' },
    { Header: 'Deaths', accessor: 'deaths' },
    { Header: 'Recovered', accessor: 'recovered' },
  ];

  useEffect(() => {
    axios
      .get('https://disease.sh/v3/covid-19/historical/all?lastdays=30')
      .then(response => {
        const filteredData = Object.keys(response.data.cases || {}).map(date => ({
          date,
          cases: response.data.cases[date],
          deaths: response.data.deaths[date],
          recovered: response.data.recovered[date],
        }));
        setData(filteredData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (!startDate) {
      const today = new Date();
      const defaultStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
      setStartDate(defaultStartDate.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    }
  }, [startDate]);

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = data.filter(item => {
        return item.date >= startDate && item.date <= endDate;
      });
      setData(filtered);
    }
  }, [startDate, endDate]);

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Confirmed',
        data: data.map(item => item.cases),
        backgroundColor: 'blue',
      },
      {
        label: 'Deaths',
        data: data.map(item => item.deaths),
        backgroundColor: 'red',
      },
      {
        label: 'Recovered',
        data: data.map(item => item.recovered),
        backgroundColor: 'green',
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Global COVID-19 Dashboard</h1>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
      </div>
      <div className="chart">
        <Bar data={chartData} />
      </div>
      <Table columns={columns} data={data} />
    </div>
  );
};

export default Dashboard;
