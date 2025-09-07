import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(private prisma: PrismaService) {}

  async create(createMeetingDto: CreateMeetingDto) {
    return this.prisma.meeting.create({
      data: {
        title: createMeetingDto.title,
        description: createMeetingDto.description,
        date: createMeetingDto.date,
        type: createMeetingDto.type,
        location: createMeetingDto.location,
        church: {
          connect: { id: createMeetingDto.churchId }
        }
      },
      include: {
        church: true,
        _count: {
          select: {
            attendances: true,
          },
        },
      },
    });
  }

  async findAll(churchId: string) {
    return this.prisma.meeting.findMany({
      where: { churchId },
      include: {
        _count: {
          select: {
            attendances: {
              where: { present: true },
            },
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: {
        church: true,
        attendances: {
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
        },
      },
    });

    if (!meeting) {
      throw new NotFoundException('Reunión no encontrada');
    }

    return meeting;
  }

  async update(id: string, updateMeetingDto: UpdateMeetingDto) {
    const meeting = await this.findOne(id);
    
    return this.prisma.meeting.update({
      where: { id },
      data: updateMeetingDto,
      include: {
        church: true,
        _count: {
          select: {
            attendances: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const meeting = await this.findOne(id);
    
    return this.prisma.meeting.delete({
      where: { id },
    });
  }

  async getStats(churchId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    const [totalMeetings, thisMonth, thisWeek, totalAttendances, totalPossibleAttendances] = await Promise.all([
      this.prisma.meeting.count({ where: { churchId } }),
      this.prisma.meeting.count({
        where: {
          churchId,
          date: { gte: startOfMonth },
        },
      }),
      this.prisma.meeting.count({
        where: {
          churchId,
          date: { gte: startOfWeek },
        },
      }),
      this.prisma.attendance.count({
        where: {
          meeting: {
            churchId,
          },
          present: true,
        },
      }),
      this.prisma.attendance.count({
        where: {
          meeting: {
            churchId,
          },
        },
      }),
    ]);

    const avgAttendanceRate = totalPossibleAttendances > 0 
      ? (totalAttendances / totalPossibleAttendances) * 100 
      : 0;

    return {
      totalMeetings,
      thisMonth,
      thisWeek,
      avgAttendance: Math.round(avgAttendanceRate),
    };
  }
}
