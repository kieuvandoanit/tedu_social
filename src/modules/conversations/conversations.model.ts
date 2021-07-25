import mongoose, {Document} from 'mongoose';
import { IConversation } from './conversations.interface';
const ConversationSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    recent_date: {
        type: Date,
        default: Date.now
    },
    messages: [
       {
           from: {
               type: mongoose.Schema.Types.ObjectId,
               require: true,
           },
           to: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            },
            read: {
                type: Boolean,
                default: false,
            },
            date: {
                type: Date,
                default: Date.now
            },
            show_on_from: {
                type: Boolean,
                default: true
            },
            text: {
                type: String,
                required: true,
            }
       } 
    ]
});

export default mongoose.model<IConversation & Document>('conversation', ConversationSchema);