import { Outlet } from "react-router";
import useAuthSession from "./Hooks/useAuthSession";
import useSignalR from "./Hooks/useSignalR";
const API_URL = import.meta.env.VITE_API_URL;

export default function AppContent() {
    useAuthSession(`${API_URL}/api/Account/me`);
    useSignalR(`${API_URL}/hubs/update`);
    return <Outlet />
};