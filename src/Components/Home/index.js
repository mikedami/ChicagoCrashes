import './index.scss';
import '../../mainstyles.scss';
//import img from '../../Assets/Images/Chicago-scaled.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarCrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

import Map from '../Map';

const Home = () => {

    const [count, setCount] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch('/count');
            const data = await response.json();
            console.log(data);
            setCount(data[0][0]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    return (
        <div className='main-content'>

            <p className='main-text'>
                Resolving the main causes of traffic collisions in Chicago
            </p>

            <div className='car'>
                <FontAwesomeIcon icon={faCarCrash} color='black'/>
            </div>

            <div className='count'>
                <button className='button' onClick={fetchData}>Total Number of Tuples</button>
                {count !== null && <p className='text-result'>Total Count: {count}</p>}
                
            </div>

            <Map/>

        </div>
    )
}

export default Home;