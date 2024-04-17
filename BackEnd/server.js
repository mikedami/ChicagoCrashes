const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 5000;
var 
/*

To log in with your user name, 
just input 'username password' as 
command-line arguments when running the server.

*/

app.use(bodyParser.json());
app.use(cors());

const dbConnect = {
    user: process.argv[2], //enter username
    password: process.argv[3], //enter password
    connectString: 'oracle.cise.ufl.edu:1521/orcl'
};


app.get('/', (req, res) => {
    res.send("Hello World")
})


app.get('/count', (req, res) => {
    async function fetchDataCount(){
        try{
            const connection = await oracledb.getConnection(dbConnect);

            const sqlQuery = `
            SELECT SUM(total_count) AS total_tuples_count
            FROM (
                SELECT COUNT(*) AS total_count FROM CRASHES
                    UNION ALL
                SELECT COUNT(*) AS total_count FROM DRIVERS
                    UNION ALL
                SELECT COUNT(*) AS total_count FROM VEHICLES
            )
            `;
            const result = await connection.execute(sqlQuery);
            await connection.close();
            return result.rows;

        } catch (error){
            console.log(error);
            return error;
        }
    }
    fetchDataCount()
    .then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})

app.get('/impair', (req, res) => {
    async function fetchDataFatal(){
        try {
            const connection = await oracledb.getConnection(dbConnect);

            const sqlQuery1 = `
                SELECT 
                    EXTRACT(YEAR FROM c.crashdate) AS CRASHYEAR, 
                    COUNT(*) AS CRASHCOUNT
                FROM DCIUCULIN.CRASHES c
                INNER JOIN DCIUCULIN.DRIVERS d ON c.CRASHID = d.CRASHID
                WHERE d.PHYSICALCONDITION LIKE 'IMPAIRED%'
                    GROUP BY EXTRACT(YEAR FROM CRASHDATE)
                ORDER BY CRASHYEAR        
            `;
            const result = await connection.execute(sqlQuery1);
            await connection.close();
            return result.rows;
        } catch (error) {
            return error;
        }
    }
    fetchDataFatal()
    .then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})

// THE ONE FOR THE MAP
app.post('/data', (req, res) => {
    async function fetchData(){
        console.log("queried!");
        try {
            const connection = await oracledb.getConnection(dbConnect);

            const GeomType = await connection.getDbObjectClass("MDSYS.SDO_GEOMETRY");
            
            var coords = req.body;

            const geom = new GeomType(
                {
                    SDO_GTYPE: 2003,
                    SDO_SRID: null,
                    SDO_POINT: null,
                    SDO_ELEM_INFO: [ 1, 1003, 1 ],
                    SDO_ORDINATES: coords
                }
            );

            const add = `select longitude x, latitude y, crashes.* from DCIUCULIN.crashes`;

            const query = `SELECT /*+ PARALLEL(a, 8) */ *
            FROM TABLE(sdo_PointInPolygon(
              CURSOR(`+ add +`),
              :shape,
              0.0005)) a where rownum < 700`

            const result = await connection.execute(query, {shape : geom}); 
            await connection.close();
            return result;

        } catch (error) {
            return error;
        }
    }
    fetchData()
    .then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})


app.get('/safety', (req, res) => {
    async function fetchDataSeason(){
        try {
            const connection = await oracledb.getConnection(dbConnect);

            const sqlQuery2 = `
                SELECT 
                    v.VEHICLEYEAR,
                    c.MOSTSEVERE,
                    COUNT(*) AS NumberOfCrashes
                FROM 
                    DCIUCULIN.crashes c 
                JOIN 
                    DCIUCULIN.vehicles v 
                    ON c.CRASHID = v.CRASHID
                WHERE 
                    v.VEHICLEYEAR BETWEEN 2015 AND 2023 AND
                    (UPPER(c.MOSTSEVERE) = 'FATAL' OR UPPER(c.MOSTSEVERE) = 'NO INDICATION OF INJURY')
                GROUP BY 
                    v.VEHICLEYEAR,
                    c.MOSTSEVERE
                ORDER BY 
                    v.VEHICLEYEAR DESC, 
                    CASE 
                    WHEN UPPER(c.MOSTSEVERE) = 'FATAL' THEN 1
                    WHEN UPPER(c.MOSTSEVERE) = 'NO INDICATION OF INJURY' THEN 2
                END
            `;
            const result = await connection.execute(sqlQuery2);
            await connection.close();
            return result.rows;
        } catch (error) {
            return error;
        }
    }
    fetchDataSeason()
    .then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})


app.get('/locations', (req, res) => {
    async function fetchDataLocs(){
        try {
            const connection = await oracledb.getConnection(dbConnect);

            const sqlQuery3 = `
                SELECT 
                    EXTRACT(YEAR FROM c.crashdate) AS Year, 
                    ROUND(c.longitude, 1) AS longitude,
                    ROUND(c.latitude, 1) AS latitude,
                    COUNT(*) AS accidents
                FROM 
                    DCIUCULIN.crashes c 
                WHERE 
                    c.crashdate >= DATE '2018-01-01' AND  
                    c.crashdate <= DATE '2023-12-31' AND  
                    c.longitude IS NOT NULL AND c.longitude != 0 AND
                    c.latitude IS NOT NULL AND c.latitude != 0
                GROUP BY 
                    EXTRACT(YEAR FROM c.crashdate),
                    ROUND(c.longitude, 1),
                    ROUND(c.latitude, 1)
                ORDER BY 
                    ROUND(c.longitude, 1),
                    ROUND(c.latitude, 1),
                    Year
            `;
            
            const result = await connection.execute(sqlQuery3);
            await connection.close();
            return result.rows;

        } catch (error) {
            return error;
        }
    }
    fetchDataLocs()
    .then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})


