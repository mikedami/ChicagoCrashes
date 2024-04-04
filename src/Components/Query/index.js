import './index.scss';
import '../../mainstyles.scss';

const Query = () => {
    
    useEffect(()=>{
	const oracledb = require('oracledb');

	oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

	const mypw = "PASSWORD_HERE";	

	run();

    })

    async function run() {

	const connection = await oracledb.getConnection ({
		user          : "USERNAME_HERE",
        	password      : mypw,
	        connectString : "//oracle.cise.ufl.edu/orcl"
	});

	const result = await connection.execute(
	    `SELECT *
	    FROM crashes
	    WHERE ROWNUM < 2`,
	    // if you want to put a variable for a restriction
	    // put the var in the string as ':var'
	    // then put the value contained in [].
	);

	console.log(result.rows);
	await connection.close();
	
	}


    return (
        <div>Hello World</div>
    )
}

export default Query
