import { Message } from "../models/User.model";


export interface ApiResponse{
    success:boolean;
    message:string;
    messages?:Message[];
    isAcceptingMessages?:boolean
}