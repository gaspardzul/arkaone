import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { FollowUpStatus, TaskPriority } from '@prisma/client';

export class CreateFollowUpTaskDto {
  @ApiProperty({
    description: 'Título de la tarea',
    example: 'Visitar a Juan Pérez',
  })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título es requerido' })
  title: string;

  @ApiProperty({
    description: 'Descripción de la tarea',
    example: 'Visita pastoral para conocer su situación familiar',
    required: false,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Fecha límite para completar la tarea',
    example: '2024-01-20T10:00:00Z',
    required: false,
  })
  @IsDateString({}, { message: 'Debe ser una fecha válida' })
  @IsOptional()
  dueDate?: string;

  @ApiProperty({
    description: 'Estado de la tarea',
    enum: FollowUpStatus,
    example: FollowUpStatus.PENDING,
    required: false,
  })
  @IsEnum(FollowUpStatus, { message: 'El estado debe ser válido' })
  @IsOptional()
  status?: FollowUpStatus;

  @ApiProperty({
    description: 'Prioridad de la tarea',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
    required: false,
  })
  @IsEnum(TaskPriority, { message: 'La prioridad debe ser válida' })
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({
    description: 'Notas adicionales',
    example: 'Contactar por teléfono antes de la visita',
    required: false,
  })
  @IsString({ message: 'Las notas deben ser una cadena de texto' })
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'ID del usuario asignado',
    example: 'clxxxxx',
  })
  @IsString({ message: 'El ID del usuario asignado debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID del usuario asignado es requerido' })
  assignedToId: string;

  @ApiProperty({
    description: 'ID del miembro relacionado',
    example: 'clxxxxx',
  })
  @IsString({ message: 'El ID del miembro debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID del miembro es requerido' })
  memberId: string;
}
