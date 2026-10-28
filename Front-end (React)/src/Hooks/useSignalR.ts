import * as signalR from "@microsoft/signalr";
import { useContext, useEffect } from "react";
import { SignalRContext } from "../Context/Contexts";

export default function useSignalR(url: string) {
    const signalRContext = useContext(SignalRContext);
    const setDataUpdate = signalRContext?.setDataUpdate;

    useEffect(() => {
        const token = sessionStorage.getItem('token') ?? "";

        if (!token) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl( url, { accessTokenFactory: () => token } )
            .build()
        
        connection.on('DataUpdate', () => { 
            if (!setDataUpdate) {console.log("НЕТ SETTER"); return; }
            setDataUpdate(old => old + 1);
        });
        
        const startConnection = async () => {
            try {
                await connection.start();
                console.log(`SignalR Connected`);
            } catch (error) {
                console.log('SignalR Connected Error:', error);
            }
        };
        
        startConnection();
        return () => {
            void connection.stop();
            console.log('SignalR effect STOP');
        }
    }, [url, setDataUpdate]);
}