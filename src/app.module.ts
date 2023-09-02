import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuards } from './auth/guards/jwt.guard';
import { MeetModule } from './meet/meet.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AuthModule,
    UserModule,
    MeetModule
  ],
    
  controllers: [],
  providers: [
    {provide:APP_GUARD, useClass: JwtAuthGuards},
    
  ],
})
export class AppModule {}
