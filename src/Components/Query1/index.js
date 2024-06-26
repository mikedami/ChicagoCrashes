import './index.scss';
import React, { useRef, useEffect, useState } from 'react';
import L, { marker } from 'leaflet';
import axios from 'axios';
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import Chart from 'react-apexcharts';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});

const ChartComponent = ({ groupedArrays }) => {
    const [chartData, setChartData] = useState({
        options: {
            chart: {
                type: 'line',
            },
            xaxis: {
                categories: [],
            },
        },
        series: [],
    });

    useEffect(() => {
        let categories = [];
        let seriesData = [];

        // Iterate over each grouped array and extract data for the chart
        groupedArrays.forEach(group => {
            const groupCategories = group.map(item => item[0]);
            const groupSeriesData = group.map(item => item[1]);

            // Update categories with unique values
            categories = Array.from(new Set([...categories, ...groupCategories]));

            // Combine series data into a single array
            seriesData.push(groupSeriesData);
        });

        setChartData(prevState => ({
            ...prevState,
            options: {
                ...prevState.options,
                xaxis: {
                    categories,
                },
            },
            series: seriesData.map((series, index) => ({
                name: `${groupedArrays[index][0][2]},${groupedArrays[index][0][3]}`, // Use items at 2nd and 3rd index as key
                data: series,
            })),
        }));
    }, [groupedArrays]);

    return ( 
        <div className="chart-container">
            <Chart options={chartData.options} series={chartData.series} type="line" height={500} width={800} />
        </div>
    )
};

const Query1 = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        axios('http://localhost:5000/locations')
        .then(response => {
            if (response.status === 200) {
                setData(response.data);
            }
        })
        .catch(err => {
            console.error(err);
        });
    }, []);

    const transformedData = data.map(item => [item[0], item[3], item[2], item[1]]);
    const groupedData = transformedData.reduce((acc, curr) => {
        const key = `${curr[2]}_${curr[3]}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(curr);
        return acc;
    }, {});
    const groupedArrays = Object.values(groupedData);

    return (
        <div>
            <div className='dangerous'>
                The most dangerous area to drive is near Humboldt Park,
                on the corner of West Division Street and
                North Humboldt Drive.
            </div>
            <div className='safest'>
                The safest area to drive is near the Pullman-Standard
                Historic District, by Calumet Ave and Columbia Ave.
            </div>
            <div className="page-containerX">
            <div>
                <h1>Frequency of Crashes by Coordinates</h1>
                <ChartComponent groupedArrays={groupedArrays} />
            </div>
        </div>
        </div>

    );
};

export default Query1;