app.get('/covid', (req, res) => {
    async function fetchDataSpeed(){
        try {
            const connection = await oracledb.getConnection(dbConnect);

            const sqlQuery4 = `
                SELECT 
                    TO_CHAR(c.CRASHDATE, 'YYYY-MM') AS CRASHYEAR_MONTH, 
                    COUNT(*) AS CRASHCOUNT
                FROM DCIUCULIN.CRASHES c
                WHERE c.CRASHDATE BETWEEN TO_DATE('2019-12-01', 'YYYY-MM-DD') AND TO_DATE('2023-05-31', 'YYYY-MM-DD')
                GROUP BY TO_CHAR(c.CRASHDATE, 'YYYY-MM')
                ORDER BY CRASHYEAR_MONTH
            `;
            
            var coords = [ 
                -88.096619,41.533254,
                -87.239685,41.533254,
                -87.239685,42.073762,
                -88.096619,42.073762,
                -88.096619,41.533254 ];

            const geom = new GeomType(
                {
                    SDO_GTYPE: 2003,
                    SDO_SRID: null,
                    SDO_POINT: null,
                    SDO_ELEM_INFO: [ 1, 1003, 1 ],
                    SDO_ORDINATES: coords
                }
            );

            const query = `SELECT /*+ PARALLEL(a, 8) */ *
            FROM TABLE(sdo_PointInPolygon(
              CURSOR(select longitude x, latitude y, crashes.* from DCIUCULIN.crashes),
              :shape,
              0.005)) a  where rownum < 20000`

            const result = await connection.execute(query, {shape : geom});
            await connection.close();
            return result.rows;

        } catch (error) {
            return error;
        }
    }
    fetchDataSpeed()
    .then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})

app.get('/highway', (req, res) => {
    async function fetchDataHighway(){
        try {
            const connection = await oracledb.getConnection(dbConnect);

            const sqlQuery6 = `
                SELECT 
                    EXTRACT(YEAR FROM c.CRASHDATE) AS CRASHYEAR, 
                    CASE
                        WHEN c.SPEEDLIMIT BETWEEN 0 AND 35 THEN '0-35'
                        ELSE '35+'
                    END AS SPEED_GROUP,
                    COUNT(*) AS CRASHCOUNT
                FROM DCIUCULIN.CRASHES c
                GROUP BY EXTRACT(YEAR FROM c.CRASHDATE), 
                CASE
                    WHEN c.SPEEDLIMIT BETWEEN 0 AND 35 THEN '0-35'
                    ELSE '35+'
                END
                ORDER BY CRASHYEAR, SPEED_GROUP
            `;
            const result = await connection.execute(sqlQuery6);
            await connection.close();
            return result.rows;

        } catch (error) {
            return error;
        }
    }
    fetchDataHighway()
    .then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})

app.get('/day', (req, res) => {
    async function fetchDataDOW(){
        try {
            const connection = await oracledb.getConnection(dbConnect);

            const sqlQuery5 = `
                SELECT 
                    EXTRACT(YEAR FROM c.CRASHDATE) AS Year,
                    TO_CHAR(c.CRASHDATE, 'Day') AS Weekday,
                    COUNT(*) AS NumberOfCrashes
                FROM 
                    DCIUCULIN.crashes c 
                WHERE 
                    c.CRASHDATE >= DATE '2018-01-01' AND
                    EXTRACT(YEAR FROM c.CRASHDATE) < 2024
                GROUP BY 
                    EXTRACT(YEAR FROM c.CRASHDATE),
                    TO_CHAR(c.CRASHDATE, 'Day')
                ORDER BY 
                    Year,
                    CASE 
                        WHEN TRIM(TO_CHAR(c.CRASHDATE, 'Day')) = 'Monday' THEN 1
                        WHEN TRIM(TO_CHAR(c.CRASHDATE, 'Day')) = 'Tuesday' THEN 2
                        WHEN TRIM(TO_CHAR(c.CRASHDATE, 'Day')) = 'Wednesday' THEN 3
                        WHEN TRIM(TO_CHAR(c.CRASHDATE, 'Day')) = 'Thursday' THEN 4
                        WHEN TRIM(TO_CHAR(c.CRASHDATE, 'Day')) = 'Friday' THEN 5
                        WHEN TRIM(TO_CHAR(c.CRASHDATE, 'Day')) = 'Saturday' THEN 6
                        WHEN TRIM(TO_CHAR(c.CRASHDATE, 'Day')) = 'Sunday' THEN 7
                    END
            `;
            const result = await connection.execute(sqlQuery5);
            await connection.close();
            return result.rows;

        } catch (error) {
            return error;
        }
    }
    fetchDataDOW()
    .then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})

app.listen(PORT, 
    () => {
        console.log(`listen to port ${PORT}`);
    })