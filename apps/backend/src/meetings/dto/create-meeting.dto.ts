import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { MeetingType } from '@prisma/client';

export class CreateMeetingDto {
  @ApiProperty({
    description: 'Título de la reunión',
    example: 'Servicio Dominical',
  })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título es requerido' })
  title: string;

  @ApiProperty({
    description: 'Descripción de la reunión',
    example: 'Servicio principal de adoración',
    required: false,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Fecha y hora de la reunión',
    example: '2024-01-15T10:00:00Z',
  })
  @IsDateString({}, { message: 'Debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha es requerida' })
  date: string;

  @ApiProperty({
    description: 'Tipo de reunión',
    enum: MeetingType,
    example: MeetingType.SUNDAY_SERVICE,
  })
  @IsEnum(MeetingType, { message: 'El tipo de reunión debe ser válido' })
  @IsNotEmpty({ message: 'El tipo de reunión es requerido' })
  type: MeetingType;

  @ApiProperty({
    description: 'Ubicación de la reunión',
    example: 'Santuario Principal',
    required: false,
  })
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  @IsOptional()
  location?: string;

  @IsOptional()
  churchId?: string;
}
