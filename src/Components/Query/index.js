import './index.scss';
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


const Query = () => {
    /*
    const [message, setMessage] = useState('');

    useEffect(() => {

        var container = L.DomUtil.get("map");

        if (container != null) {
            container._leaflet_id = null;
        }
        var map = L.map("map").setView([41.87708718061871, -87.63721871616566], 10);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        fetch('/data')
            .then((dBres) => dBres.text())
            .then((data) => setMessage(data))
            .catch((err) => console.log(err));

        console.log(message);
        if (message.length != 0 || message.errorNum != null) {
            const data = JSON.parse(message);           
            var markerList = [];
            for (const d of data.rows) {
                if (d[14] != null && d[15] != null) {
                    const location = [d[14], d[15]];
                    const color = "#" + Math.floor(Math.random() * Math.pow(16,6)).toString(16);
                    markerList.push(L.circle(location, {
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.5,
                        radius: 2.5
                    }).addTo(map));
                }
            }
        }

    });
*/

    const [data, setData] = React.useState([])
    React.useEffect(()=>{
        axios('http://localhost:5000/seasons')
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
        Season Data 
        {
            data.length>0 &&
            data.map(item=>
            <div>{item}</div>)
        }
        </div>
    )
}

export default Query;
