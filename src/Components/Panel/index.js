import './index.scss';
import { Link, NavLink } from 'react-router-dom';

const Panel = () => {
    return (
        <div className='bar'>

            <h1 className='text'>Chicago Crashes</h1>

            <nav>
                <NavLink exact='true' activeclassname='active' className='query' to='/query'>
                    <div>Query</div>
                </NavLink>

                <NavLink exact='true' activeclassname='active' className='search' to='/search'>
                    <div>Search</div>
                </NavLink>

                <NavLink exact='true' activeclassname='active' className='about' to='/about'>
                    <div>About</div>
                </NavLink>
            </nav>

        </div>
    )
}

export default Panel;