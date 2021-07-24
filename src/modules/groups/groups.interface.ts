export interface IGroup{
    _id: string;
    name: string;
    code: string;
    description: string;
    members: IMember[];
    member_requests: IMember[];
    manager: IManager[];
    creator: string;
}

export interface IMember{
    user: string;
    date: Date;
}

export interface IManager{
    user: string;
    role: string;
}

