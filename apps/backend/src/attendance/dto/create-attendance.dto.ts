import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @ApiProperty({
    description: 'ID del miembro',
    example: 'clxxxxx',
  })
  @IsString({ message: 'El ID del miembro debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID del miembro es requerido' })
  memberId: string;

  @ApiProperty({
    description: 'ID de la reunión',
    example: 'clxxxxx',
  })
  @IsString({ message: 'El ID de la reunión debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID de la reunión es requerido' })
  meetingId: string;

  @ApiProperty({
    description: 'Si el miembro estuvo presente',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Present debe ser un valor booleano' })
  @IsOptional()
  present?: boolean;

  @ApiProperty({
    description: 'Notas adicionales sobre la asistencia',
    example: 'Llegó tarde',
    required: false,
  })
  @IsString({ message: 'Las notas deben ser una cadena de texto' })
  @IsOptional()
  notes?: string;
}
