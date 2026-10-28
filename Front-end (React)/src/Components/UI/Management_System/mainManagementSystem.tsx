import { Outlet } from 'react-router';
import './mainManagementSystem.css';
import { LeftMenuOp } from '../Components/Left_Menu/leftMenu';

export default function MainManagementSystem() {
    
    return (
        <>   
            <div className='mainManag'>
                <LeftMenuOp/>
                <Outlet/>
            </div>
        </>
    )
}