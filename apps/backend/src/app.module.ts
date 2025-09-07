import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ChurchesModule } from './churches/churches.module';
import { MembersModule } from './members/members.module';
import { MeetingsModule } from './meetings/meetings.module';
import { AttendanceModule } from './attendance/attendance.module';
import { MinistriesModule } from './ministries/ministries.module';
import { FollowUpTasksModule } from './follow-up-tasks/follow-up-tasks.module';
import { OfferingsModule } from './offerings/offerings.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    ChurchesModule,
    MembersModule,
    MeetingsModule,
    AttendanceModule,
    MinistriesModule,
    FollowUpTasksModule,
    OfferingsModule,
  ],
})
export class AppModule {}
