import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SelectChurchDto } from './dto/select-church.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Get default church if not provided
    const defaultChurch = await this.prisma.church.findFirst({
      include: { organization: true }
    });
    const churchId = createUserDto.churchId || defaultChurch?.id;
    
    // Get the church with its organization to connect both relationships
    const selectedChurch = await this.prisma.church.findUnique({
      where: { id: churchId },
      include: { organization: true }
    });

    if (!selectedChurch) {
      throw new NotFoundException('Iglesia no encontrada');
    }
    
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        password: hashedPassword,
        role: createUserDto.role,
        church: {
          connect: { id: churchId }
        },
        organization: {
          connect: { id: selectedChurch.organizationId }
        }
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        churchId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async findAll(churchId: string) {
    return this.prisma.user.findMany({
      where: { churchId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        churchId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        church: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        church: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    
    const updateData: any = { ...updateUserDto };
    
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        churchId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserChurches(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        church: true,
        churchAccess: {
          where: { isActive: true },
          include: {
            church: {
              include: {
                organization: true,
              },
            },
          },
        },
        organization: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // Combinar iglesia principal con iglesias de acceso
    const churches = [];
    
    if (user.church) {
      churches.push({
        ...user.church,
        role: user.role,
        isPrimary: true,
      });
    }

    user.churchAccess.forEach(access => {
      if (access.church.id !== user.churchId) {
        churches.push({
          ...access.church,
          role: access.role,
          isPrimary: false,
        });
      }
    });

    return churches;
  }

  async getAvailableChurches(userId: string) {
    console.log('🚨🚨🚨 SERVICIO EJECUTÁNDOSE - getAvailableChurches 🚨🚨🚨');
    console.log('🔍 Debug Service - Buscando usuario con ID:', userId);
    console.log('🔍 Debug Service - Tipo de userId:', typeof userId);
    console.log('🔍 Debug Service - Longitud del ID:', userId?.length);
    
    // Primero buscar todos los usuarios para debug
    const allUsers = await this.prisma.user.findMany({
      select: { id: true, email: true }
    });
    console.log('🔍 Debug Service - Todos los usuarios:', allUsers);
    console.log('🔍 Debug Service - Comparando IDs:');
    allUsers.forEach(u => {
      console.log(`  - BD: "${u.id}" vs Buscado: "${userId}" -> Match: ${u.id === userId}`);
    });
    
    console.log('🔍 Debug Service - Ejecutando consulta Prisma...');
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        church: {
          include: {
            organization: true,
          },
        },
        churchAccess: {
          where: { isActive: true },
          include: {
            church: {
              include: {
                organization: true,
              },
            },
          },
        },
      },
    });

    console.log('🔍 Debug Service - Usuario encontrado:', user ? 'SÍ' : 'NO');
    if (user) {
      console.log('🔍 Debug Service - Usuario ID:', user.id);
      console.log('🔍 Debug Service - Usuario email:', user.email);
    }

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const availableChurches = [];

    // Agregar iglesia principal
    if (user.church) {
      availableChurches.push({
        id: user.church.id,
        name: user.church.name,
        organization: user.church.organization,
        role: user.role,
        isPrimary: true,
        canAccess: true,
      });
    }

    // Agregar iglesias con acceso adicional
    user.churchAccess.forEach(access => {
      if (access.church.id !== user.churchId) {
        availableChurches.push({
          id: access.church.id,
          name: access.church.name,
          organization: access.church.organization,
          role: access.role,
          isPrimary: false,
          canAccess: access.isActive,
        });
      }
    });

    // Si no tiene iglesias asignadas, devolver array vacío con mensaje informativo
    if (availableChurches.length === 0) {
      return {
        churches: [],
        message: 'Este usuario no tiene iglesias asignadas. Contacta al administrador para asignar una iglesia.',
        hasAccess: false
      };
    }

    return {
      churches: availableChurches,
      message: null,
      hasAccess: true
    };
  }

  async validateChurchAccess(userId: string, churchId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        churchAccess: {
          where: { 
            churchId: churchId,
            isActive: true 
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // Verificar si es su iglesia principal
    if (user.churchId === churchId) {
      return true;
    }

    // Verificar si tiene acceso adicional a esta iglesia
    return user.churchAccess.length > 0;
  }

  async selectChurch(userId: string, selectChurchDto: SelectChurchDto) {
    const { churchId } = selectChurchDto;

    // Validar que el usuario tenga acceso a esta iglesia
    const hasAccess = await this.validateChurchAccess(userId, churchId);
    
    if (!hasAccess) {
      throw new ForbiddenException('No tienes acceso a esta iglesia');
    }

    // Obtener información de la iglesia seleccionada
    const church = await this.prisma.church.findUnique({
      where: { id: churchId },
      include: {
        organization: true,
      },
    });

    if (!church) {
      throw new NotFoundException('Iglesia no encontrada');
    }

    return {
      churchId: church.id,
      churchName: church.name,
      organizationId: church.organizationId,
      organizationName: church.organization.name,
      message: `Contexto cambiado a iglesia: ${church.name}`,
    };
  }
}
