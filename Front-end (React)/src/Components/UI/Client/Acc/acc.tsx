import React, { useContext, useEffect, useState } from 'react';
import './acc.css';
import { SessionContext, SignalRContext } from '../../../../Context/Contexts';
import { BtnOnly, SubmitBtn } from '../../Components/Buttons/buttons';
import { useNavigate } from 'react-router';
import { ModalNotLog } from '../../Components/Modals/modals';
import useFetch from '../../../../Hooks/useFetch';
import type { IAccountData, IEditeUser } from '../../../../Types/type';
export const API_URL = import.meta.env.VITE_API_URL;

export default function Acc () {
    const navigate = useNavigate();
    const session = useContext(SessionContext);
    const signalR = useContext(SignalRContext);
    const { data: user, refetch: refetchUser } = useFetch<IAccountData>(`${API_URL}/api/Account/${session?.sess?.id}`);
    const [activeSession, setActiveSession] = useState<boolean>(true);
    const [edit, setEdit] = useState<boolean>(false);
    const [editAcc, setEditAcc] = useState<IEditeUser>({
        name: '',
        email:'',
        phone: '',
        age: '',
        sex: 'men'
    });

    useEffect(() => { 
        void refetchUser();
    }, [signalR?.dataUpdate, refetchUser]);

    async function editUser(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!session?.sess?.id) {
            setActiveSession(false);
            return;
        };

        const token = sessionStorage.getItem('token');

        try {
            const responseEdit = await fetch(`${API_URL}/api/Account/${session.sess.id}`,
                {
                    method: `PUT`,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(editAcc)
                }
            );

            if (!responseEdit.ok) {
                throw new Error(`Error: ${responseEdit.status}`)
            };

            setEdit(false);
            session.setSess(old => {
                if (!old) return old;

                return {
                    ...old,
                    ...editAcc
                };
            });

        } catch (error) {
            console.log(error)
        }
    };

    function exiteAcc() {
        sessionStorage.removeItem('token');
        session?.setSess(null);
        navigate('/');
    };

    return (
        <>
            <div className='mainAcc'>
                <div className='formUser'>
                    <form onSubmit={editUser}>
                        <div className='divImg'>
                            <img 
                                src={
                                    (edit ? editAcc.sex?.toLowerCase() : user?.sex?.toLowerCase()) === 'men'
                                        ? `${import.meta.env.BASE_URL}/img/free-icon-user-219970512.png`
                                        : `${import.meta.env.BASE_URL}/img/free-icon-user-219971512.png`
                                } 
                                alt="Photo user" 
                                width={250}
                            />
                        </div>

                        <div className='divsInfo'>
                            <div className='divForm'>
                                <label htmlFor="name">Name</label>
                                <input 
                                    className={edit ? 'edit' : ''}
                                    type="text"
                                    value={edit ? editAcc.name : user?.name}
                                    readOnly={!edit}
                                    onChange={(e) => setEditAcc((old) => ({
                                            ...old,
                                            name: e.target.value
                                        }))
                                    }
                                />
                            </div>

                            <div className='divForm'>
                                <label htmlFor="name">Age</label>
                                <input 
                                    className={edit ? 'edit' : ''}
                                    type="text"
                                    value={edit ? editAcc.age : user?.age ?? ''}
                                    readOnly={!edit}
                                    onChange={(e) => setEditAcc((old) => ({
                                            ...old,
                                            age: e.target.value
                                        }))
                                    }
                                />
                            </div>

                            <div className='divForm'>
                                <label htmlFor="name">Sex</label>
                                <input 
                                    className={edit ? 'edit' : ''}
                                    type="text"
                                    value={edit ? editAcc.sex : user?.sex ?? ''}
                                    readOnly={!edit}
                                    onChange={(e) => setEditAcc((old) => ({
                                            ...old,
                                            sex: e.target.value as IEditeUser['sex']
                                        }))
                                    }
                                />
                            </div>

                            <div className='divForm'>
                                <label htmlFor="name">Email</label>
                                <input 
                                    className={edit ? 'edit' : ''}
                                    type="text"
                                    value={edit ? editAcc.email : user?.email ?? ''}
                                    readOnly={!edit}
                                    onChange={(e) => setEditAcc((old) => ({
                                            ...old,
                                            email: e.target.value
                                        }))
                                    }
                                />
                            </div>

                            <div className='divForm'>
                                <label htmlFor="name">Phone</label>
                                <input
                                    className={edit ? 'edit' : ''}
                                    type="text"
                                    value={edit ? editAcc.phone : user?.phone ?? ''}
                                    readOnly={!edit}
                                    onChange={(e) => setEditAcc((old) => ({
                                            ...old,
                                            phone: e.target.value
                                        }))
                                    }
                                />
                            </div>
                            <div className='buttons'>
                                <BtnOnly text='Edit' click={() => {
                                        if (!session?.sess || !user) {
                                            setActiveSession(false);
                                            return;
                                        };
                                        setEditAcc({
                                            name: user?.name,
                                            email: user?.email,
                                            phone: user?.phone,
                                            age: user?.age,
                                            sex: user?.sex,
                                        });
                                        setEdit(true);
                                    }}/>
                                <SubmitBtn text='Save'/>
                            </div>
                        </div>
                        <BtnOnly text='Exite' click={() => {
                                    if (!session?.sess?.id) {
                                        setActiveSession(false);
                                        return;
                                    };
                                    exiteAcc();
                                }}/>
                    </form>
                </div>
            </div>
            {!activeSession ? <ModalNotLog className='anim'/> : <></>}
        </>
    )
}