import { useContext, useEffect, useState } from 'react';
import './createRequests.css';
import type { IAccountData, IPostRequestData, TCategory, TPriority, TStatus } from '../../../../Types/type';
import { SessionContext, SignalRContext } from '../../../../Context/Contexts';
import { SubmitBtn } from '../../Components/Buttons/buttons';
import '../../../../Theme/theme.css'
import { ModalNotLog } from '../../Components/Modals/modals';
import useFetch from '../../../../Hooks/useFetch';
import type React from 'react';
const API_URL = import.meta.env.VITE_API_URL;

export default function CreateRequests () {
    const session = useContext(SessionContext);
    const signalR = useContext(SignalRContext);
    const { data: user, refetch: refetchUser } = useFetch<IAccountData>(`${API_URL}/api/Account/${session?.sess?.id}`);

    useEffect(() => { 
        void refetchUser();
    }, [signalR?.dataUpdate, refetchUser]);

    const [activeSession, setActiveSession] = useState<boolean>(true);
    const [data, setData] = useState<IPostRequestData>(
        {
            title: '',
            description: '',
            category: 'Web',
            priority: 'Low',
            status: 'New',
            authorId: session?.sess?.id as IAccountData['id'],
            comments: []
        }
    );

    const [errors, setErrors] = useState(
        {
            titleError: '',
            subError: '',
        }
    );

    async function saveRequests(e: React.SubmitEvent<HTMLElement>) {
        e.preventDefault();

        if (!session?.sess?.id) {
            setActiveSession(false);
            return;
        };

        if (!data.title && !data.description) {
            setErrors((old) => ({
                    ...old,
                    titleError: 'Заголовок не введений',
                    subError: 'Опис не заповнений'
                })
            );

            setTimeout(() => {
                setErrors({
                    subError: '',
                    titleError: ''
                })
            }, 5000);
            return;
        };

        try {
            const response = await fetch(`${API_URL}/api/Requests`,
                {
                    method: `POST`,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            };

            setData((old) => ({
                ...old,
                title: '',
                description: '',
                categoryId: '',
                priority: 'Low',
                status: 'New',
            }));

        } catch (error) {
            console.log(error);
        };
    };

    return (
        <>
            <div className='mainCreate'>
                <div className='divForm'>
                    <form onSubmit={saveRequests}>
                        <h2>Request</h2>

                        <div className='reqDivIn reqDivInTitle'>
                            <label htmlFor="title">Title</label>
                            <input 
                                id='title'
                                type="text" 
                                placeholder={errors.titleError ? errors.titleError : ''}
                                value={data.title}
                                onChange={(e) => setData((old) =>({
                                        ...old,
                                        title: e.target.value
                                    }))
                                }
                            />
                        </div>

                        <div className='dateProirStatDiv'>
                            <div className='reqDivIn'>
                                <label htmlFor="text">Date</label>
                                <input 
                                    id='text'
                                    type="text" 
                                    readOnly
                                    value={new Date().toLocaleDateString()}
                                />
                            </div>
                            <div className='reqDivIn'>
                                <label htmlFor="priority">Priority</label>
                                <select 
                                    name="priority" 
                                    id="priority"
                                    onChange={(e) => setData((old) => ({
                                            ...old,
                                            priority: e.target.value as TPriority
                                        }))
                                    }
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Higth">Higth</option>
                                </select>
                            </div>

                            <div className='reqDivIn'>
                                <label htmlFor="category">Category</label>
                                <select  
                                    id="category"
                                    onChange={(e) => setData((old) => ({
                                            ...old,
                                            category: e.target.value as TCategory
                                        }))
                                    }
                                >
                                    <option value="Web">Web</option>
                                    <option value="Mobile">Mobile</option>
                                    <option value="PC">PC</option>
                                    <option value="Software">Software</option>
                                </select>
                            </div>

                            <div className='reqDivIn'>
                                <label htmlFor="status">Status</label>
                                <input type='tex' id="status" value={'New'} readOnly/>
                            </div>
                        </div>

                        <div className='reqDivIndescr'>
                            <label htmlFor="desc">Description</label>
                            <textarea 
                                id='desc'
                                minLength={20}
                                maxLength={800}
                                placeholder={errors.subError ? errors.subError : 'No more than 800 characters...'}
                                value={data.description}
                                onChange={(e) => setData((old) => ({
                                        ...old,
                                        description: e.target.value as TStatus
                                    }))
                                }
                            />
                        </div>
                        <SubmitBtn text='Send'/>
                    </form>

                    <div className='senderInformDiv'>
                        <h2>Sender Information</h2>

                        <div className='reqDivIn'>
                            <label htmlFor="name">Name</label>
                            <input 
                                id='name'
                                type="text" 
                                value={user?.name}
                                readOnly
                            />
                        </div>

                        <div className='reqDivIn'>
                            <label htmlFor="email">Email</label>
                            <input 
                                id='email'
                                type="text" 
                                value={user?.email}
                                readOnly
                            />
                        </div>

                        <div className='reqDivIn'>
                            <label htmlFor="numb">Phone</label>
                            <input 
                                id='numb'
                                type="text" 
                                value={user?.phone}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </div>
            {!activeSession && <ModalNotLog className='anim'/>}
        </>
    )
}