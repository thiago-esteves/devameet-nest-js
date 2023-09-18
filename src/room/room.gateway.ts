import {  OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Logger } from '@nestjs/common';
import { Server,Socket} from 'socket.io';
import { JoinRoomDto } from './dtos/joinroom.dto';
import { UpdateUserPositionDto } from './dtos/updateposition.dto';
import { ToglMuteDto } from './dtos/toglMute.dto';




type ActiveSocketsType = {
  room : String,
  id : string,
  userId:string
}

@WebSocketGateway({cors:true})
export class RoomGateway implements OnGatewayInit,OnGatewayDisconnect {

  constructor (private readonly service:RoomService){}
  @WebSocketServer() wss: Server;

  private logger= new Logger(RoomGateway.name);
  private activeSockets: ActiveSocketsType [] =[];

  
    handleDisconnect(client:any) {
    this.logger.debug(`Client:${client.id}disconnected`)
   
    
  }
  afterInit(server: any) {
  this.logger.log('Gateway initialized');
    
  }
  @SubscribeMessage('join')
  async handleJoin(client:Socket, payload: JoinRoomDto){
    const {link, userId} = payload;

    const existingOnSocket = this.activeSockets.find(
      socket => socket.room === link && socket.id === client.id );

      if(!existingOnSocket){
        this.activeSockets.push({room:link,id:client.id,userId});
        const dto ={
          link,
          userId,
          x:2,
          y:2,
          orientation: 'down'

        } as UpdateUserPositionDto
        await this.service.updataUserPosition(client.id,dto);
        const users =await this.service.listaUsersPositionByLink(link);

        this.wss.emit(`${link}-update-user-list`,{users});
        client.broadcast.emit(`${link}-update-user-list`,{users});
      }
      this.logger.debug(`Socket client: ${client.id} start to join room ${link}`);
    }
    @SubscribeMessage('move')
    async handleMove(client:Socket,payload:UpdateUserPositionDto){
      const {link,userId,x,y,orientation} = payload;
      const dto ={
        link,
        userId,
        x,
        y,
        orientation
      } as UpdateUserPositionDto
      await this.service.updataUserPosition(client.id,dto);
      const users = await this.service.listaUsersPositionByLink(link);
      this.wss.emit(`${link}-update-user-list`,{users});
    }
    @SubscribeMessage('toggl-mute-user')
    async handleToglMute(client:Socket,payload: ToglMuteDto){
      const {link} = payload;
      await this.service.updateUserMute(payload);
      const users = await this.service.listaUsersPositionByLink(link);
      this.wss.emit(`${link}-update-user-list`,{users});
    }
    @SubscribeMessage('call-user')
    async callUser( client: Socket, data: any){
      this.logger.debug(`callUser: ${client.id} to: ${data.to}`);
      client.to(data.to).emit('call-made', {
        offer: data.offer,
        socket: client.id
      });
    }
      @SubscribeMessage('make-answer')
      async makeAnswer(client: Socket, data: any ){
        this.logger.debug(`makeAnswer: ${client.id} to: ${data.to}`);
        client.to(data.to).emit('answer-made', {
          answer: data.answer,
          socket: client.id
  });
}

}

