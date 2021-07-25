import { NextFunction,Request,Response } from "express";
import ConversationService from "./conversation.service";
import { IConversation } from "./conversations.interface";
import SendMessageDto from "./dtos/send_message.dto";

export default class ConversationController{
    private conversationService = new ConversationService();

    public sendMessage = async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const model: SendMessageDto = req.body;
            const result = await this.conversationService.sendMessage(req.user.id, model);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public getMyConversation = async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const result:IConversation[] = await this.conversationService.getMyConversation(req.user.id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}