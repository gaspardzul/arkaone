import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateMinistryDto {
  @ApiProperty({
    description: 'Nombre del ministerio',
    example: 'Ministerio de Alabanza',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @ApiProperty({
    description: 'Descripción del ministerio',
    example: 'Ministerio encargado de la música y adoración',
    required: false,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Líder del ministerio',
    example: 'Director Musical',
    required: false,
  })
  @IsString({ message: 'El líder debe ser una cadena de texto' })
  @IsOptional()
  leader?: string;

  @ApiProperty({
    description: 'Si el ministerio está activo',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'IsActive debe ser un valor booleano' })
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  churchId?: string;
}
