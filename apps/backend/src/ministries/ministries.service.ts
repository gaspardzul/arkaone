import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMinistryDto } from './dto/create-ministry.dto';
import { UpdateMinistryDto } from './dto/update-ministry.dto';

@Injectable()
export class MinistriesService {
  constructor(private prisma: PrismaService) {}

  async create(createMinistryDto: CreateMinistryDto) {
    return this.prisma.ministry.create({
      data: {
        name: createMinistryDto.name,
        description: createMinistryDto.description,
        leader: createMinistryDto.leader,
        church: {
          connect: { id: createMinistryDto.churchId }
        }
      },
      include: {
        church: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
  }

  async findAll(churchId: string) {
    return this.prisma.ministry.findMany({
      where: { churchId },
      include: {
        members: {
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
          where: {
            isActive: true,
          },
        },
        _count: {
          select: {
            members: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const ministry = await this.prisma.ministry.findUnique({
      where: { id },
      include: {
        church: true,
        members: {
          include: {
            member: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                status: true,
              },
            },
          },
          orderBy: {
            joinedAt: 'desc',
          },
        },
      },
    });

    if (!ministry) {
      throw new NotFoundException('Ministerio no encontrado');
    }

    return ministry;
  }

  async update(id: string, updateMinistryDto: UpdateMinistryDto) {
    const ministry = await this.findOne(id);
    
    return this.prisma.ministry.update({
      where: { id },
      data: updateMinistryDto,
      include: {
        church: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const ministry = await this.findOne(id);
    
    return this.prisma.ministry.delete({
      where: { id },
    });
  }

  async addMember(ministryId: string, memberId: string, role?: string) {
    return this.prisma.memberMinistry.create({
      data: {
        ministryId,
        memberId,
        role,
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
        ministry: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async removeMember(ministryId: string, memberId: string) {
    const memberMinistry = await this.prisma.memberMinistry.findUnique({
      where: {
        memberId_ministryId: {
          memberId,
          ministryId,
        },
      },
    });

    if (!memberMinistry) {
      throw new NotFoundException('Miembro no encontrado en este ministerio');
    }

    return this.prisma.memberMinistry.update({
      where: {
        id: memberMinistry.id,
      },
      data: {
        isActive: false,
        leftAt: new Date(),
      },
    });
  }

  async getStats(churchId: string) {
    const [totalMinistries, activeMinistries, totalMembers] = await Promise.all([
      this.prisma.ministry.count({ where: { churchId } }),
      this.prisma.ministry.count({ where: { churchId, isActive: true } }),
      this.prisma.memberMinistry.count({
        where: {
          ministry: { churchId },
          isActive: true,
        },
      }),
    ]);

    return {
      totalMinistries,
      activeMinistries,
      inactiveMinistries: totalMinistries - activeMinistries,
      totalMembers,
    };
  }
}
