import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SelectChurchDto {
  @ApiProperty({
    description: 'ID de la iglesia seleccionada para trabajar',
    example: 'clxxxxx',
  })
  @IsString({ message: 'El ID de la iglesia debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID de la iglesia es requerido' })
  churchId: string;
}
