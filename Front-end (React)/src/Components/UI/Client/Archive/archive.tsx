import { Outlet } from 'react-router';
import './archive.css';
import ShowRequest from './Show_Request/showRequest';

export default function Archive () {
    return (
        <div className='mainArchive'>
            <ShowRequest/>
            <Outlet/>
        </div>
    )
}