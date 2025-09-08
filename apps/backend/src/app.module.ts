import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ChurchesModule } from './churches/churches.module';
import { MembersModule } from './members/members.module';
import { MinistriesModule } from './ministries/ministries.module';
import { MeetingsModule } from './meetings/meetings.module';
import { AttendanceModule } from './attendance/attendance.module';
import { OfferingsModule } from './offerings/offerings.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    ChurchesModule,
    MembersModule,
    MinistriesModule,
    MeetingsModule,
    AttendanceModule,
    OfferingsModule,
    TestModule,
  ],
})
export class AppModule {}
