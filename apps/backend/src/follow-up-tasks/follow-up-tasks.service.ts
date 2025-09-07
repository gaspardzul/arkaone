import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFollowUpTaskDto } from './dto/create-follow-up-task.dto';
import { UpdateFollowUpTaskDto } from './dto/update-follow-up-task.dto';

@Injectable()
export class FollowUpTasksService {
  constructor(private prisma: PrismaService) {}

  async create(createFollowUpTaskDto: CreateFollowUpTaskDto) {
    return this.prisma.followUpTask.create({
      data: createFollowUpTaskDto,
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
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
    });
  }

  async findAll(churchId: string) {
    return this.prisma.followUpTask.findMany({
      where: {
        assignedTo: { churchId },
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
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
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findByUser(userId: string) {
    return this.prisma.followUpTask.findMany({
      where: { assignedToId: userId },
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
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findByMember(memberId: string) {
    return this.prisma.followUpTask.findMany({
      where: { memberId },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.followUpTask.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            address: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Tarea de seguimiento no encontrada');
    }

    return task;
  }

  async update(id: string, updateFollowUpTaskDto: UpdateFollowUpTaskDto) {
    const task = await this.findOne(id);
    
    return this.prisma.followUpTask.update({
      where: { id },
      data: updateFollowUpTaskDto,
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
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
    });
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    
    return this.prisma.followUpTask.delete({
      where: { id },
    });
  }

  async getStats(churchId: string) {
    const [total, pending, inProgress, completed, overdue] = await Promise.all([
      this.prisma.followUpTask.count({
        where: { assignedTo: { churchId } },
      }),
      this.prisma.followUpTask.count({
        where: { 
          assignedTo: { churchId },
          status: 'PENDING',
        },
      }),
      this.prisma.followUpTask.count({
        where: { 
          assignedTo: { churchId },
          status: 'IN_PROGRESS',
        },
      }),
      this.prisma.followUpTask.count({
        where: { 
          assignedTo: { churchId },
          status: 'COMPLETED',
        },
      }),
      this.prisma.followUpTask.count({
        where: { 
          assignedTo: { churchId },
          status: { in: ['PENDING', 'IN_PROGRESS'] },
          dueDate: { lt: new Date() },
        },
      }),
    ]);

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue,
      cancelled: total - pending - inProgress - completed,
    };
  }
}
