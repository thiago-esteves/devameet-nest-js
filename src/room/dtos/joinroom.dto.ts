import { IsNotEmpty, isNotEmpty } from "class-validator";
import { RoomMessagensHelper } from "../helpers/roommessagens.helper";

export class JoinRoomDto{
    @IsNotEmpty({message: RoomMessagensHelper.JOIN_USER_NOT_VALID})
    userId:string;
    
    @IsNotEmpty({message: RoomMessagensHelper.ROOM_LINK_NOT_FOUND})
    link:string;

}