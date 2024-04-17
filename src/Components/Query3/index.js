import './index.scss';
import '../../mainstyles.scss';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';

const Query3 = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios('http://localhost:5000/impair')
            .then(response => {
                if (response.status === 200) {
                    setData(response.data);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const chartData = {
        options: {
            chart: {
                id: 'crashes-chart',
            },
            xaxis: {
                type: 'category',
                categories: data.map(item => item[0]), // Years
            },
        },
        series: [{
            name: 'Crashes',
            data: data.map(item => item[1]), // Crash counts
        }],
    };

    return (
        <div /*className='main-content'*/>
                    <div className="page-container">
            <h2>Crashes Due to Impaired Drivers Over the Years</h2>
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="line"
                height={400}
                width={800}
            />
        </div>
        </div>

    );
};

export default Query3;
