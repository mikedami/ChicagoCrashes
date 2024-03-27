import './index.scss';
import Panel from '../Panel/index.js';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return(
    <>
        <div className='App'>
            <Panel />
            <div className='page'>
                <Outlet></Outlet>
            </div>
        </div>
    </>
    )
}

export default Layout;