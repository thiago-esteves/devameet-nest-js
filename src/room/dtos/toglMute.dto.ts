import {  IsBoolean } from "class-validator";
import { MeetMessagesHelper } from "src/meet/helpers/meetmessages.helper";
import { JoinRoomDto} from "./joinroom.dto";
import { RoomMessagensHelper } from "../helpers/roommessagens.helper";


export class ToglMuteDto  extends JoinRoomDto{

    @IsBoolean({message:RoomMessagensHelper.MUTE_NOT_VALID})
    muted:boolean;
}