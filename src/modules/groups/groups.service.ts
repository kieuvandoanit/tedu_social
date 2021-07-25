import { HttpException } from "@core/exceptions";
import { IUser, UserSchema } from "@modules/users";
import GroupSchema from './groups.model';
import CreateGroupDto from "./dtos/create_group.dto";
import { IGroup, IManager, IMember } from "./groups.interface";
import SetManagerDto from "./dtos/set_manager.dto";

export default class GroupService {
    public async createGroup(userId: string, groupDto: CreateGroupDto): Promise<IGroup>{
        const user = await UserSchema.findById(userId).select('-password').exec();
        if(!user) throw new HttpException(400, 'User is not found');
        
        const existingGroup = await GroupSchema.find({$or: [{name: groupDto.name}, {code: groupDto.code}],}).countDocuments().exec();

        if(existingGroup > 0) throw new HttpException(400, 'Name or code exitsted');
        
        const newGroup = new GroupSchema({
            ...groupDto,
        });

        const group = newGroup.save();
        return group;
    }

    public async getAllGroup(): Promise<IGroup[]>{
        const groups = GroupSchema.find().exec();
        return groups;
    }

    public async updateGroup(groupId: string, groupDto: CreateGroupDto):Promise<IGroup>{
        const group = await GroupSchema.findById(groupId);

        if(!group) throw new HttpException(400, 'Group is not found');

        const existingGroup = await GroupSchema.find({
            $and: [
                {$or: [{name: groupDto.name}, {code: groupDto.code}]},
                {_id: {$ne: groupId}}
            ],
        }).exec();

        if(existingGroup.length > 0) throw new HttpException(400, 'Name or code existed');

        const groupFields = {...groupDto};

        const updatedGroup = await GroupSchema.findOneAndUpdate(
            {_id: groupId},
            {$set: groupFields},
            {new: true}
        ).exec();
        
        if(!updatedGroup) throw new HttpException(400, 'UpdatedGroup is not success');

        return updatedGroup;
    }


    public async deleteGroup(groupId: string): Promise<IGroup>{
        const group = await GroupSchema.findById(groupId).exec();

        if(!group) throw new HttpException(400, 'Group is not found');

        const deleteGroup = await GroupSchema.findOneAndDelete({_id: groupId}).exec();

        if(!deleteGroup) throw new HttpException(400, 'DeleteGroup is not success');

        return deleteGroup;
    }

    public async joinGroup(userId: string, groupId: string): Promise<IGroup>{
        const user = await UserSchema.findById(userId).exec();
        if(!user) throw new HttpException(400, 'User is not found');
        
        const group = await GroupSchema.findById(groupId).exec();
        if(!group) throw new HttpException(400, 'Group is not found');

        if(group.members && group.members.some((member: IMember) => member.user.toString() === userId)) throw new HttpException(400, 'User has been already a member');
        if(group.member_requests && group.member_requests.some((member: IMember) => member.user.toString() === userId)) throw new HttpException(400, 'User has been send a request to join this group');
        
        group.member_requests.unshift({user: userId} as IMember);

        await group.save();
        return group;
    }

    public async approveJoinRequest(userId: string, groupId: string): Promise<IGroup>{
        const user = await UserSchema.findById(userId).exec();
        if(!user) throw new HttpException(400, 'User is not found');
        
        const group = await GroupSchema.findById(groupId).exec();
        if(!group) throw new HttpException(400, 'Group is not found');

        if(group.members && group.members.some((member: IMember) => member.user.toString() === userId)) throw new HttpException(400, 'User has been already a member');
        
        if(group.member_requests && group.member_requests.some((member: IMember) => member.user.toString() !== userId)) throw new HttpException(400, 'There is not any request of this user');
        
        group.member_requests = group.member_requests.filter(({user}) => user.toString() !== userId);

        group.members.unshift({user: userId} as IMember);
        await group.save();
        return group;
    }

    public async addManager(groupId: string, request: SetManagerDto): Promise<IGroup>{
        const group = await GroupSchema.findById(groupId).exec();
        if(!group) throw new HttpException(400, 'Group id is not exist');

        const user = await UserSchema.findById(request.userId).select('-password').exec();
        if(!user) throw new HttpException(400, 'User id is not exist');

        if(group.managers && group.managers.some((item:IManager) => item.user.toString() === request.userId)){
            throw new HttpException(400, 'You has already been set manager to this group');
        }

        group.managers.unshift({user: request.userId, role: request.role} as IManager);
        await group.save();
        return group;
    }

    public async removeManager(groupId: string, userId: string): Promise<IGroup>{
        const group = await GroupSchema.findById(groupId).exec();
        if(!group) throw new HttpException(400, 'Group id is not exist');

        const user = await UserSchema.findById(userId).select('-password').exec();
        if(!user) throw new HttpException(400, 'User id is not exist');

        if(group.managers && group.managers.some((item:IManager) => item.user.toString() !== userId)){
            throw new HttpException(400, 'You has not yet been manager to this group');
        }

        group.managers = group.managers.filter(({user}) => user.toString() !== userId);
        await group.save();
        return group;
    }

    public async getAllMember(groupId: string): Promise<IUser[]>{
        const group = await GroupSchema.findById(groupId).exec();
        if(!group) throw new HttpException(400, 'Group is not found');

        const userId = group.members.map((member) =>{
            return member.user;
        });

        const users = UserSchema.find({_id: userId}).select("-password").exec();
        return users;
    }

    public async removeMember(groupId: string, userId: string): Promise<IGroup>{
        const group = await GroupSchema.findById(groupId).exec();
        if(!group) throw new HttpException(400, 'Group id is not exist');

        const user = await UserSchema.findById(userId).select('-password').exec();
        if(!user) throw new HttpException(400, 'User id is not exist');

        if(group.members && group.members.findIndex((item:IMember) => item.user.toString() === userId) == -1){
            throw new HttpException(400, 'You has not yet been member in this group');
        }

        if(group.members.length === 1){
            throw new HttpException(400, 'You are a last member in this group');
        }

        group.members = group.members.filter(({user}) => user.toString() !== userId);
        await group.save();
        return group;
    }


}