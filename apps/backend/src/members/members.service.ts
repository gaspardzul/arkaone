import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async create(createMemberDto: CreateMemberDto) {
    return this.prisma.member.create({
      data: {
        firstName: createMemberDto.firstName,
        lastName: createMemberDto.lastName,
        email: createMemberDto.email,
        phone: createMemberDto.phone,
        address: createMemberDto.address,
        birthDate: createMemberDto.birthDate,
        status: createMemberDto.status,
        church: {
          connect: { id: createMemberDto.churchId }
        }
      },
      include: {
        church: true,
        ministries: {
          include: {
            ministry: true,
          },
        },
      },
    });
  }

  async findAll(churchId: string) {
    return this.prisma.member.findMany({
      where: { churchId },
      include: {
        ministries: {
          include: {
            ministry: true,
          },
        },
        _count: {
          select: {
            attendances: true,
            followUpTasks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: {
        church: true,
        ministries: {
          include: {
            ministry: true,
          },
        },
        attendances: {
          include: {
            meeting: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        followUpTasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Miembro no encontrado');
    }

    return member;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) {
    const member = await this.findOne(id);
    
    return this.prisma.member.update({
      where: { id },
      data: updateMemberDto,
      include: {
        church: true,
        ministries: {
          include: {
            ministry: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const member = await this.findOne(id);
    
    return this.prisma.member.delete({
      where: { id },
    });
  }

  async getStats(churchId: string) {
    const [total, active, visitors, members] = await Promise.all([
      this.prisma.member.count({ where: { churchId } }),
      this.prisma.member.count({ where: { churchId, status: 'ACTIVE' } }),
      this.prisma.member.count({ where: { churchId, status: 'VISITOR' } }),
      this.prisma.member.count({ where: { churchId, status: 'MEMBER' } }),
    ]);

    return {
      total,
      active,
      visitors,
      members,
      inactive: total - active,
    };
  }
}
