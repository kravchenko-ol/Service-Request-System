import { createContext} from "react";
import type { ISessinData, ISessionOper, ISignalR } from "../Types/type";

export const SignalRContext = createContext<ISignalR | null>(null);
export const SessionContext = createContext<ISessinData | null>(null);
export const OperatorSessionContext = createContext<ISessionOper | null>(null);



