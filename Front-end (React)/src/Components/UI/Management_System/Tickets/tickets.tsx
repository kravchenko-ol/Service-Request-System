import { LogRegistrBtn } from '../../Components/Buttons/buttons';
import './tickets.css';
import type { IGetRequestData, ITicket } from '../../../../Types/type';
import { useContext, useEffect, useState } from 'react';
import { OperatorSessionContext, SignalRContext } from '../../../../Context/Contexts';
import { colorPrior, iconsCategory, iconTickets, themeStatus } from '../../../../Theme/themeObj';
import { ModalCeateTicket, ModalMoreRequest } from '../../Components/Modals/modals';
import useFetch from '../../../../Hooks/useFetch';
export const API_URL = import.meta.env.VITE_API_URL;

export default function Tickets() {
    const session = useContext(OperatorSessionContext);
    const signalR = useContext(SignalRContext);

    const { data: tickets, refetch: refetchTicket } =
        useFetch<Array<ITicket> | null>(`${API_URL}/api/Ticket/operator/${session?.sessOp?.id}`);

    useEffect(() => { 
        refetchTicket();
    }, [signalR?.dataUpdate, refetchTicket]);

    const [createTick, setCreateTick] = useState<boolean>(false);
    const [onFilter, setFilter] = useState<boolean>(false);
    const [moreRequest, setMoreRequest] = useState({
        onModal: false,
        idReq: ''
    });
    const { data: request, refetch: refetchReq } = useFetch<IGetRequestData>(
        moreRequest.idReq
        ? `${API_URL}/api/Requests/${moreRequest.idReq}`
        : ""
    );

    const [dragId, setDragId] = useState({
        idTicket: '',
        idReq: ''
    });
    
    const [filterName, setFilterName] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterPrior, setFilterPrior] = useState('');

    const prioritys = tickets?.flatMap(ticket => ticket.requests).map(req => req.priority);
    const categorys = tickets?.flatMap(ticket => ticket.requests).map(req => req.category);
    const valuePrioritys = [...new Set(prioritys)];
    const valuecategorys = [...new Set(categorys)];


    async function createTicket(name: string) {
        try {
            const response = await fetch(
                `${API_URL}/api/Ticket/create/${session?.sessOp?.id}/${name}`,
                { method: `POST` }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}, ${response.status}`);
            };
            await refetchTicket();
        } catch (error) {
            console.log(error)
        }
        setCreateTick(false);
    };

    async function dropTicket(idDrop: string) {
        try {
            const response = await fetch(
                `${API_URL}/api/Ticket/dragNdrop/${dragId.idTicket}/${idDrop}/${session?.sessOp?.id}`,
                { method: `PUT` }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }
            await refetchTicket();
        } catch (error) {
            console.log(error);
        }
    };

    async function dropRequest(idDropTick: string) {
        try {
            const response = await fetch(
                `${API_URL}/api/Ticket/dragNdropReq/${dragId.idReq}/${idDropTick}/${session?.sessOp?.id}`,
                { method: `PUT` }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            await refetchTicket();
        } catch (error) {
            console.log(error);
        }
    };

    async function deleteTickets(id: string) {
        try {
            const response = await fetch(
                `${API_URL}/api/Ticket/delete/${session?.sessOp?.id}/${id}`,
                { method: `DELETE` }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            };

            await refetchTicket();
        } catch (error) {
            console.log(error);
        }
    };

    function closeModal() {
        setCreateTick(false);
        setMoreRequest({ onModal: false, idReq: '' });
    };

    return (
        <div className='main'>

            <div className='head'>
                <div className='titleIcon'>
                    <img src={`${import.meta.env.BASE_URL}/img/ticket.png`} alt="" width={24}/>
                    <h3>Tickets</h3>
                </div>
                <div>
                    <LogRegistrBtn text='+ New ticket' styleClass='createTicket' click={() => setCreateTick(true)}/>
                </div>
            </div>

            <div className='filters'>
                <div className='selectAll'>
                    <input 
                        type="checkbox" 
                        id='select'
                        
                        checked={!filterName && !filterPrior && !filterCategory}
                        onChange={(e) => {
                            if (e.currentTarget.checked) {
                                setFilterName('');
                                setFilterPrior('');
                                setFilterCategory('');
                            }
                        }}
                    />
                    <label htmlFor="select">Select All</label>
                </div>
                <div className='filter'>
                    <img 
                        src={`${import.meta.env.BASE_URL}/img/filtration.png` }
                        alt="" 
                        width={16}
                        onClick={() => setFilter(true)}
                    />
                    <p>Filters</p>
                </div>
            </div>

            {
                onFilter && (
                    <div 
                        className={`filterModal ${onFilter && 'open'}`} 
                        onMouseLeave={() => setFilter(false)}
                    >
                        <div className='filterName filtrblock'>
                            <p>Name:</p>
                            <ul>
                                {
                                    tickets?.map(ticket => 
                                        <li key={ticket.id} 
                                            className={filterName === ticket.name ? 'activeName' : ''}
                                            onClick={() => {
                                                setFilterName(ticket.name);
                                                setFilterPrior('');
                                                setFilterCategory('');
                                            }} 
                                        >
                                            {ticket.name}
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                        <div className='filterPrior filtrblock'>
                            <p>Priority:</p>
                            <ul>
                                {
                                    valuePrioritys.map(value => 
                                    <li 
                                        key={value}
                                        className={filterPrior === value ? 'activePrior' : ''}
                                        onClick={() => {
                                            setFilterPrior(value);
                                            setFilterName('');
                                            setFilterCategory('');
                                        }}
                                    >
                                        {value}
                                    </li>)
                                }
                            </ul>
                        </div>
                        <div className='filterCategory filtrblock'>
                            <p>Category:</p>
                            <ul>
                                {
                                    valuecategorys.map(value => 
                                    <li 
                                        key={value}
                                        className={filterCategory === value ? 'activeCategory' : ''}
                                        onClick={() => {
                                            setFilterCategory(value);
                                            setFilterPrior('');
                                            setFilterName('');
                                        }}
                                    >
                                        {value}
                                    </li>)
                                }
                            </ul>
                        </div>
                    </div>
                )
            }

            <div className='mainTickets'>
                {
                    tickets?.map(ticket => {
                        const iconKey = ticket.name
                            .toLowerCase()
                            .replaceAll('-', '') as keyof typeof iconTickets;
                        
                        const ticketCat = ticket.requests.some(req => req.category === filterCategory);
                        const ticketPrior = ticket.requests.some(req => req.priority === filterPrior);

                        let showTicket = false;

                            if (!filterName && !filterPrior && !filterCategory) {
                                showTicket = true
                            } else if (filterName === ticket.name) {
                                showTicket = true
                            } else if (ticketCat) {
                                showTicket = true
                            } else if (ticketPrior) {
                                showTicket = true
                            };

                            if (!showTicket) return;
                                return (
                                        <div 
                                            key={ticket.id} 
                                            className= 'ticketReqs'
                                            draggable
                                            onDragStart={(e) => {
                                                e.stopPropagation();
                                                setDragId(old => ({...old, idTicket: ticket.id, idReq: ''}))
                                            }}
                                            onDragOver={e => e.preventDefault()}
                                            onDrop={() => {
                                                if (dragId.idReq) {
                                                    dropRequest(ticket.id);
                                                } else {
                                                    dropTicket(ticket.id);
                                                }
                                            }}
                                        >
                                            <div className='ticketHead'>
                                                <img src={iconTickets[iconKey] ?? `${import.meta.env.BASE_URL}/img/bookmark.png`} alt="" width={24}/>
                                                <p>{ticket.name}</p>
                                                <p className='size'>{ticket.requests.length}</p>
                                                <button 
                                                    className='deleteTick'
                                                    onClick={() => {deleteTickets(ticket.id)}}
                                                >
                                                    <img src={`${import.meta.env.BASE_URL}/img/delete.png`} alt="" width={24}/>
                                                </button>
                                            </div>

                                            <div className='requests'>
                                                {
                                                    ticket.requests?.map(request => {
                                                            return (
                                                            <div 
                                                                key={request.id} 
                                                                className='request'
                                                                draggable
                                                                onDragStart={(e) => {
                                                                    e.stopPropagation();
                                                                    setDragId(old => ({...old, idTicket: ticket.id, idReq: request.id}))
                                                                }}
                                                                onDragOver={e => e.preventDefault()}
                                                            >

                                                                <div className='reqHead'>
                                                                    <div className='idReq'>
                                                                        <img src={`${import.meta.env.BASE_URL}/img/connect.png`} alt="" width={12}/>
                                                                        <p>{request.id}</p>
                                                                        <span>·</span>
                                                                    </div>
                                                                    <div className='reqUser'>
                                                                        <img src={`${import.meta.env.BASE_URL}/public/img/user.png`} alt="" width={12}/>
                                                                        <p>{request.author.name}</p>
                                                                    </div>

                                                                    <div className='iconMore'>
                                                                        <img src={`${import.meta.env.BASE_URL}/public/img/more.png`} alt="" width={16}/>

                                                                        <div className='divMore'>
                                                                            <div 
                                                                                className='more'
                                                                                    onClick={() => {
                                                                                        setMoreRequest({idReq: request.id, onModal: true });
                                                                                    }}
                                                                            >
                                                                                <p>More</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className='bodyDesc'>
                                                                    <p>{request.description}</p>
                                                                </div>

                                                                <div className='categoryPrior'>
                                                                    <div className='category'>
                                                                        <p>{request.category}</p>
                                                                        <img src={iconsCategory[request.category.toLowerCase() as keyof typeof iconsCategory]} alt="" width={12}/>
                                                                    </div>
                                                                    <div className={`prior ${colorPrior[request.priority.toLowerCase() as keyof typeof colorPrior]}`}>
                                                                        <p>{request.priority}</p>
                                                                    </div>
                                                                    <div className={`stat ${themeStatus[request.status.toLowerCase().replaceAll('-', '') as keyof typeof themeStatus]}`}>
                                                                        <p>{request.status}</p>
                                                                    </div>
                                                                </div>

                                                                <div className='atCreate'>
                                                                    <p>{request.createAt}</p>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                    })
                }
            </div>
            { createTick === true && <ModalCeateTicket onCreate={createTicket} onClose={closeModal} /> }
            { moreRequest.onModal === true && <ModalMoreRequest data={request} onClose={closeModal} refetchReq={refetchReq} refetchTick={refetchTicket} /> }
        </div>
    )
}