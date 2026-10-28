import { Outlet, useLocation, useNavigate } from 'react-router';
import './mainRegistrLog.css';
import { LogRegistrBtn } from '../Components/Buttons/buttons';
import { useState } from 'react';
import { AnimContext } from '../../../Animation/animLogReg';

export default function MainRegistrLog() {
    const navigate = useNavigate();
    const location = useLocation();
    const [anim, setAnim] = useState<''|'exit'|'enter'>('');

    function clickRegLog() {
        const loc = location.pathname === '/' ? '/registration' : '/';
        setAnim('exit');

        setTimeout(async () => {
            await navigate(loc);
            setAnim('enter');

            setTimeout(() => setAnim(''), 3000);
            
        }, 3000);
    };

    return (
        <AnimContext value={anim}>
            {
                location.pathname === '/registrationOperations' ?
                    <div className='mainRegOperator'>
                        <Outlet/>
                    </div>
                        :
                    <div className='mainRegLog'>
                        {
                            location.pathname === '/' ? 
                                <div className= 'mainModal'>
                                    <Outlet/>
                                    <div className={` btnDiv btnDivReg ${anim}`} >
                                        <LogRegistrBtn 
                                            text={'Registration'} 
                                            styleClass='registrBtn'
                                            click={clickRegLog}
                                        />
                                    </div>
                                </div>
                                    :
                                <div className= 'mainModal'>
                                    <div className={`btnDiv ${anim}`}>
                                        <LogRegistrBtn 
                                            text={'Login'} 
                                            styleClass='registrBtn'
                                            click={clickRegLog}
                                        />
                                    </div>
                                        <Outlet/>
                                </div>
                        }
                    </div>
            }
        </AnimContext>
    )
}