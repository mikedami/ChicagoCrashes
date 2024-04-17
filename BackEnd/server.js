const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

const dbConnect = {
    user: process.argv[2],
    password: process.argv[3],
    connectString: 'oracle.cise.ufl.edu:1521/orcl'
}

/*

To log in with your user name, 
just input 'username password' as 
command-line arguments when running the server.

*/

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
                SELECT COUNT(*) AS total_count FROM DCIUCULIN.CRASHES
                    UNION ALL
                SELECT COUNT(*) AS total_count FROM DCIUCULIN.DRIVERS
                    UNION ALL
                SELECT COUNT(*) AS total_count FROM DCIUCULIN.VEHICLES
            )
            `;
            const result = await connection.execute(sqlQuery);
            await connection.close();
            return result.rows;

        } catch (error){
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

app.get('/fRate', (req, res) => {
    async function fetchDataFatal(){
        try {
            const connection = await oracledb.getConnection(dbConnect);

            const sqlQuery1 = `
                SELECT 
                    EXTRACT(YEAR FROM CRASHDATE) AS Year, 
                    TRAFFICCONTROLDEVICE,
                    COUNT(CASE WHEN MOSTSEVERE = 'FATAL' THEN 1 END) AS FatalCrashes,
                    COUNT(*) AS TotalCrashes
                FROM 
                    DCIUCULIN.CRASHES
                GROUP BY 
                    EXTRACT(YEAR FROM CRASHDATE), TRAFFICCONTROLDEVICE
                ORDER BY 
                    Year, TRAFFICCONTROLDEVICE
            `;
            const result = await connection.execute(sqlQuery1);
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

app.get('/seasons', (req, res) => {
    async function fetchDataSeason(){
        try {
            const connection = await oracledb.getConnection(dbConnect);

            const sqlQuery2 = `
                SELECT 
                    season,
                    SUM(num_crashes) AS total_crashes
                FROM (
                    SELECT
                        CASE
                            WHEN EXTRACT(MONTH FROM crashdate) IN (12, 1, 2) THEN 'Winter'
                            WHEN EXTRACT(MONTH FROM crashdate) IN (3, 4, 5) THEN 'Spring'
                            WHEN EXTRACT(MONTH FROM crashdate) IN (6, 7, 8) THEN 'Summer'
                            WHEN EXTRACT(MONTH FROM crashdate) IN (9, 10, 11) THEN 'Fall'
                        END AS season,
                        COUNT(*) AS num_crashes
                    FROM 
                        DCIUCULIN.crashes c
                    GROUP BY 
                        EXTRACT(MONTH FROM crashdate)
                ) monthly_crashes
                GROUP BY 
                    season
                ORDER BY 
                    CASE season
                        WHEN 'Winter' THEN 1
                        WHEN 'Spring' THEN 2
                        WHEN 'Summer' THEN 3
                        WHEN 'Fall' THEN 4
                    END
            `;
            const result = await connection.execute(sqlQuery2);
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
                    ROUND(c.longitude, 3) AS longitude,
                    ROUND(c.latitude, 3) AS latitude,
                    COUNT(*) AS accidents
                FROM 
                    DCIUCULIN.crashes c 
                WHERE 
                    c.crashdate >= TRUNC(SYSDATE) - INTERVAL '10' YEAR
                GROUP BY 
                    ROUND(c.longitude, 3),
                    ROUND(c.latitude, 3)
                ORDER BY 
                accidents DESC
            `;
            
            const result = await connection.execute(sqlQuery3);
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

app.get('/speed', (req, res) => {
    async function fetchDataSpeed(){
        try {
            const connection = await oracledb.getConnection(dbConnect);

            const sqlQuery4 = `
                SELECT 
                    c.speedlimit,
                    COUNT(*) AS crashAmt
                FROM 
                    DCIUCULIN.crashes c
                GROUP BY 
                    speedlimit
                ORDER BY 
                    speedlimit
            `;
            
            const result = await connection.execute(sqlQuery4);
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

app.listen(PORT, 
    () => {
        console.log(`listen to port ${PORT}`);
    })