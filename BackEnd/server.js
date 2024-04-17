const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
/*

To log in with your user name, 
just input 'username password' as 
command-line arguments when running the server.

*/

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send("Hello World")
})


// THE ONE FOR THE MAP
app.post('/data', (req, res) => {
    async function fetchData(){
        console.log("queried!");
        try {
            const connection = await oracledb.getConnection({
                user: process.argv[2], //enter username
                password: process.argv[3], //enter password
                connectString: 'oracle.cise.ufl.edu:1521/orcl'
            });

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

            const query = `SELECT /*+ PARALLEL(a, 8) */ *
            FROM TABLE(sdo_PointInPolygon(
              CURSOR(select longitude x, latitude y, crashes.* from DCIUCULIN.crashes),
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

app.get('/tuplebutton',  (req, res) => {
    async function fetchData(){
        try {
            const connection = await oracledb.getConnection({
                user: process.argv[2], //enter username
                password: process.argv[3], //enter password
                connectString: 'oracle.cise.ufl.edu:1521/orcl'
            });

            const query = `SELECT count(*) from crashes`

            const result = await connection.execute(query);
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

app.get('/data', (req, res) => {
    async function fetchData(){
        try {
           

            const connection = await oracledb.getConnection({
                user: process.argv[2], //enter username
                password: process.argv[3], //enter password
                connectString: 'oracle.cise.ufl.edu:1521/orcl'
            });

            const GeomType = await connection.getDbObjectClass("MDSYS.SDO_GEOMETRY");
            
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
    fetchData()
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