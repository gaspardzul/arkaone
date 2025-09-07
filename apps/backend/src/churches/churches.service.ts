import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChurchDto } from './dto/create-church.dto';
import { UpdateChurchDto } from './dto/update-church.dto';

@Injectable()
export class ChurchesService {
  constructor(private prisma: PrismaService) {}

  async create(createChurchDto: CreateChurchDto) {
    return this.prisma.church.create({
      data: createChurchDto,
    });
  }

  async findAll() {
    return this.prisma.church.findMany({
      include: {
        _count: {
          select: {
            users: true,
            members: true,
            meetings: true,
            ministries: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const church = await this.prisma.church.findUnique({
      where: { id },
      include: {
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

    if (!church) {
      throw new NotFoundException('Iglesia no encontrada');
    }

    return church;
  }

  async update(id: string, updateChurchDto: UpdateChurchDto) {
    const church = await this.findOne(id);
    
    return this.prisma.church.update({
      where: { id },
      data: updateChurchDto,
    });
  }

  async remove(id: string) {
    const church = await this.findOne(id);
    
    return this.prisma.church.delete({
      where: { id },
    });
  }
}
