import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meet, MeetDocument } from 'src/meet/schemas/meet.schema';
import { MeetObject, MeetObjectDocument } from 'src/meet/schemas/meetobject.schema';
import { Position } from './schemas/positioin.schema';
import { UserService } from 'src/user/user.service';
import { RoomMessagensHelper } from './helpers/roommessagens.helper';
import { link } from 'fs';
import { UpdateUserPositionDto } from './dtos/updateposition.dto';
import { User } from 'src/user/schemas/user.schema';
import { ToglMuteDto } from './dtos/toglMute.dto';



@Injectable()
export class RoomService {
    private logger = new Logger(RoomService.name);
    positionModel: any;

    constructor(
        @InjectModel(Meet.name) private readonly meetModel: Model<MeetDocument>,
        @InjectModel(MeetObject.name) private readonly objectModel: Model<MeetObjectDocument>,
        @InjectModel(Position.name) private readonly position: Model<MeetDocument>,
        private readonly userService: UserService


    ) {}

    async getRoom(link: string) {
        this.logger.debug(`getRoom - ${link}`);

        const meet = await this._getMeet(link);
                        
        const objects = await this.objectModel.find({ meet });

        return {

            link,
            name: meet.name,
            color: meet.color,
            objects
        

        };
    

    }

    async listaUsersPositionByLink(link: string) {

        this.logger.debug(`listUsersPositiionByLink - ${link}`);
        const meet = await this._getMeet(link );

        return await this.positionModel.find({ meet })
    }

    async deleteUsersPositionByLink(clientId: string) {

        this.logger.debug(`deleteUsersPosition - ${clientId}`);
        return await this.positionModel.deleteMany({ clientId });
    }
    async updataUserPosition (clientId:string, dto : UpdateUserPositionDto){
        this.logger.debug(`listUsersPositionByLink - ${dto.link}`);
        const meet = await this._getMeet(dto.link);
        const user = await this.userService.getUserByid(dto.userId);
        if (!User) {
            throw new BadRequestException(RoomMessagensHelper.JOIN_USER_NOT_VALID);
        }
        const positon ={
            ...dto,
            clientId,
            User,
            meet,
            name:user.name,
            avatar:user.avatar
        }
        const usersInRoom = await this.positionModel.find({meet});
        if(usersInRoom && usersInRoom.length > 10 ){
            throw new BadRequestException(RoomMessagensHelper.ROOM_MAX_USERS)
        };
        const loogedUserInRoom = usersInRoom.find( u =>
            u.user.toString()===user._id.toString() || u.clientId ===clientId);
            
        if (loogedUserInRoom){
            await this.positionModel.findByIdAndUpdate({_id: loogedUserInRoom._id},positon)

        }else {
            await this.positionModel.create(positon);
        }
    }
    async updateUserMute(dto:ToglMuteDto){
        this.logger.debug(`updateUserMute - ${dto.link}- ${dto.userId}`);
        const meet = await this._getMeet(dto.userId );
        const user = await this.userService.getUserByid(dto.userId );
        await this.positionModel.updateMany({user,meet}, {muted: dto.muted})

    }

    async _getMeet(link: string) {
        const meet = await this.meetModel.findOne({ link });
        if (!meet) {
            throw new BadRequestException(RoomMessagensHelper.JOIN_LINK_NOT_VALID)
        }

        return meet;
    
    
    }

}   
    

