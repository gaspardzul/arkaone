import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: createOrganizationDto,
      include: {
        churches: true,
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.organization.findMany({
      include: {
        churches: true,
        _count: {
          select: {
            churches: true,
            users: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        churches: {
          include: {
            _count: {
              select: {
                members: true,
                users: true,
                meetings: true,
                ministries: true,
              },
            },
          },
        },
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException(`Organización con ID ${id} no encontrada`);
    }

    return organization;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException(`Organización con ID ${id} no encontrada`);
    }

    return this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto,
      include: {
        churches: true,
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException(`Organización con ID ${id} no encontrada`);
    }

    return this.prisma.organization.delete({
      where: { id },
    });
  }

  async getStats(id: string) {
    const organization = await this.findOne(id);
    
    const stats = await this.prisma.organization.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            churches: true,
            users: true,
          },
        },
      },
    });

    const churchesStats = await Promise.all(
      organization.churches.map(async (church) => {
        const churchStats = await this.prisma.church.findUnique({
          where: { id: church.id },
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                members: true,
                meetings: true,
                ministries: true,
                offerings: true,
              },
            },
          },
        });

        return churchStats;
      })
    );

    return {
      organization: {
        id: organization.id,
        name: organization.name,
        totalChurches: stats._count.churches,
        totalUsers: stats._count.users,
      },
      churches: churchesStats,
    };
  }
}
