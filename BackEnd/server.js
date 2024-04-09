const express = require('express');
const oracledb = require('oracledb')
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/data', (req, res) => {
    async function fetchData(){
        try {
            const connection = await oracledb.getConnection({
                user: 'patrickquinlan', //enter username
                password: '', //enter password
                connectString: 'oracle.cise.ufl.edu:1521/orcl'
            });

            const result = await connection.execute('SELECT * FROM Country'); //sample query
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

app.listen(PORT, 
    () => {
        console.log(`listen to port ${PORT}`);
    })