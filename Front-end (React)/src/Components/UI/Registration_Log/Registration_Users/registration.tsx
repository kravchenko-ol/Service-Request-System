import { useContext, useState } from 'react';
import './registration.css';
import { AnimContext } from '../../../../Animation/animLogReg';
import { SubmitBtn } from '../../Components/Buttons/buttons';
import type { IRegistrationData } from '../../../../Types/type';
import { upperCaseLetters, specialSymbols } from '../inspectArray';
import { useNavigate } from 'react-router';
const API_URL = import.meta.env.VITE_API_URL;;

export default function Registration () {
    const navigate = useNavigate();
    const anim = useContext(AnimContext);
    const [data, setData] = useState<IRegistrationData>(
        {
            id: '',
            name: '',
            email: '',
            phone: '',
            age: '',
            sex: 'men',
            password: '',
            repeatPassword: ''
        }
    );
    const [error, setError] = useState<Omit<IRegistrationData, 'repeatPassword' | 'id' | 'role'>>(
        {
            name: '',
            email: '',
            phone: '',
            age: '',
            sex: 'men',
            password: ''
        }
    );

    async function inspectionRegistration(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!data.name && !data.email && !data.password && !data.age && !data.phone) {
            setError({
                name: `Ім'я не було введено`,
                email: 'Email не був введений',
                phone: 'Телефон не був введений',
                age: 'Не задано вік',
                password: 'Пароль не був введений'
            });

            setTimeout(() => {
                setError({
                    name: '',
                    email: '',
                    phone: '',
                    age: '',
                    password: ''
                });
            }, 5000);
            return;
        };

        if (data.name.length < 4) {
            setError((errors) => ({
                ...errors,
                name: `Не коректне ім'я`
            }));

            setTimeout(() => {
                setError((errors) => ({
                    ...errors,
                    name: '',
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

        if (!data.age) return;

        if (+data.age < 18) {
            setError((errors) => ({
                ...errors,
                age: 'Вам менше 18 років',
            })
            );

            setTimeout(() => {
                setError((errors) => ({
                    ...errors,
                    age: '',
                })
                );
            }, 5000);
            return;
        };

        if (data.phone.length < 13 || data.phone.length < 9 || data.phone.length > 13) {
            setError((errors) => ({
                ...errors,
                phone: 'Не вірний номер телефону',
            })
            );

            setTimeout(() => {
                setError((errors) => ({
                    ...errors,
                    phone: '',
                })
                );
            }, 5000);
            return;
        };

        const hasUpperCase = [...data.password].some(symbol => upperCaseLetters.includes(symbol));
        const hasSpecSymbol = [...data.password].some(symbol => specialSymbols.includes(symbol));

        if ((data.password.length < 8) || !hasUpperCase || !hasSpecSymbol) {
            setError((errors) => ({
                ...errors,
                password: 'Пароль містить меньше 8 символів або не містить велику літеру або не містить спеціальний символ',
            })
            );

            setTimeout(() => {
                setError((errors) => ({
                    ...errors,
                    password: '',
                })
                );
            }, 5000);
            return;
        };

        if (data.password !== data.repeatPassword) {
            setError((errors) => ({
                ...errors,
                password: 'Пароль не співпадають',
            })
            );

            setTimeout(() => {
                setError((errors) => ({
                    ...errors,
                    password: '',
                })
                );
            }, 5000);
            return;
        };

        try {
            const response = await fetch(`${API_URL}/api/Account/register`,
                {
                    method: `POST`,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }
            );

            if (!response.ok) {
                setError((errors) => ({
                    ...errors,
                    email: 'Користувач з такими даними вже існує',
                    phone: 'Користувач з такими даними вже існує'
                }));

                setTimeout(() => {
                    setError((errors) => ({
                        ...errors,
                        email: '',
                        phone: ''
                    })
                    );
                }, 5000);

                throw new Error(`Response Error: ${response.status}`);
            };

            await navigate('/login');
        } catch (error) {
            console.log(error);
        }

        setData({
            id: '',
            name: '',
            email: '',
            phone: '',
            age: '',
            sex: 'men',
            password: '',
            repeatPassword: ''
        });
    };

    return (
        <div className={`mainReg ${anim}`}>
            <h1>Registration</h1>

            <form onSubmit={inspectionRegistration}>

                <div className={`inputDiv ${error.name && 'error'}`}>
                    <label htmlFor="name">Name:</label>
                    <input 
                        id='name'
                        type="text" 
                        className={error.name && 'error'}
                        value={error.name ? error.name : data.name}  
                        onChange={(e) => 
                            setData((old) => ({
                                ...old,
                                name: e.target.value
                            }))
                        } 
                    />
                </div>

                <div className='inputDiv'>
                    <label htmlFor="email">Email:</label>
                    <input 
                        id='email'
                        type="text" 
                        className={error.email && 'error'}
                        value={error.email ? error.email : data.email} 
                        onChange={(e) => 
                            setData((old) => ({
                                ...old,
                                email: e.target.value
                            }))
                        } 
                    />
                </div>

                <div className='inputDiv'>
                    <label htmlFor="phone">Phone:</label>
                    <input 
                        id='phone'
                        type="text" 
                        className={error.phone && 'error'}
                        value={error.phone ? error.phone : data.phone} 
                        onChange={(e) => 
                            setData((old) => ({
                                ...old,
                                phone: e.target.value
                            }))
                        } 
                    />
                </div>

                <div className='inputDiv'>
                    <label htmlFor="age">Age:</label>
                    <input 
                        id='age'
                        type="text" 
                        className={error.age?.toString() && 'error'}
                        value={error.age ? error.age : data.age} 
                        onChange={(e) => 
                            setData((old) => ({
                                ...old,
                                age: e.target.value
                            }))
                        } 
                    />
                </div>

                <div className='inputDiv'>
                    <label htmlFor="password">Password:</label>
                    <input 
                        id='password'
                        type={error.password ? "text" : "password"} 
                        className={error.password && 'error'}
                        value={error.password ? error.password : data.password} 
                        onChange={(e) => 
                            setData((old) => ({
                                ...old,
                                password: e.target.value
                            }))
                        } 
                    />
                </div>

                <div className='inputDiv'>
                    <label htmlFor="sex">Sex:</label>
                    <input 
                        id='sex'
                        type="text" 
                        value={data.sex} 
                        onChange={(e) => 
                            setData((old) => ({
                                ...old,
                                sex: e.target.value as IRegistrationData['sex']
                            }))
                        } 
                    />
                </div>
            

                <div className='inputDiv'>
                    <label htmlFor="reEnter">Re-enter your password:</label>
                    <input 
                        id='reEnter'
                        type={error.password ? "text" : "password"} 
                        className={error.password && 'error'}
                        value={error.password ? error.password : data.repeatPassword} 
                        onChange={(e) => 
                            setData((old) => ({
                                ...old,
                                repeatPassword: e.target.value
                            }))
                        } 
                    />
                </div>
            
                <div className='formBtn'>
                    <SubmitBtn text='Registrtion'/>
                </div>
            </form>
        </div>
    )
};