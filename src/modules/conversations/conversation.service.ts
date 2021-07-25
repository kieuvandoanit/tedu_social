import {HttpException} from '@core/exceptions';
import { UserSchema } from '@modules/users';
import { IConversation, IMessages } from './conversations.interface';
import SendMessageDto from './dtos/send_message.dto';
import ConversationSchema from './conversations.model';


export default class ConversationService {

    public async getMyConversation(userId: string):Promise<IConversation[]>{
        const user = await UserSchema.findById(userId).exec();
        if(!user) throw new HttpException(400, "User is not found");

        const conversation = await ConversationSchema.find({$or: [{user1: userId}, {user2: userId}]}).exec();
        if(!conversation) throw new HttpException(400, "You have not conversation");

        return conversation;
    }

    public async sendMessage(userId: string, dto: SendMessageDto):Promise<IConversation>{
        const user = await UserSchema.findById(userId).select('-password').exec();
        if(!user) throw new HttpException(400, 'User is not found');

        const toUser = await UserSchema.findById(dto.to).select('-password').exec();
        if(!toUser) throw new HttpException(400, 'To user id is not found');

        if(!dto.conversationId){
            let newConversation = await ConversationSchema.findOne({
                $or: [
                    {$and: [{user1: userId}, {user2: dto.to}]},
                    {$and: [{user1: dto.to}, {user2: userId}]}
                ]
            }).exec();
            if(newConversation){
                newConversation.messages.unshift({to: dto.to, text: dto.text, from: userId} as IMessages);
            }else{
                newConversation = new ConversationSchema({ user1: userId, user2: dto.to, messages: [{from: userId, to: dto.to, text: dto.text}]});
            }
            await newConversation.save();
            return newConversation;
        }else{
            const conversation = await ConversationSchema.findById(dto.conversationId).exec();
            if(!conversation) throw new HttpException(400, 'Conversation id is not found');

            if((conversation.user1 !== userId && conversation.user2 !== dto.to) || (conversation.user1 !== dto.to && conversation.user2 !== userId))
            conversation.messages.unshift({to: dto.to, text: dto.text, from: userId} as IMessages);
            await conversation.save();
            return conversation;
        }
        
    }
}