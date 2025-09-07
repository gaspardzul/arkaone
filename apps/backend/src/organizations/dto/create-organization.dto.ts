import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsUrl, IsBoolean } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ description: 'Nombre de la organización' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descripción de la organización', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Dirección de la organización', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Teléfono de la organización', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Email de la organización', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Sitio web de la organización', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ description: 'URL del logo de la organización', required: false })
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiProperty({ description: 'Estado activo de la organización', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
