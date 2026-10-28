import { NavLink, useNavigate } from 'react-router';
import './header.css';
import { LogRegistrBtn } from '../Buttons/buttons';
import { useContext, useEffect, useState } from 'react';
import { SessionContext, SignalRContext } from '../../../../Context/Contexts';
import { navigationsSearch } from '../../../../Navigation/searchNavigation';
import useFetch from '../../../../Hooks/useFetch';
import type { IAccountData } from '../../../../Types/type';
export const API_URL = import.meta.env.VITE_API_URL;

export default function Header () {
    const session = useContext(SessionContext);
    const signalR = useContext(SignalRContext);
    const navigation = useNavigate();
    const [search, setSearch] = useState<string>('');
    const { data: user, refetch: refetchPhoto } = useFetch<IAccountData>(`${API_URL}/api/Account/${session?.sess?.id}`);

    useEffect(() => { 
            void refetchPhoto();
        }, [signalR?.dataUpdate, refetchPhoto]);

    const searchNavigations = navigationsSearch.filter(nav => 
        nav.keywoard.some(word => word.toLowerCase().includes(search.toLowerCase()))
    );
    
    return (
        <>
            <header>
                <nav>
                    <div className='icon'>

                    <NavLink to={'/'} end>
                        <img src={`${import.meta.env.BASE_URL}/MainIcon.png`} alt="" width={40}/>
                    </NavLink>

                    <h3>Service Desk</h3>
                    </div>

                    <div className='search'>
                        <div className='inpDiv'>
                            <img src={`${import.meta.env.BASE_URL}/img/icons8-search-52.png`} alt="" width={20}/>
                            <input 
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder='Search'
                            />
                        </div>
                    </div>

                    {
                        search && (
                            <div className='resultSearch'>
                                {
                                    searchNavigations.map(nav => {
                                        return (
                                            <div 
                                                className='navSeach'
                                                key={nav.path} 
                                                onClick={() => {
                                                    navigation(nav.path);
                                                    setSearch('');
                                                }}
                                            >
                                                {nav.title}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    }

                    <div className='rigthBlock'>
                        <NavLink to={'createReq'} className={'navigate'}>
                            <div className='createP'>
                                <p>Create +</p>
                            </div>
                        </NavLink>

                        {
                            session?.sess?.id ? 
                                <></> 
                                :
                                <div className='signLog'>
                                    <NavLink to={'login'}>
                                        <LogRegistrBtn text='login' styleClass='logRegistBtn'/>
                                    </NavLink>

                                    <NavLink to={'registration'}>
                                        <LogRegistrBtn text='Sign up' styleClass='logRegistBtn'/>
                                    </NavLink>
                                </div>
                        }

                        {
                            session?.sess?.id ?
                                <NavLink to={'acc'}>
                                    <img 
                                        src={user?.sex?.toLowerCase() === 'men' ?
                                            `${import.meta.env.BASE_URL}/img/free-icon-user-219970512.png` :
                                            `${import.meta.env.BASE_URL}/img/free-icon-user-219971512.png`} 
                                        alt="" 
                                        width={35}/>
                                </NavLink>
                                :
                                <></>
                        }
                    </div>
                </nav>
            </header>
        </>
    )
}