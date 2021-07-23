export interface IProfile{
    _id: string;
    user: string;
    company: string;
    website: string;
    location: string;
    status: string;
    skills:string[],
    bio: string;
    experience: IExperience[];
    education: IEducation[];
    social: ISocial;
    followings: IFollower[],
    follower: IFollower[],
    friends: IFriend[],
    friend_request: IFriend[],
    date: Date
}

export interface IFriend{
    user: string;
    date: Date;
}
export interface IFollower{
    user: string;
}
export interface IExperience {
    _id: string;
    title: string;
    company: string;
    from: Date;
    to: Date;
    current: boolean;
    description: string;
}

export interface IEducation {
    _id: string;
    school: string;
    degree: string;
    fieldofstudy: string;
    from: Date;
    to: Date;
    current: boolean;
    description: string;
}

export interface ISocial extends Record<string, string>{
    youtube: string;
    twitter: string;
    facebook: string;
    linkedin: string;
    instagram: string;
}