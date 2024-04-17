import './index.scss'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';


const Query2 = () => {

    const [data, setData] = useState([]);
    useEffect(() => {
        axios('http://localhost:5000/safety')
        .then(response => {
            if (response.status === 200) {
                setData(response.data);
            }
        })
        .catch(err => {
            console.error(err);
        });
    }, []);
    
    const transformedData = data.map(item => [item[0], item[2], item[1]]);
    console.log(transformedData)
    const groupedData = transformedData.reduce((acc, curr) => {
        const key = curr[2];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(curr);
        return acc;
    }, {});
    const groupedArrays = Object.values(groupedData);
    console.log(groupedArrays);

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
                <h1>Vehicle year vs likelihood of injury</h1>
                <div className="chart-container">
                    <Chart options={options} series={series} type="line" height={400} width={800} />
                </div>
            </div>
        </div>
    );
}

export default Query2;