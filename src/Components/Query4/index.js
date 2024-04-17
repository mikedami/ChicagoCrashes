import './index.scss'
import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Query4 = () => {

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

    return(
        <div>Hello</div>
    )
}

export default Query4