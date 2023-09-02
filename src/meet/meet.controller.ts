import { Controller, Get, Request } from '@nestjs/common';
import { MeetService } from './meet.service';
import { GetMeetDto } from './dtos/getmeet.dto';
import 'rxjs/add/operator/map';


@Controller('meet')
export class MeetController {
    constructor (
        private readonly service :MeetService
    ){}
    @Get()
    async getUser(@Request()req){
        const {userId} = req?.user;

        const result = await this.service.getMeetsByUser(userId);

        return result.map(m => ({
            id: m._id.toString(),
            
            name: m.name,
            color: m.color,
            link: m.link
        }) as GetMeetDto);
    }
    }

