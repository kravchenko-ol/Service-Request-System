import { useContext, useEffect } from 'react';
import './analytics.css';
import { OperatorSessionContext, SignalRContext } from '../../../../Context/Contexts';
import { themeStatus } from '../../../../Theme/themeObj';
import type { ITicket } from '../../../../Types/type';
import useFetch from '../../../../Hooks/useFetch';
export const API_URL = import.meta.env.VITE_API_URL;

export default function Analytics() {
    const session = useContext(OperatorSessionContext);
    const signalR = useContext(SignalRContext);
    const { data: tickets, refetch: refetchStat } = useFetch<Array<ITicket> | null>(`${API_URL}/api/Ticket/operator/${session?.sessOp?.id}`);
    
    useEffect(() => {
        refetchStat();
    }, [signalR?.dataUpdate, refetchStat]);

    return (
        <div className='main mainAnalitics'>
            <h1>Analytics</h1>

            <div className='statistics'>
                {
                    tickets?.map(ticket => {
                        const height = tickets?.map(tick => tick.requests.length) as number[];
                        return (
                            <div 
                                key={ticket.id} 
                                className={`stat ${themeStatus[ticket.name.toLowerCase() as keyof typeof themeStatus] ?? 'other'}`}
                                style={{
                                    height: `${ticket.requests.length / height.reduce((acc, curr) => acc + curr, 0) * 100}%`,
                                }}
                                >
                                <p>
                                    {ticket.requests.length}
                                </p>
                                <p>{ticket.name}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}