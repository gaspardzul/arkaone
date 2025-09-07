import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FollowUpTasksService } from './follow-up-tasks.service';
import { CreateFollowUpTaskDto } from './dto/create-follow-up-task.dto';
import { UpdateFollowUpTaskDto } from './dto/update-follow-up-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('follow-up-tasks')
@Controller('follow-up-tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FollowUpTasksController {
  constructor(private readonly followUpTasksService: FollowUpTasksService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva tarea de seguimiento' })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente' })
  create(@Body() createFollowUpTaskDto: CreateFollowUpTaskDto) {
    return this.followUpTasksService.create(createFollowUpTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas de seguimiento' })
  @ApiResponse({ status: 200, description: 'Lista de tareas de seguimiento' })
  findAll(@Request() req) {
    return this.followUpTasksService.findAll(req.user.churchId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de tareas de seguimiento' })
  @ApiResponse({ status: 200, description: 'Estadísticas de tareas' })
  getStats(@Request() req) {
    return this.followUpTasksService.getStats(req.user.churchId);
  }

  @Get('my-tasks')
  @ApiOperation({ summary: 'Obtener mis tareas asignadas' })
  @ApiResponse({ status: 200, description: 'Tareas asignadas al usuario' })
  findMyTasks(@Request() req) {
    return this.followUpTasksService.findByUser(req.user.userId);
  }

  @Get('by-member/:memberId')
  @ApiOperation({ summary: 'Obtener tareas por miembro' })
  @ApiResponse({ status: 200, description: 'Tareas del miembro' })
  findByMember(@Param('memberId') memberId: string) {
    return this.followUpTasksService.findByMember(memberId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tarea por ID' })
  @ApiResponse({ status: 200, description: 'Tarea encontrada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  findOne(@Param('id') id: string) {
    return this.followUpTasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tarea de seguimiento' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  update(@Param('id') id: string, @Body() updateFollowUpTaskDto: UpdateFollowUpTaskDto) {
    return this.followUpTasksService.update(id, updateFollowUpTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar tarea de seguimiento' })
  @ApiResponse({ status: 200, description: 'Tarea eliminada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  remove(@Param('id') id: string) {
    return this.followUpTasksService.remove(id);
  }
}
