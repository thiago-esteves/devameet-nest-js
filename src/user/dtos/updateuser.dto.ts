import { IsString, MinLength } from "class-validator"
import { UserMessagesHelper } from "../helpers/messages.helper"




export class UpdataUserDto {
    @MinLength(2, {message:UserMessagesHelper.REGISTER_NOME_NOT_VALID })
      name:string;
    @IsString()
      avatar:string;

}