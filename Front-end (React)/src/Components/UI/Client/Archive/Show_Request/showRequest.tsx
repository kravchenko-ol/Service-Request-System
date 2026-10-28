import { useContext, useState } from 'react';
import { ThemContext } from '../../../../../Theme/themeContext';
import './showRequest.css';
import '../../../../../Theme/theme.css'
import { useNavigate, useParams } from 'react-router';
import { themeStatus } from '../../../../../Theme/themeObj';
import useFetch from '../../../../../Hooks/useFetch';
import type { IGetRequestData } from '../../../../../Types/type';
export const API_URL = import.meta.env.VITE_API_URL;
import { SessionContext } from '../../../../../Context/Contexts';

export default function ShowRequest() {
    const { id } = useParams();
    const navigate = useNavigate();
    const session = useContext(SessionContext);
    const {data: requestsDb} = useFetch<Array<IGetRequestData>>(`${API_URL}/api/Requests`);
    const requests: Array<IGetRequestData> = requestsDb?.filter(req => req.authorId === session?.sess?.id) as Array<IGetRequestData>;
    const themObj = useContext(ThemContext);
    const them = themObj?.theme;
    const [closeMenu, setCloseMenu] = useState<string>('');
    const [search, setSearch] = useState<string>('');

    return (
        <div className={`showReq ${closeMenu}`}>

            {
                closeMenu === 'close' ?
                    <div 
                        className='open'
                        onClick={() => setCloseMenu('')}
                    >
                        <img src={them === 'light' ? `${import.meta.env.BASE_URL}/img/double-right-black.png` : `${import.meta.env.BASE_URL}/img/double-right-ligtht.png`} alt="" width={16}/>
                    </div>
                :
                    <>
                        <div className='head'>
                            <div 
                                className='closeBlock'
                                onClick={() => setCloseMenu('close')}
                            >
                                <img src={them === 'light' ? `${import.meta.env.BASE_URL}/img/menu-black.png` : `${import.meta.env.BASE_URL}/img/menu-ligtht.png`} alt="" width={20}/>
                            </div>
                            <h4>My Requests</h4>
                        </div>

                        <div className='searchReq'>
                            <div className='divInpt'>
                                <img src={`${import.meta.env.BASE_URL}/img/icons8-search-52.png`} alt="" width={16}/>
                                <input 
                                    type="text" 
                                    placeholder='Search Requests'
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className='requests'>
                            { 
                                !search ?
                                    requests?.map(request => {
                                        return (
                                            <div 
                                                key={request.id} 
                                                className={`request ${request.id === id ? 'active' : ''}`}
                                                onClick={() => navigate(`/archive/${request.id}`)}
                                            >
                                                <div className='info'>
                                                    <div className='reqTitle'>
                                                        <h5>{request.title}</h5>
                                                        <p>{request.createAt}</p>
                                                    </div>
                                                    
                                                    <div className='infoCheck'>
                                                        <p>{request.id}</p>

                                                        <div className='eyeCheckStatus'>
                                                            <div className=
                                                                {
                                                                    `status 
                                                                    ${themeStatus[request.status.toLocaleLowerCase().replaceAll('-', '') as keyof typeof themeStatus]}`
                                                                }
                                                            >
                                                                <p>{request.status}</p>
                                                            </div>
                                                            <div className='eyeCheck'>
                                                                <p>{request.comments.length}</p>
                                                                <img
                                                                    src=
                                                                    {them === 'light' ? `${import.meta.env.BASE_URL}/img/eye-black.png` :
                                                                        `${import.meta.env.BASE_URL}/img/eye-ligth.png`} alt="" width={14} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                :
                                    requests?.filter(request => request.title.toLowerCase().includes(search.toLowerCase()) ||
                                            request.id.toLowerCase().includes(search.toLowerCase()) ||
                                            request.createAt.includes(search)
                                        ).map(request => {
                                            return (
                                                <div 
                                                    key={request.id} 
                                                    className={`request ${request.id === id ? 'active' : ''}`}
                                                    onClick={() => navigate(`/archive/${request.id}`)}
                                                >
                                                    <div className='info'>
                                                        <div className='reqTitle'>
                                                            <h5>{request.title}</h5>
                                                            <p>{request.createAt}</p>
                                                        </div>
                                                        
                                                        <div className='infoCheck'>
                                                            <p>{request.id}</p>

                                                            <div className='eyeCheckStatus'>
                                                                <div className=
                                                                    {
                                                                        `status 
                                                                        ${themeStatus[request.status.toLocaleLowerCase().replaceAll('-', '') as keyof typeof  themeStatus]}`
                                                                    }
                                                                >
                                                                    <p>{request.status}</p>
                                                                </div>
                                                                <div className='eyeCheck'>
                                                                    <p>{request.comments.length}</p>
                                                                    <img src={them === 'light' ? `${import.meta.env.BASE_URL}/img/eye-black.png` : `${import.meta.env.BASE_URL}/img/eye-ligth.png`} alt="" width={14}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                            }
                        </div>
                    </>
            }
        </div>
    )
};