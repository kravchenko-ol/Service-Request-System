import type React from "react";

export interface ITheme {
    theme: TTheme;
    setTheme:  React.Dispatch<React.SetStateAction<TTheme>>
};

export type TTheme = 'light' | 'dark';

export interface IButLogReg {
    text: string;
    styleClass: string;
    click?: () => void
};

export interface ILoginData {
    email: string;
    password: string;
};

export interface IErrorLogin extends ILoginData {
    noneUser: string;
}

export interface IRegistrationData {
    id: string;
    name: string;
    email: string;
    phone: string;
    age?: number | string;
    sex?: 'men' | 'women';
    password: string;
    repeatPassword: string;
};

export interface IOperatorRegistration {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
};

export interface IOperator extends IAccountData {
    tickets?: Array<ITicket>
};

export interface IAccountData extends Omit<IRegistrationData, 'password' | 'repeatPassword'>  {
    role: TRole;
    requests?: Array<IGetRequestData>
};

export interface IEditeUser {
    name: string;
    email: string;
    phone: string;
    age?: number | string;
    sex?: 'men' | 'women';
};

export interface IPostRequestData {
    title: string;
    description: string;
    category: TCategory;
    priority: TPriority;
    status: TStatus;
    authorId: string;
    comments: Array<IComentPost>;
};

export interface IGetRequestData extends IPostRequestData { 
    id: string;
    author: IAccountData;
    operator: IOperator;
    createAt: string;
    comments: Array<ICommentGet>
};

export interface IAuthor {
    authorId: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
};

export interface IComentPost {
    text: string;
    authorId: string;
    requestId: string;
};

export interface ICommentGet extends IComentPost {
    id: string
    author: IOperator;
    createAt: string;
};

export type TRole = 'User' | 'Operator';
export type TCategory = 'Web' | 'Mobile' | 'PC' | 'Software';
export type TPriority = 'Low' | 'Medium' | 'High';
export type TStatus = 'New' | 'Inprogress' | 'Waiting' | 'Done';
export type TOptionSearchAcc = 'Account' | 'Profile' | 'Office' | 'Аккаунт' | 'Профіль' | 'Кабінет';
export type TOptionSearchCreateReq = 'Create Request' | 'Create' | 'Создать' | 'Створити';
export type TOptionSearchArchive = 'Archive' | 'Requests' | 'Архів' | 'Запити';

export interface ISearchNavigat {
    title:  | TOptionSearchAcc
            | TOptionSearchArchive
            | TOptionSearchCreateReq;
    keywoard: string[];
    path: string;
};

export interface ITicket {
    id: string;
    name: string;
    requests: Array<IGetRequestData>
};

export interface ISessinData {
    sess: IAccountData | null;
    setSess: React.Dispatch<React.SetStateAction<IAccountData | null>>;
};

export interface ISessionOper {
    sessOp: IOperator | null;
    setSessOP: React.Dispatch<React.SetStateAction<IOperator | null>>;
};

export interface ISignalR { 
    dataUpdate: number;
    setDataUpdate: React.Dispatch<React.SetStateAction<number>>;
};

