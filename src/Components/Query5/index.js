import './index.scss'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

import Map from '../Map';

const Query5 = () => {

    const [data, setData] = useState([]);
    useEffect(() => {
        axios('http://localhost:5000/day')
        .then(response => {
            if (response.status === 200) {
                setData(response.data);
            }
        })
        .catch(err => {
            console.error(err);
        });
    }, []);

    const transformedData = data.map(item => [item[0], item[2], item[1],]);
    const groupedData = transformedData.reduce((acc, curr) => {
        const key = curr[2];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(curr);
        return acc;
    }, {});
    const groupedArrays = Object.values(groupedData);
    const series = Object.keys(groupedData).map(key => ({
        name: key,
        data: groupedData[key].map(item => [item[0], item[1]]),
    }));

    const options = {
        chart: {
            height: 350,
            type: 'line',
        },
        xaxis: {
            type: 'category',
        },
    };

    return (
        <div>
            <div className="page-container">
                <div className="chart-container">
                    <Chart options={options} series={series} type="line" height={400} width={600} />
                </div>
                <Map />
            </div>
        </div>
    );
}

export default Query5