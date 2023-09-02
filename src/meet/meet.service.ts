import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { Meet, MeetDocument } from './schemas/meet.schema';
import { GetMeetDto } from './dtos/getmeet.dto';
import { CreateMeetDto } from './dtos/createmeet.dto';
import { gererateLink } from './helpers/linkgenerator.helper';


@Injectable()
export class MeetService {
    getMeetByUser(userId: any) {
        throw new Error('Method not implemented.');
    }

    private readonly logger = new Logger(MeetService.name);
    
    constructor(
        @InjectModel(Meet.name) private readonly model: Model<MeetDocument>,
        private readonly userService:UserService
    ){}
    async getMeetsByUser(userId:String){
        this.logger.debug('getMeetByUser - ' +userId);
        return await this.model.find({user: userId}) 
    }
    async createMeet (userId:string, dto:CreateMeetDto){
        this.logger.debug('createMeet -' + userId)
        const user = await this.userService.getUserByid(userId);
        const meet={ 
            ...dto,
            user,
            link :gererateLink()
        };

        const createMeet = new this.model(meet);
        return await createMeet.save();
    }
    async deleteMeetByUser(userId:String, meetId:string){
        this.logger.debug(`deleteMeetByUser -${userId} -${meetId}` +userId);
        return await this.model.deleteOne({user: userId,_id:meetId}) 
}


}
