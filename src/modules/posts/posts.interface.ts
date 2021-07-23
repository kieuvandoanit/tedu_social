export interface IPost{
    _id: string;
    user: string;
    text: string;
    name: string;
    avatar: string;
    likes: ILike[];
    shares: IShare[];
    comments: IComment[];
    date: Date;
}

export interface ILike{
    user: string;
}
export interface IShare{
    user: string;
}

export interface IComment{
    _id: string;
    user: string;
    text: string;
    name: string;
    avatar: string;
    date: Date;
}