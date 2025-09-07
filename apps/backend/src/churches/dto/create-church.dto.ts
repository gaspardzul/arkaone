import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsUrl } from 'class-validator';

export class CreateChurchDto {
  @ApiProperty({
    description: 'Nombre de la iglesia',
    example: 'Iglesia Central',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @ApiProperty({
    description: 'Dirección de la iglesia',
    example: 'Calle Principal 123',
    required: false,
  })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Teléfono de la iglesia',
    example: '+1234567890',
    required: false,
  })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Email de la iglesia',
    example: 'contacto@iglesia.com',
    required: false,
  })
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Sitio web de la iglesia',
    example: 'https://www.iglesia.com',
    required: false,
  })
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  @IsOptional()
  website?: string;

  @ApiProperty({
    description: 'Pastor principal',
    example: 'Pastor Juan Pérez',
    required: false,
  })
  @IsString({ message: 'El pastor debe ser una cadena de texto' })
  @IsOptional()
  pastor?: string;

  @ApiProperty({
    description: 'Descripción de la iglesia',
    example: 'Una iglesia comprometida con la comunidad',
    required: false,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID de la organización a la que pertenece la iglesia',
    example: 'org-123',
  })
  @IsString({ message: 'El ID de la organización debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID de la organización es requerido' })
  organizationId: string;
}
