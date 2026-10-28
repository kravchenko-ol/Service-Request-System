import { useCallback, useEffect, useState } from "react";

export default function useFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null);

    const dataFetch = useCallback(async (): Promise<T | null> => {
        const token = sessionStorage.getItem('token');
        if (!url || !token) return null;

        const response = await fetch(url, 
            { headers: token ? { 'Authorization': `Bearer ${token}` } : {} }
        );

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }
        return await response.json();
    }, [url]);

    const refetch = useCallback(async (): Promise<void> => {
        try {
            const result = await dataFetch();
            setData(result);
        } catch (error) {
            console.log(error);
        }
    }, [dataFetch]);

    useEffect(() => {
        dataFetch()
            .then(result => setData(result))
            .catch(error => console.log(error));
    }, [dataFetch]);
    return {
        data,
        refetch
    };
}