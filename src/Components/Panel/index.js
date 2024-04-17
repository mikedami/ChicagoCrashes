import './index.scss';
import { Link, NavLink } from 'react-router-dom';

const Panel = () => {
    return (
        <div className='bar'>
            
            <nav>
                <NavLink exact='true' activeclassname='active' className='text' to ='/'>
                    <h1 className='text'>Chicago Crashes</h1>
                </NavLink>

                <NavLink exact='true' activeclassname='active' className='query1' to='/query1'>
                    <div>Query 1</div>
                </NavLink>

                <NavLink exact='true' activeclassname='active' className='query2' to='/query2'>
                    <div>Query 2</div>
                </NavLink>

                <NavLink exact='true' activeclassname='active' className='query3' to='/query3'>
                    <div>Query 3</div>
                </NavLink>

                <NavLink exact='true' activeclassname='active' className='query4' to='/query4'>
                    <div>Query 4</div>
                </NavLink>

                <NavLink exact='true' activeclassname='active' className='query5' to='/query5'>
                    <div>Query 5</div>
                </NavLink>

                <NavLink exact='true' activeclassname='active' className='map' to='/map'>
                    <div>Map</div>
                </NavLink>

            </nav>

        </div>
    )
}

export default Panel;

/*
                <NavLink exact='true' activeclassname='active' className='search' to='/search'>
                    <div>Search</div>
                </NavLink>
*/