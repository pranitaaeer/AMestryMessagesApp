import mongoose,{ Document, Schema } from 'mongoose';


export interface Message extends Document{
    content: string;
    createdAt: Date;
}

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages:Message[]
}
const MessageSchema:Schema<Message>=new Schema({
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const UserSchema:Schema<User>= new Schema({
    username:{
        type: String,
        required: [true, "username is required"],
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: [true, "email is required"],
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/,"email is not valid"]
    },
    password:{
        type: String,
        required: [true, "password is required"],
    },
    verifyCode:{
        type: String,
        required: [true, "verifyCode is required"],
    },
    verifyCodeExpiry:{
        type: Date,
        default: Date.now,        
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAcceptingMessages:{
        type: Boolean,
        default: true
    },
    messages:[MessageSchema],
    
})
const UserModel=(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)
export default UserModel 