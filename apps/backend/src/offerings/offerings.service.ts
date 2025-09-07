import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferingDto } from './dto/create-offering.dto';
import { UpdateOfferingDto } from './dto/update-offering.dto';

@Injectable()
export class OfferingsService {
  constructor(private prisma: PrismaService) {}

  async create(createOfferingDto: CreateOfferingDto) {
    return this.prisma.offering.create({
      data: {
        amount: createOfferingDto.amount,
        type: createOfferingDto.type,
        date: createOfferingDto.date,
        description: createOfferingDto.description,
        church: {
          connect: { id: createOfferingDto.churchId }
        }
      },
      include: {
        church: true,
      },
    });
  }

  async findAll(churchId: string) {
    return this.prisma.offering.findMany({
      where: { churchId },
      include: {
        church: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const offering = await this.prisma.offering.findUnique({
      where: { id },
      include: {
        church: true,
      },
    });

    if (!offering) {
      throw new NotFoundException('Ofrenda no encontrada');
    }

    return offering;
  }

  async update(id: string, updateOfferingDto: UpdateOfferingDto) {
    const offering = await this.findOne(id);
    
    return this.prisma.offering.update({
      where: { id },
      data: updateOfferingDto,
      include: {
        church: true,
      },
    });
  }

  async remove(id: string) {
    const offering = await this.findOne(id);
    
    return this.prisma.offering.delete({
      where: { id },
    });
  }

  async getStats(churchId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [totalOfferings, thisMonth, thisYear, byType] = await Promise.all([
      this.prisma.offering.aggregate({
        where: { churchId },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.offering.aggregate({
        where: {
          churchId,
          date: { gte: startOfMonth },
        },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.offering.aggregate({
        where: {
          churchId,
          date: { gte: startOfYear },
        },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.offering.groupBy({
        by: ['type'],
        where: { churchId },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return {
      total: {
        amount: totalOfferings._sum.amount || 0,
        count: totalOfferings._count,
      },
      thisMonth: {
        amount: thisMonth._sum.amount || 0,
        count: thisMonth._count,
      },
      thisYear: {
        amount: thisYear._sum.amount || 0,
        count: thisYear._count,
      },
      byType: byType.map(item => ({
        type: item.type,
        amount: item._sum.amount || 0,
        count: item._count,
      })),
    };
  }

  async getMonthlyReport(churchId: string, year: number) {
    const months = [];
    
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const monthData = await this.prisma.offering.aggregate({
        where: {
          churchId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: { amount: true },
        _count: true,
      });

      months.push({
        month: month + 1,
        monthName: startDate.toLocaleString('es', { month: 'long' }),
        amount: monthData._sum.amount || 0,
        count: monthData._count,
      });
    }

    return months;
  }
}
