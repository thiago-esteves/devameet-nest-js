import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { Meet, MeetDocument } from './schemas/meet.schema';
import { CreateMeetDto } from './dtos/createmeet.dto';
import { gererateLink } from './helpers/linkgenerator.helper';
import { MeetObject} from './schemas/meetobject.schema';
import { UpdateMeetDto } from './dtos/updatemeet.dto';
import { MeetMessagesHelper } from './helpers/meetmessages.helper';




@Injectable()
export class MeetService {
    getMeetByUser(userId: any) {
        throw new Error('Method not implemented.');
    }

    private readonly logger = new Logger(MeetService.name);

    constructor(
        @InjectModel(Meet.name) private readonly model: Model<MeetDocument>,
        @InjectModel(MeetObject.name) private readonly objectModel: Model<MeetDocument>,
        private readonly userService: UserService
    ) { }
    async getMeetsByUser(userId: String) {
        this.logger.debug('getMeetByUser - ' + userId);
        return await this.model.find({ user: userId })
    }
    async createMeet(userId: string, dto: CreateMeetDto) {
        this.logger.debug('createMeet -' + userId)
        const user = await this.userService.getUserByid(userId);
        const meet = {
            ...dto,
            user,
            link: gererateLink()
        };

        const createMeet = new this.model(meet);
        return await createMeet.save();
    }
    async deleteMeetByUser(userId: String, meetId: string) {
        this.logger.debug(`deleteMeetByUser -${userId} -${meetId}` + userId);
        return await this.model.deleteOne({ user: userId, _id: meetId })
    }
    async getMeetObjetcs(meetId: string, userId) {
        this.logger.debug(`getMeetObjects- ${userId}-${meetId}`);
        const user = await this.userService.getUserByid(userId);
        const meet = await this.model.findOne({user,_id: meetId });

        return await this.objectModel.find({meet});

    }
    async update(meetId: string, userId: string, dto: UpdateMeetDto) {

        this.logger.debug(`update- ${userId}-${meetId}`);
        const user = await this.userService.getUserByid(userId);
        const meet = await this.model.findOne({ user, _id: meetId });
        if(!meet){
            throw new BadRequestException(MeetMessagesHelper.UPDATE_MEET_NOT_FOUND);
        }
        meet.name = dto.name;
        meet.color = dto.color;
        await this.model.findByIdAndUpdate({_id:meet},meet);

        await this.objectModel.deleteMany({meet});

        let objectPayLoad;
        for (const object of dto.objects){
            objectPayLoad = {
                meet,
                ...object
            }
            await this.objectModel.create(objectPayLoad);

        }
    }

}
