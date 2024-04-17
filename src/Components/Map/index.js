import './index.scss';
import '../../mainstyles.scss';
import React, { useEffect, useState, useRef } from 'react';
import L, { marker, polygon } from 'leaflet';
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import '@bopen/leaflet-area-selection/dist/index.css';
import { DrawAreaSelection } from '@bopen/leaflet-area-selection';

import LineChart from './chart';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});

const Map = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const center = { lng: -87.63721871616566, lat: 41.87708718061871 };
    const [zoom] = useState(10);

    const [message, setMessage] = useState('');
    const isFirstRender = useRef(true);

    var coordinates = useRef([ 
        -88.096619,41.533254,
        -87.239685,41.533254,
        -87.239685,42.073762,
        -88.096619,42.073762,
        -88.096619,41.533254 
    ]);

    var markerList = useRef([]);
    var shapes = useRef([]);

     async function shapeQuery(map, message) {
        var coords = coordinates.current;
        console.log("coordinates:" + coords);
        const dat = await fetch('/data', {
            method: "POST",
            body: JSON.stringify(coords),
            headers: 
            {
                "Content-Type": "application/json"
            }
          })
            .then((res) => res.text())
            .then((data) => setMessage(data))
            .catch((err) => console.log("error:" + err));
        
        var markerList = [];
        if (message.length !== 0 && message.code === undefined) {

            const data = JSON.parse(message);    

            console.log(message);
            for (const d of data.rows) {
                if (d[1] !== null && d[0] !== null) {

                    const location = [d[1], d[0]];
                    const color = "#" + d[2].slice(4,10);

                    markerList.push(L.circle(location, {
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.7,
                        radius: 1
                    }).addTo(map));

                }

            }

            var shape = [];
                    for (var i = 0; i < coords.length - 1; i+=2) {
                        shape.push([coords[i],coords[i+1]]);
                    }
                    shapes.current.push(polygon(shape, {
                        style: {
                          opacity: 0.6,
                          fillOpacity: 0.01,
                          color: 'black',
                        },
                      }))
        }

        return markerList;
    };


    const areaSelection = useRef(new DrawAreaSelection({

        onPolygonDblClick: (polygon, control, ev) => {
            console.log("drawc:" + coordinates.current);

            const geojson = L.geoJSON(polygon.toGeoJSON(), {
                style: {
                  opacity: 0.6,
                  fillOpacity: 0.01,
                  color: 'black',
                },
              });

              console.log("loaded polygon");

              console.log(polygon);

              coordinates.current = polygon.toGeoJSON().geometry.coordinates.flat().flat();
              console.log ("coords" + coordinates.current);
              markerList.current.push(shapeQuery(map.current, message));
              shapes.current.push(geojson);

              console.log("MARKERLIST:");
              for (const e of markerList.current) {
                console.log(e);
              }

              console.log("SHAPES:");
              console.log(shapes.current);

              geojson.addTo(map.current);
              
              control.deactivate();
              console.log("drawc2:" + coordinates.current);

            }

    }));

    useEffect(() => {

        if (!map.current) {
            map.current = new L.Map(mapContainer.current, {
                center: L.latLng(center.lat, center.lng),
                zoom: zoom
              });
            map.current.addControl(areaSelection.current);  
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map.current);
        }
     
        //shapeQuery(map.current, coordinates.current, message);


    }, [center.lng, center.lat, zoom, coordinates, markerList, shapes]);

    return (
        <div>
            <div ref={mapContainer} id="map" />
            <LineChart/>
        </div>        
    )
}

export default Map
