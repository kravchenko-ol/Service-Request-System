import { NavLink } from 'react-router';
import './modals.css';
import { useContext, useState } from 'react';
import type { IGetRequestData, TStatus } from '../../../../Types/type';
import { OperatorSessionContext } from '../../../../Context/Contexts';
import { colorPrior, iconsCategory, themeStatus } from '../../../../Theme/themeObj';
export const API_URL = import.meta.env.VITE_API_URL;

export function ModalNotLog({className} : {className: string}) {
    return (
        <>
            <div className={`notLog ${className}`}>
                <div className='notLogInfo'>
                    <h3>To continue, please</h3>
                    <NavLink to={'/login'} className={'a'}>
                        <button type='button' className='navBut'>
                            Log in
                        </button>
                    </NavLink>
                </div>
            </div>
        </>
    )
};

export function ModalCeateTicket({onCreate, onClose}: {onCreate: (name: string) => void, onClose: () => void}) {
    const [name, setName] = useState('');

    return (
        <div className='createModal'>
            <div className='createTick'>
                <div className='modalCreateHead'>
                    <h4>Create Ticket</h4>
                    <button 
                        type='button' 
                        className='closeModal'
                        onClick={onClose}
                    >
                        <img src="/public/img/delete.png" alt="" width={24}/>
                    </button>
                </div>
                
                <div className='tickData'>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id='name' value={name} onChange={e => setName(e.target.value)} />
                </div>
                <button type='button' className='btnCreate' onClick={() => onCreate(name)}>Create</button>
            </div>
        </div>
    )
};

export function ModalMoreRequest({ data, onClose, refetchReq, refetchTick }
    : {
        data: IGetRequestData | null,
        onClose: () => void,
        refetchReq: () => Promise<void>,
        refetchTick: () => Promise<void>
    }) {
    const session = useContext(OperatorSessionContext);
    const [comment, setComment] = useState<string>('');
    const [close, setClose] = useState<boolean>(false);

    const [stat, setStat] = useState<TStatus | undefined>();


    async function sendComment() {
        if (!comment || !stat) return;

        const body = {
            text: comment,
            authorId: session?.sessOp?.id,
            requestId: data?.id
        };
        
        try {
            const responseComment = await fetch(`${API_URL}/api/Comment`,
                {
                    method: `POST`,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                }
            );

            if (!responseComment.ok) {
                const errorText = await responseComment.text();

                throw new Error(`Comment: ${responseComment.status}, body: ${errorText}`)
            }

            const responseStatus = await fetch(`${API_URL}/api/Requests/${data?.id}/${stat}`,
                {
                    method: `PUT`,
                }
            );

            if (!responseStatus.ok) {
                const errorText = await responseStatus.text();

                throw new Error(`Status: ${responseStatus.status}, body: ${errorText}`)
            };

            setComment('');
            refetchReq();
            refetchTick();

        } catch (error) {
            console.log(error);
        }
    };

    return ( 
        <div className={`ModalMoreRequestBack ${close && 'close'}`}>
            <div className='menuModalMoreRequest'>
                <div className='blockExit'>
                    <img
                        onClick={() => { onClose();  setClose(true)}}
                        src="/public/img/delete.png"
                        alt="close" width={25}
                    />
                </div>
                <div className='mainModalMoreRequest'>
                    {
                        data !== null &&
                        (
                            <>
                                <div className='header'>
                                    <div className='titleStatusPriorCat'>
                                        <h3>{data.title}</h3>
                                        <div className='infoReq'>
                                            <p className={`prior ${colorPrior[data.priority.toLowerCase() as keyof typeof colorPrior]}`}>
                                                {data.priority}
                                            </p>
                                            <p className={`status ${themeStatus[data.status.toLowerCase() as keyof typeof themeStatus]}`}>
                                                {data.status}
                                                </p>
                                            <div className='categor'>
                                                <p>{data.category}</p>
                                                <img src={iconsCategory[data.category.toLowerCase() as keyof typeof iconsCategory]} alt="" width={28}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='idAtCreateUser'>
                                        <h4>ID: {data.id}</h4>
                                        <h4>Create: {data.createAt}</h4>
                                        <div className='userInfo'>
                                            <h4>User:</h4>
                                            <p>{data.author.name}</p>
                                            <p>{data.author.email}</p>
                                            <p>{data.author.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='body'>
                                    <div className='desc'>
                                        <h3>Description</h3>
                                        <p>{data.description}</p>
                                    </div>

                                    <div className='commentBody'>
                                        <div className='commentCreate'>
                                            <div className='reqStatus'>
                                                <label htmlFor="status">Status</label>
                                                <select
                                                    name="" 
                                                    id="status"
                                                    value={stat}
                                                    onChange={(e) => setStat(e.target.value as TStatus)}
                                                >
                                                    <option value="New">New</option>
                                                    <option value="Inprogress">In-Progress</option>
                                                    <option value="Waiting">Waiting</option>
                                                    <option value="Done">Done</option>
                                                </select>
                                            </div>
                                            
                                            <label htmlFor="createComm">Reply</label>
                                            <textarea 
                                                id="createComm"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />

                                            <button 
                                                className='sendButn'
                                                type='button'
                                                onClick={sendComment}
                                            >
                                                Send
                                            </button>
                                        </div>
                                        <div className='comments'>
                                            <div className='headComments'>
                                                <h3>Comments</h3>
                                            </div>
                                            <div className='bodyComments'>
                                                {
                                                    data.comments.map(comment => {
                                                        return (
                                                            <div key={comment.id} className='comment'>
                                                                <div className='infoComment'>
                                                                    <p key={comment.authorId}>{comment.createAt}</p>
                                                                    <p key={comment.requestId}>{comment.author.name}</p>
                                                                </div>
                                                                <p className='textComment'>{comment.text}</p>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
};