import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    return this.prisma.attendance.create({
      data: createAttendanceDto,
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        meeting: {
          select: {
            id: true,
            title: true,
            date: true,
            type: true,
          },
        },
      },
    });
  }

  async findAll(churchId: string) {
    return this.prisma.attendance.findMany({
      where: {
        meeting: { churchId },
      },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        meeting: {
          select: {
            id: true,
            title: true,
            date: true,
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByMeeting(meetingId: string) {
    return this.prisma.attendance.findMany({
      where: { meetingId },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        member: {
          firstName: 'asc',
        },
      },
    });
  }

  async findByMember(memberId: string) {
    return this.prisma.attendance.findMany({
      where: { memberId },
      include: {
        meeting: {
          select: {
            id: true,
            title: true,
            date: true,
            type: true,
            location: true,
          },
        },
      },
      orderBy: {
        meeting: {
          date: 'desc',
        },
      },
    });
  }

  async findOne(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
      include: {
        member: true,
        meeting: true,
      },
    });

    if (!attendance) {
      throw new NotFoundException('Asistencia no encontrada');
    }

    return attendance;
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    const attendance = await this.findOne(id);
    
    return this.prisma.attendance.update({
      where: { id },
      data: updateAttendanceDto,
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        meeting: {
          select: {
            id: true,
            title: true,
            date: true,
            type: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const attendance = await this.findOne(id);
    
    return this.prisma.attendance.delete({
      where: { id },
    });
  }

  async bulkCreateAttendance(meetingId: string, memberIds: string[]) {
    const attendanceData = memberIds.map(memberId => ({
      meetingId,
      memberId,
      present: false, // Por defecto false, se actualiza después
    }));

    return this.prisma.attendance.createMany({
      data: attendanceData,
      skipDuplicates: true,
    });
  }

  async getAttendanceStats(churchId: string) {
    const totalAttendances = await this.prisma.attendance.count({
      where: {
        meeting: { churchId },
      },
    });

    const presentAttendances = await this.prisma.attendance.count({
      where: {
        meeting: { churchId },
        present: true,
      },
    });

    const attendanceRate = totalAttendances > 0 ? (presentAttendances / totalAttendances) * 100 : 0;

    return {
      totalAttendances,
      presentAttendances,
      absentAttendances: totalAttendances - presentAttendances,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
    };
  }
}
