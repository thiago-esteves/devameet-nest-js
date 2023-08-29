import { IsEmail, IsNotEmpty } from "class-validator";
import { Messageshelper } from "../helpers/messages.helper";

export class LoginDto {
    @IsEmail({},{message:Messageshelper.AUTH_LOGIN_NOT_FOUND})
    login:string;
    
    @IsNotEmpty({message:Messageshelper.AUTH_PASSWORD_NOT_FOUND})
    password: string; 
}