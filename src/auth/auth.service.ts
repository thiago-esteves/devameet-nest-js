import {BadRequestException,Injectable} from '@nestjs/common'
import { LoginDto } from "./dtos/login.dto";
import { Messageshelper } from "./helpers/messages.helper";

@Injectable()

export class AuthService {

    login(dto: LoginDto) {
        if(dto.login !== 'teste@teste.com' || dto.password !=='teste@123'){
            throw new BadRequestException(Messageshelper.AUTH_PASSWORD_OR_LOGIN_NOT_FOUND);
        }
        return dto;
    }
}
