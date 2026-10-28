import type { ISearchNavigat } from "../Types/type";

export const navigationsSearch: Array<ISearchNavigat> = [
    {
        title: "Account",
        keywoard : ['Account' , 'Profile' , 'Office' , 'Аккаунт' , 'Профіль' , 'Кабінет'],
        path: '/acc'
    },
    {
        title: "Create Request",
        keywoard: ['Create Request' , 'Create' , 'Создать' , 'Створити'],
        path: '/createReq'
    },
    {
        title: "Archive",
        keywoard: ['Archive' , 'Requests' , 'Архів' , 'Запити'],
        path: '/'
    }
];