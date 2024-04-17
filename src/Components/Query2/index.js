import '../../mainstyles.scss';
import React, { useEffect, useState } from 'react';
import L, { marker } from 'leaflet';
import axios from 'axios';
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});

const Query2 = () => {
 

    const [data, setData] = React.useState([])
    React.useEffect(()=>{
        axios('http://localhost:5000/locations')
        .then(response => {
            if(response.status===200) {
                setData(response.data)
            }
        })
        .catch(err=>{

        })
    },[]);

    return (
        <div>
        <h1>season data</h1> 
        {
            data.length>0 &&
            data.map(item=>
            <div>{item}</div>)
        }
        </div>
    )
}

export default Query2;