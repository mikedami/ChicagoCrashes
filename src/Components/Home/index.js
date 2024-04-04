import './index.scss';
import '../../mainstyles.scss';
//import img from '../../Assets/Images/Chicago-scaled.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarCrash } from '@fortawesome/free-solid-svg-icons';


const Home = () => {
    return (
        <div className='main-content'>

            <p className='main-text'>
                Resolving the main causes of traffic collisions in Chicago
            </p>

            <div className='car'>
                <FontAwesomeIcon icon={faCarCrash} color='black'/>
            </div>

            <ul>
                <li>What are the main causes of crashes?</li>
                <li>What streets are more dangerous?</li>
                <li>What are trends relating to collisions?</li>
            </ul>
            

        </div>
    )
}

export default Home;