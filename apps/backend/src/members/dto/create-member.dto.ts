import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { MemberStatus } from '@prisma/client';

export class CreateMemberDto {
  @ApiProperty({
    description: 'Nombre del miembro',
    example: 'Juan',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del miembro',
    example: 'Pérez',
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es requerido' })
  lastName: string;

  @ApiProperty({
    description: 'Email del miembro',
    example: 'juan.perez@example.com',
    required: false,
  })
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Teléfono del miembro',
    example: '+1234567890',
    required: false,
  })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Dirección del miembro',
    example: 'Calle Principal 123',
    required: false,
  })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento',
    example: '1990-05-15',
    required: false,
  })
  @IsDateString({}, { message: 'Debe ser una fecha válida' })
  @IsOptional()
  birthDate?: string;

  @ApiProperty({
    description: 'Fecha de bautismo',
    example: '2010-12-25',
    required: false,
  })
  @IsDateString({}, { message: 'Debe ser una fecha válida' })
  @IsOptional()
  baptismDate?: string;

  @ApiProperty({
    description: 'Estado del miembro',
    enum: MemberStatus,
    example: MemberStatus.ACTIVE,
    required: false,
  })
  @IsEnum(MemberStatus, { message: 'El estado debe ser válido' })
  @IsOptional()
  status?: MemberStatus;

  @ApiProperty({
    description: 'Notas adicionales',
    example: 'Información adicional sobre el miembro',
    required: false,
  })
  @IsString({ message: 'Las notas deben ser una cadena de texto' })
  @IsOptional()
  notes?: string;

  @IsOptional()
  churchId?: string;
}
