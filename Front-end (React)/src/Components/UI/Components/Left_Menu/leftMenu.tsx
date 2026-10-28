import { NavLink, useNavigate } from 'react-router';
import './leftMenu.css';
import { ThemeButton } from '../Buttons/buttons';
import { useContext, useEffect, useState } from 'react';
import { ThemContext } from '../../../../Theme/themeContext';
import { OperatorSessionContext } from '../../../../Context/Contexts';
import useFetch from '../../../../Hooks/useFetch';
import type { ITicket } from '../../../../Types/type';
export const API_URL = import.meta.env.VITE_API_URL;

export function LeftMenu() {
    const themObj = useContext(ThemContext);
    const them = themObj?.theme;

    return (
        <header className='menu'>
            <nav>
                    <NavLink to={'archive'} 
                            children={({ isActive }) => (
                                <>
                                    <img src={
                                            isActive ? '/img/archiveY-96.png' : them === 'light' ? '/img/archiveB-96.png' : '/img/archiveW.png'} width={25} 
                                    />
                                </>
                            )}
                    />

                    <NavLink to={'createReq'} 
                            children={({ isActive }) => (
                                <>
                                    <img src={
                                            isActive ? '/img/plusY-96.png' : them === 'light' ? '/img/plusB-96.png' : '/img/plusW.png'} width={25} 
                                    />
                                </>
                            )}
                    />

                    <NavLink to={'acc'} 
                            children={({ isActive }) => (
                                <>
                                    <img src={
                                            isActive ? '/img/settingY-96.png' : them === 'light' ? '/img/settingB-96.png' : '/img/settingW.png'} width={25} 
                                    />
                                </>
                            )}
                    />
                    
                    <ThemeButton/>
            </nav>
        </header>
    )
};

export function LeftMenuOp() {
    const navigate = useNavigate();
    const session = useContext(OperatorSessionContext);
    const { data: tickets, refetch: refetchLength } = useFetch<Array<ITicket> | null>(`${API_URL}/api/Ticket/operator/${session?.sessOp?.id}`);

    useEffect(() => { 
        refetchLength();
    });
    
    const [closeMenu, setCloseMenu] = useState<boolean>(false);

    function exitAcc() { 
        sessionStorage.removeItem('token');
        session?.setSessOP(null);
        navigate('/');
    };

    return (
        <div className={closeMenu === false ? 'leftMenuOp' : 'closeMenu'}>

                { closeMenu === false ?
                    <>
                        <div className='headOp'>
                            <div className='iconDiv'>
                                <img src="/img/LogoBlack.png" alt="" width={48}/>
                                <h6>Service Desk Management</h6>
                            </div>

                            <div 
                                className='iconClose'
                                onClick={() => setCloseMenu(true)}
                            >
                                <img src="/img/icons8-left-2-100.png" alt="" width={24}/>
                            </div>
                        </div>

                        <div className='mainNav'>
                            <NavLink to={'/tickets'} end  className={'nav'} children={({isActive}) => (
                                <div className={`navDiv ${isActive && 'active'}`}>
                                    <div className='tickIcon'>
                                        <img src="/public/img/ticket.png" alt="" width={24}/>
                                        <p>Tikets</p>
                                    </div>
                                        <p className='newReq'>
                                            { tickets?.find(ticket => ticket.name === "New")?.requests.length }
                                        </p>
                                </div>
                            )}/>
                            
                            <NavLink to={'/analytics'} end className={'nav'}  children={({isActive}) => (
                                <div className={`navDiv ${isActive && 'active'}`}>
                                    <img src="/img/analytics.png" alt="" width={24}/>
                                    <p>Analytics</p>
                                </div>
                            )}/>

                            {/* <div className='online'>
                                <details>
                                    <summary>Online</summary>
                                    {
                                        operators?.arrOperators.map(operator => {
                                            return (
                                                <div key={operator.id} className='onlineOp'>
                                                    { operator.id === session?.sessOp.id ?
                                                        <>
                                                            <img src="/img/free-icon-user-219970.png" alt="" width={24}/>
                                                            <p>Me</p>
                                                        </>
                                                        :
                                                        <>
                                                            <img src="/img/free-icon-user-219970.png" alt="" width={24}/>
                                                            <p>{operator.name}</p>
                                                            <p>{operator.role}</p>
                                                        </>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </details>
                            </div> */}
                        </div>
                    </>
                    :
                    <>
                        <div className='headOpClose'>
                            <div className='closeIconDiv'>
                                <img src="/img/LogoBlack.png" alt="" width={24}/>
                            </div>

                            <div 
                                className='iconOpen'
                                onClick={() => setCloseMenu(false)}
                            >
                                <img src="/img/icons8-forward-arrow-100.png" alt="" width={18}/>
                            </div>
                        </div>

                        <div className='mainNavclose'>
                                <NavLink to={'/tickets'} end  className={'navClose'} children={({isActive}) => (
                                    <div className={`navDivclose ${isActive && 'active'}`}>
                                        <div className='tickIconclose'>
                                            <img src="/public/img/ticket.png" alt="" width={24}/>
                                        </div>
                                        <p className='newReqclose'>
                                            { tickets?.find(ticket => ticket.name === "New")?.requests.length }
                                        </p>
                                    </div>
                                )}/>

                                <NavLink to={'/analytics'} end className={'navClose'} children={({isActive}) => (
                                    <div className={`navDivclose ${isActive && 'active'}`}>
                                        <img src="/img/analytics.png" alt="" width={24}/>
                                    </div>
                                )}/>

                            {/* <div className='onlineClose'>
                                <details>
                                    <summary><div className='onlineBlock'></div></summary>
                                    {
                                        operators?.arrOperators.map(operator => {
                                            return (
                                                <>
                                                    <div key={operator.id} className='onlineOpClose'>
                                                        <img src="/img/free-icon-user-219970.png" alt="" width={24}/>
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                </details>
                            </div> */}
                        </div>
                    </>
                }
            <div className='btnClose'>
                <button
                    type='button'
                    className='close'
                    onClick={exitAcc}
                >
                    {
                        !closeMenu
                            ? "Exit"
                            : <img src="/public/img/exit.png" alt="" width={24}/>
                    }
                </button>
            </div>
        </div>
    )
};