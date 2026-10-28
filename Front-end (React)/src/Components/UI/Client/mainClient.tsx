import { Outlet } from 'react-router';
import Header from '../Components/Header/header';
import './mainClient.css';
import './../../../Theme/theme.css'
import { LeftMenu } from '../Components/Left_Menu/leftMenu';

export default function MainClient () {
    return (
        <div className='mainClient'>
            <Header/>
            <Outlet/>
            <LeftMenu/>
        </div>
    )
}