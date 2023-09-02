import { Controller,Get,Request,BadRequestException, Body, HttpCode, HttpStatus, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserMessagesHelper } from "./helpers/messages.helper";
import { UpdataUserDto } from "./dtos/updateuser.dto";

@Controller('user')
export class UserController{
    constructor(private readonly userService:UserService){}

    @Get()
    async getUser(@Request()req){
        const {userId} =req?.user;
        const user = await this.userService.getUserByid(userId);

        if(!user){
            throw new BadRequestException (UserMessagesHelper.GET_USER_NOT_FOUND);

        }
        return {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            id: user._id,
        }

        }

        @Put ()
        @HttpCode(HttpStatus.OK)
        async updateUser (@Request()req, @Body() dto: UpdataUserDto){
        const {userId} = req?.user;
        await this.userService.updateUser(userId,dto);

    }

}
