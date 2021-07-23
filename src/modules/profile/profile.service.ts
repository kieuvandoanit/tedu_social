import { HttpException } from "@core/exceptions";
import { IUser, UserSchema } from "@modules/users";
import CreateProfileDto from "./dtos/create_profile.dto";
import { IEducation, IExperience, IFollower, IProfile, ISocial } from "./profile.interface";
import ProfileSchema from "./profile.model";
import normalize from 'normalize-url';
import AddExperienceDto from "./dtos/add_experience.dto";
import AddEducationDto from "./dtos/add_education.dto";

class ProfileService{
    public async getCurrentProfile(userId: string):Promise<Partial<IUser>>{
        const user = await ProfileSchema.findOne({
            user: userId
        }).populate("user",["name","avatar"]).exec();
        if(!user){
            throw new HttpException(400, 'There is no profile for this user');
        }
        return user;
    }

    public async createProfile(userId: string, profileDto: CreateProfileDto):Promise<IProfile>{
        const { company, location, website, bio, skills, status, youtube, twitter, instagram, linkedin, facebook} = profileDto;

        const profileFields: Partial<IProfile> = {
            user: userId,
            company,
            location,
            website: website && website !=""? normalize(website.toString(),{forceHttps: true}):"",
            bio,
            skills: Array.isArray(skills)? skills : skills.split(",").map((skill:string)=>' '+ skill.trim()),
            status
        };

        const socialFields: ISocial ={
            youtube,
            twitter,
            instagram,
            facebook,
            linkedin
        };

        for(const [key, value] of Object.entries(socialFields)){
            if(value && value.length > 0){
                socialFields[key] = normalize(value, {forceHttps: true});
            }
        }

        profileFields.social = socialFields;

        const profile = await ProfileSchema.findOneAndUpdate({user:userId},{$set:profileFields},{new: true, upsert: true, setDefaultsOnInsert: true}).exec();
        
        return profile;
        
    }

    public async deleteProfile(userId: string){
        await ProfileSchema.findOneAndRemove({user:userId}).exec();

        await UserSchema.findOneAndRemove({_id:userId}).exec();
    }

    public async getAllProfiles(): Promise<Partial<IUser>[]>{
        const profile = await ProfileSchema.find().populate('user',['name', 'avatar']).exec();
        return profile;
    }

    public addExperience = async (userId: string, experience: AddExperienceDto)=>{
        const newExp = {...experience,};
        const profile = await ProfileSchema.findOne({user: userId}).exec();
        if(!profile){
            throw new HttpException(400, 'There is not profile for this user');
        }

        profile.experience.unshift(newExp as unknown as IExperience);
        await profile.save();

        return profile;
    }

    public deleteExperience = async (userId: string, experienceId: string)=>{
        const profile = await ProfileSchema.findOne({user: userId}).exec();

        if(!profile){
            throw new HttpException(400, 'There is not profile for this user');
        }

        profile.experience = profile.experience.filter((exp) => exp._id.toString() !== experienceId);
        await profile.save();
        return profile;
    }

    public addEducation = async (userId: string, education: AddEducationDto)=>{
        const newEdu = {...education,};
        const profile = await ProfileSchema.findOne({user: userId}).exec();
        if(!profile){
            throw new HttpException(400, 'There is not profile for this user');
        }

        profile.education.unshift(newEdu as unknown as IEducation);
        await profile.save();

        return profile;
    }

    public deleteEducation = async (userId: string, educationId: string)=>{
        const profile = await ProfileSchema.findOne({user: userId}).exec();

        if(!profile){
            throw new HttpException(400, 'There is not profile for this user');
        }

        profile.education = profile.education.filter((edu) => edu._id.toString() !== educationId);
        await profile.save();
        return profile;
    }

    public follow = async (fromUserId: string, toUserId: string) => {
        const fromProfile = await ProfileSchema.findOne({user: fromUserId}).exec();
        if(!fromProfile) throw new HttpException(400, 'There is not profile for your user');

        const toProfile = await ProfileSchema.findOne({user: toUserId}).exec();
        if(!toProfile) throw new HttpException(400, 'There is not profile for target user');

        if(fromProfile.followings && fromProfile.followings.some((follow: IFollower) => follow.user.toString() === toUserId )){
            throw new HttpException(400, 'You has been already followed this user')
        }

        if(toProfile.follower && toProfile.follower.some((follow: IFollower) => follow.user.toString() === fromUserId )){
            throw new HttpException(400, 'Target user has already been followed by from user');
        }

        fromProfile.followings.unshift({user: toUserId});
        toProfile.follower.unshift({user: fromUserId});

        if(!fromProfile.followings) fromProfile.followings = [];
        await fromProfile.save();
        if(!toProfile.follower) toProfile.follower = [];
        await toProfile.save();

        return fromProfile;
    }

    public unfollow = async (fromUserId: string, toUserId: string) => {
        const fromProfile = await ProfileSchema.findOne({user: fromUserId}).exec();
        if(!fromProfile) throw new HttpException(400, 'There is not profile for your user');

        const toProfile = await ProfileSchema.findOne({user: toUserId}).exec();
        if(!toProfile) throw new HttpException(400, 'There is not profile for target user');

        var isFollowing = 0;
        if (fromProfile.followings){
            fromProfile.followings.forEach((follower) => {
                if(follower.toString() === toUserId){
                    isFollowing = 1;
                }
            });
        }
        if(isFollowing === 1){
            throw new HttpException(400, 'You has not been yet followed this user');
        }
        

        var isFollower = 0;
        if (toProfile.follower){
            toProfile.follower.forEach((follower) => {
                if(follower.toString() === toUserId){
                    isFollower = 1;
                }
            });
        }
        if(isFollower === 1){
            throw new HttpException(400, 'You has not being followed this user');
        }

        
        if(!fromProfile.followings) fromProfile.followings = [];
        fromProfile.followings = fromProfile.followings.filter(({user}) => user.toString() !== toUserId);

        if(!toProfile.follower) toProfile.follower = [];
        toProfile.follower = toProfile.follower.filter(({user}) => user.toString() !== fromUserId);

        await fromProfile.save();
        await toProfile.save();

        return fromProfile;
    }
}

export default ProfileService;