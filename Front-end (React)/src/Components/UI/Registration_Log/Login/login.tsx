import { useContext, useState} from 'react';
import './login.css';
import { AnimContext } from '../../../../Animation/animLogReg';
import type { IErrorLogin, ILoginData } from '../../../../Types/type';
import { SubmitBtn } from '../../Components/Buttons/buttons';
import { OperatorSessionContext, SessionContext } from '../../../../Context/Contexts';
import { useNavigate } from 'react-router';
const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
    const navigate = useNavigate();
    const anim = useContext(AnimContext);
    const session = useContext(SessionContext);
    const sessionOperator = useContext(OperatorSessionContext);

    const [data, setData] = useState<ILoginData>(
        {
            email: '',
            password: ''
        }
    );
    const [error, setError] = useState<IErrorLogin>(
        {
            email: '',
            password: '',
            noneUser: ''
        }
    );

    async function inspectionLogin (e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!data.email && !data.password) {
            setError((errors) => ({
                    ...errors,
                    email: 'Email не був введений',
                    password: 'Пароль не був введений'
                }));

                setTimeout(() => {
                setError((errors) => ({
                    ...errors,
                    email: '',
                    password: ''
                }));
            }, 5000);
            return;
        };

        if (!data.email.includes('@')) {
            setError((errors) => ({
                    ...errors,
                    email: 'Не коректна адреса',
                })
            );

            setTimeout(() => {
                setError((errors) => ({
                        ...errors,
                        email: '',
                    })
                );
            }, 5000);
            return;
        };

        try {
            const response = await fetch(`${API_URL}/api/login`, 
                {
                    method: `POST`,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }
            );

            if (!response.ok) throw new Error(`Error ${response.status}`);
            
            const loginData = await response.json();
            sessionStorage.setItem('token', loginData.jwt);

            const token = sessionStorage.getItem('token');

            const responseAccount = await fetch(`${API_URL}/api/Account/${loginData.dtoAccount.id}`, 
                {
                    method: `GET`,
                    headers: { 'Authorization': `Bearer ${token}` },
                }
            );

            if (!responseAccount.ok) {
                throw new Error(`ErrorBearer: ${responseAccount.status}`)
            };

            if (loginData.dtoAccount.role === 'User') {
                session?.setSess(loginData.dtoAccount);
                await navigate('acc');
            };

            if (loginData.dtoAccount.role === 'Operator') {
                sessionOperator?.setSessOP(loginData.dtoAccount);
                await navigate('/tickets');
            };
        } catch (error) {
            console.log(error);
        };

        setData({
            email: '',
            password: ''
        });
    };

    return (
        <div className={`mainLog ${anim}`}>
            <h1>Login</h1>

            <form onSubmit={inspectionLogin}>
                <div className='inputDiv'>
                    <label htmlFor="logEmail">Email:</label>
                    <input 
                        id='logEmail'
                        type="text" 
                        value={data.email} 
                        onChange={(e) => 
                            setData((old) => ({
                                ...old,
                                email: e.target.value
                            }))
                        } 
                    />
                    {error.email ? <p className='error'>{error.email}</p> : <></>}
                </div>

                <div className='inputDiv'>
                    <label htmlFor="pass">Password:</label>
                <input 
                        id='pass'
                        type="password" 
                        value={data.password} 
                        onChange={(e) => 
                            setData((old) => ({
                                ...old,
                                password: e.target.value
                            }))
                        } 
                    />
                    {error.password ? <p className='error'>{error.password}</p> : <></>}
                </div>

                <div className='formBtn'>
                    <SubmitBtn text='Login'/>
                </div>
            </form>
        </div>

    )
};