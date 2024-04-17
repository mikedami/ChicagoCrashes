import '../Query4/index.scss';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';

const Query4 = () => {
    const [highwayData, setHighwayData] = useState([]);
    const [highwayInjuryData, setHighwayInjuryData] = useState([]);

    useEffect(() => {
        // Fetch data for the first graph
        axios('http://localhost:5000/highway')
            .then(response => {
                if (response.status === 200) {
                    setHighwayData(response.data);
                }
            })
            .catch(err => {
                console.error(err);
            });

        // Fetch data for the second graph
        axios('http://localhost:5000/highwayInjury')
            .then(response => {
                if (response.status === 200) {
                    setHighwayInjuryData(response.data);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const years = Array.from(new Set(highwayData.map(item => item[0]))).sort(); // Extract and sort unique years

    const dataByYear = years.map(year => {
        const crashes0to30 = highwayData.filter(item => item[0] === year && item[1] === '0-30');
        const crashes30plus = highwayData.filter(item => item[0] === year && item[1] === '30+');
        return {
            year: year,
            crashes0to30: crashes0to30.length > 0 ? crashes0to30[0][2] : 0,
            crashes30plus: crashes30plus.length > 0 ? crashes30plus[0][2] : 0,
        };
    });

    const chartData = {
        options: {
            chart: {
                id: 'highway-chart',
                type: 'bar',
            },
            xaxis: {
                categories: years,
            },
        },
        series: [
            {
                name: '0-30',
                data: dataByYear.map(item => item.crashes0to30),
            },
            {
                name: '30+',
                data: dataByYear.map(item => item.crashes30plus),
            },
        ],
    };

    const highwayInjuryChartOptions = {
        chart: {
            id: 'highway-injury-chart',
            type: 'bar',
        },
        xaxis: {
            categories: highwayInjuryData.map(item => item[0]), // Speed groups
        },
    };

    const highwayInjuryChartData = {
        series: [
            {
                name: 'Injury Ratio',
                data: highwayInjuryData.map(item => item[1]),
            },
        ],
    };

    return (
        <div className="page4-container">
            <div className="chart-container1">
                <h3>Crashes by Speed Group Over the Years</h3>
                <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="bar"
                    width="800"
                    height="400"
                />
            </div>
            <div className="chart-container2">
                <h3>Injury Ratio by Speed Group</h3>
                <Chart
                    options={highwayInjuryChartOptions}
                    series={highwayInjuryChartData.series}
                    type="bar"
                    width="400"
                    height="400"
                />
            </div>
        </div>
    );
};

export default Query4;
