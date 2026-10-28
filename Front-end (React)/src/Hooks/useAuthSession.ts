import { useContext, useEffect } from "react";
import { OperatorSessionContext, SessionContext } from "../Context/Contexts";
import useFetch from "./useFetch";
import type { IAccountData } from "../Types/type";

export default function useAuthSession(url: string) {
    const sessionOp = useContext(OperatorSessionContext);
    const sessionUser = useContext(SessionContext);
    const { data: session } = useFetch<IAccountData>(url);

    useEffect(() => {
        if (!session) return;

        if (session.role === 'User') {
            sessionUser?.setSess(session);
        };

        if (session.role === 'Operator') {
            sessionOp?.setSessOP(session);
        };
    }, [session, sessionOp, sessionUser]);
};