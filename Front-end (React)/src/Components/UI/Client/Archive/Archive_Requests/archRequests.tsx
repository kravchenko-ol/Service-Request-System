import { useParams } from 'react-router';
import './archRequests.css';
import { useContext } from 'react';
import { SessionContext } from '../../../../../Context/Contexts';
import { ThemContext } from '../../../../../Theme/themeContext';
import { themeStatus } from '../../../../../Theme/themeObj';
import type { IGetRequestData } from '../../../../../Types/type';
import useFetch from '../../../../../Hooks/useFetch';
export const API_URL = import.meta.env.VITE_API_URL;

export default function ArchRequests() {
    const { id } = useParams();

    const session = useContext(SessionContext);
    const {data: request} = useFetch<IGetRequestData>(`${API_URL}/api/Requests/${id}`);

    const themObj = useContext(ThemContext);
    const them = themObj?.theme;

    return (
        <div className='mainDiv'>

            <div className='head'>
                <div className='title'>
                    <h3>{request?.title}</h3>

                    <div className='idCreate'>
                        <img src={them === 'light' ? '/img/bug-black.png' : '/img/bug-white.png'} alt="" width={20}/>
                        <p>
                            {request?.id} |
                            Created {request?.createAt}
                        </p>
                    </div>
                </div>

                <div className='searchReq'>
                    <div className='status'>
                        <p>Status:</p>
                        <div className=
                            {
                                `statusText
                                ${themeStatus[request?.status.toLocaleLowerCase().replaceAll('-', '') as keyof typeof themObj]}`
                            }
                        >
                            <p>{request?.status}</p>
                        </div>
                    </div>

                    <div className='category'>
                        <p>Category: {request?.category}</p>
                    </div>

                    <div className='view'>
                        <img src={them === 'light' ? '/img/eye-black.png' : '/img/eye-ligth.png'} alt="" width={16}/>
                        <p>{request?.comments.length}</p>
                    </div>
                </div>
            </div>

            <div className='descrComments'>

                <div className='descrReq'>
                    <div className='imgDiv'>
                        <img 
                            src={session?.sess?.sex === 'men' ? '/img/free-icon-user-219970.png' : '/img/free-icon-user-219971.png'} 
                            alt="" 
                            width={24} 
                        />
                        <h5>{session?.sess?.name}</h5>
                    </div>
                    <div className='decription'>
                        <p>{request?.description}</p>
                    </div>
                </div>

                <div className='comments'>
                    <h2>Offers</h2>
                    <div className='bodyComments'>
                        {
                            request?.comments.map(comment => {
                                return (
                                    <div key={comment.id} className='comment'>
                                        <div className='imgDiv'>
                                            <p className='createComment'>{comment.createAt}</p>
                                            <h5>{comment.author.name}</h5>
                                            <img 
                                                src="/public/img/free-icon-user-219970.png" 
                                                alt="" 
                                                width={25} 
                                            />
                                        </div>

                                        <div className='textComm'>
                                            <p>
                                                {comment.text}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}