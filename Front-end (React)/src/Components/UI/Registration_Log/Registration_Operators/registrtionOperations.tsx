import React, { useState } from 'react';
import './registrtionOperations.css';
import type { IOperatorRegistration } from '../../../../Types/type';
import { SubmitBtn } from '../../Components/Buttons/buttons';
import { useNavigate } from 'react-router';
import { specialSymbols, upperCaseLetters } from '../inspectArray';
const API_URL = import.meta.env.VITE_API_URL;

export default function RegistrtionOperations() {
    const navigate = useNavigate();

    const [data, setData] = useState<IOperatorRegistration>({
        id: '',
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    const [error, setError] = useState<Omit<IOperatorRegistration, 'role'>>({
        id: '',
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    async function createOperator(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const newErrors: Omit<IOperatorRegistration, 'role'> = {
            id: '',
            name: '',
            email: '',
            phone: '',
            password: ''
        };

        if (!data.name) {
            newErrors.name = `Ім'я не заповнено`;
        };

        if (!data.email) {
            newErrors.email = 'Email не заповений';
        } else if (!data.email.includes('@')) {
            newErrors.email = 'Не вірний Email'
        }

        if (!data.phone) {
            newErrors.phone = 'Номер телефону не зповнено';
        } else if ([...data.phone].length < 9 || [...data.phone].length > 13) {
            newErrors.phone = 'Не вірний номер телефону'
        }

        const hasUpperCase = [...data.password].some(symbol => upperCaseLetters.includes(symbol));
        const hasSpecSymbol = [...data.password].some(symbol => specialSymbols.includes(symbol));

        if (!data.password) {
            newErrors.password = 'Пароль не був заповнений';
        } else if ((data.password.length < 8)) {
            newErrors.password = 'Пароль містить меньше 8 символів'
        } else if (!hasUpperCase) {
            newErrors.password = 'Пароль містить велику літеру'
        } else if (!hasSpecSymbol) {
            newErrors.password = 'Пароль не містить спец символ'
        }

        try {
            const response = await fetch(`${API_URL}/api/Account/register-operator`,
                {
                    method: `POST`,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }
            );

            if (!response.ok) {
                newErrors.email = 'Користувач з такими даними вже існує';
                newErrors.id = 'Користувач з такими даними вже існує';
                throw new Error(`Error ${response.status}`);
            }

            await navigate('/login');

        } catch (error) {
            console.log(error);
        };

        if (Object.values(newErrors).some(error => error !== '')) {
            setError((old) => ({...old, ...newErrors}));

            setTimeout(() => {
                setError((old) => ({
                    ...old,
                    id: '',
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                }));
            }, 3000);
            return;
        }
    };

    return (
        <div className='formDiv'>
            <form onSubmit={createOperator}>
                <h2>Registration Operator</h2>
                <div className={`inputDiv ${ error.id ? 'error' : data.id && 'okValue'}`}>
                    <label htmlFor="id">Id</label>
                    <input 
                        id='id'
                        type="text"
                        value={error.id ? error.id : data.id}
                        readOnly={error.id.length > 0}
                        onChange={(e) => setData((old) => ({...old, id: e.target.value}))}
                    />
                </div>

                <div className={`inputDiv ${error.name ? 'error' : data.name && 'okValue'}`}>
                    <label htmlFor="name">Name</label>
                    <input 
                        id='name'
                        type="text"
                        value={error.name ? error.name : data.name}
                        readOnly={error.name.length > 0}
                        onChange={(e) => setData((old) => ({...old, name: e.target.value}))}
                    />
                </div>

                <div className={`inputDiv ${error.email ? 'error' : data.email && 'okValue'}`}>
                    <label htmlFor="email">Email</label>
                    <input 
                        id='email'
                        type="text"
                        value={error.email ? error.email : data.email}
                        readOnly={error.email.length > 0}
                        onChange={(e) => setData((old) => ({...old, email: e.target.value}))}
                    />
                </div>

                <div className={`inputDiv ${error.phone ? 'error' : data.phone && 'okValue'}`}>
                    <label htmlFor="phone">Phone</label>
                    <input 
                        id='phone'
                        type="text"
                        value={error.phone ? error.phone : data.phone}
                        readOnly={error.phone.length > 0}
                        onChange={(e) => setData((old) => ({...old, phone: e.target.value}))}
                    />
                </div>

                <div className={`inputDiv ${error.password ? 'error' : data.password && 'okValue'}`}>
                    <label htmlFor="password">Password</label>
                    <input 
                        id='password'
                        type="text"
                        value={error.password ? error.password : data.password}
                        readOnly={error.password.length > 0}
                        onChange={(e) => setData((old) => ({...old, password: e.target.value}))}
                    />
                </div>
                <SubmitBtn text='Sign up'/>
            </form>
        </div>
    )
}