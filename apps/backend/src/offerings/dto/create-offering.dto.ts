import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsDecimal } from 'class-validator';
import { OfferingType } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateOfferingDto {
  @ApiProperty({
    description: 'Monto de la ofrenda',
    example: 1500.50,
  })
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty({ message: 'El monto es requerido' })
  amount: number;

  @ApiProperty({
    description: 'Tipo de ofrenda',
    enum: OfferingType,
    example: OfferingType.OFFERING,
  })
  @IsEnum(OfferingType, { message: 'El tipo de ofrenda debe ser válido' })
  @IsNotEmpty({ message: 'El tipo de ofrenda es requerido' })
  type: OfferingType;

  @ApiProperty({
    description: 'Descripción de la ofrenda',
    example: 'Ofrenda del servicio dominical',
    required: false,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Fecha de la ofrenda',
    example: '2024-01-15T10:00:00Z',
  })
  @IsDateString({}, { message: 'Debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha es requerida' })
  date: string;

  @IsOptional()
  churchId?: string;
}
